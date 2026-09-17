import crypto from 'crypto';
import axios from 'axios';
import { logger } from '../../shared/utils/logger';

/**
 * Safaricom M-Pesa (Daraja) integration.
 *
 * Supports:
 *  - B2C payouts (influencer withdrawals to M-Pesa)
 *  - STK Push (customer pays subscription via M-Pesa)
 *  - OAuth token management (cached until expiry)
 *
 * Configuration (env vars):
 *  MPESA_ENV=sandbox|production
 *  MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET   — Daraja app credentials
 *  MPESA_SHORTCODE                              — Business shortcode (e.g. paybill)
 *  MPESA_PASSKEY                                — Lipa na M-Pesa Online passkey
 *  MPESA_INITIATOR_NAME / MPESA_INITIATOR_PASSWORD — for B2C
 *  MPESA_CALLBACK_URL                           — public https callback base
 *  MPESA_TYPE                                   — 'paybill' (4 digits) or 'till' (5 digits)
 */
const BASE_URL = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const SHORTCODE = process.env.MPESA_SHORTCODE || '';
const PASSKEY = process.env.MPESA_PASSKEY || '';

let cachedToken: { value: string; expiresAt: number } | null = null;

function isConfigured(): boolean {
  return !!(process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET);
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  if (!isConfigured()) {
    throw new Error('M-Pesa is not configured (MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET missing)');
  }

  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  const res = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
    timeout: 10000,
  });

  cachedToken = {
    value: res.data.access_token,
    expiresAt: Date.now() + (res.data.expires_in - 60) * 1000, // refresh 1 min early
  };
  return cachedToken.value;
}

/** Timestamp format Daraja requires: YYYYMMDDHHmmss */
function timestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

export class MpesaService {
  /**
   * B2C — send money from the business shortcode to a customer's M-Pesa.
   * Used for influencer payout withdrawals.
   */
  async b2cPayment(params: {
    phoneNumber: string;   // e.g. 254712345678
    amount: number;
    reason?: string;       // e.g. 'Yoyzie wallet payout'
  }): Promise<{ conversationId: string; transactionId?: string }> {
    const token = await getAccessToken();
    const phone = params.phoneNumber.replace(/[^0-9]/g, '').replace(/^0/, '254');

    const payload = {
      InitiatorName: process.env.MPESA_INITIATOR_NAME,
      SecurityCredential: Buffer.from(process.env.MPESA_INITIATOR_PASSWORD || '').toString('base64'),
      CommandID: 'BusinessPayment',           // | SalaryPayment | PromotionPayment
      Amount: Math.round(params.amount),
      PartyA: phone,
      PartyB: SHORTCODE,
      Remarks: params.reason || 'Yoyzie payout',
      QueueTimeOutURL: `${process.env.MPESA_CALLBACK_URL || process.env.API_URL}/api/wallet/mpesa/timeout`,
      ResultURL: `${process.env.MPESA_CALLBACK_URL || process.env.API_URL}/api/wallet/mpesa/result`,
      Occasion: 'Payout',
    };

    const res = await axios.post(`${BASE_URL}/mpesa/b2c/v3/paymentrequest`, payload, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    logger.info(`M-Pesa B2C initiated: ${res.data.ConversationID} to ${phone}`);
    return { conversationId: res.data.ConversationID, transactionId: res.data.TransactionID };
  }

  /**
   * STK Push — prompt a customer to pay via their phone (Lipa na M-Pesa Online).
   * Used for subscription checkout.
   */
  async stkPush(params: {
    phoneNumber: string;
    amount: number;
    accountReference: string;  // e.g. user id or invoice no
    description: string;
  }): Promise<{ checkoutRequestId: string; merchantRequestId: string }> {
    if (!SHORTCODE || !PASSKEY) {
      throw new Error('M-Pesa STK is not configured (MPESA_SHORTCODE / MPESA_PASSKEY missing)');
    }
    const token = await getAccessToken();
    const phone = params.phoneNumber.replace(/[^0-9]/g, '').replace(/^0/, '254');
    const ts = timestamp();
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${ts}`).toString('base64');

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: ts,
      TransactionType: process.env.MPESA_TYPE === 'till' ? 'CustomerBuyGoodsOnline' : 'CustomerPayBillOnline',
      Amount: Math.round(params.amount),
      PartyA: phone,
      PartyB: SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: `${process.env.MPESA_CALLBACK_URL || process.env.API_URL}/api/wallet/mpesa/stk-callback`,
      AccountReference: params.accountReference.slice(0, 12),
      TransactionDesc: params.description.slice(0, 20),
    };

    const res = await axios.post(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, payload, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    logger.info(`M-Pesa STK push initiated: ${res.data.CheckoutRequestID}`);
    return {
      checkoutRequestId: res.data.CheckoutRequestID,
      merchantRequestId: res.data.MerchantRequestID,
    };
  }

  /** Handle the B2C result callback (delivery report). */
  parseB2cResult(body: any): { ok: boolean; receipt?: string; message: string } {
    const result = body?.Result ?? body;
    const resultCode = result?.ResultCode;
    const receipt = result?.TransactionID;
    return {
      ok: resultCode === 0,
      receipt,
      message: result?.ResultDesc || (resultCode === 0 ? 'Payout sent' : 'Payout failed'),
    };
  }

  /** Handle the STK push callback. */
  parseStkCallback(body: any): { ok: boolean; receipt?: string; message: string } {
    const stk = body?.Body?.stkCallback;
    if (!stk) return { ok: false, message: 'Malformed callback' };
    const receipt = stk.CallbackMetadata?.Item?.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
    return {
      ok: stk.ResultCode === 0,
      receipt,
      message: stk.ResultDesc || (stk.ResultCode === 0 ? 'Payment received' : 'Payment cancelled'),
    };
  }
}

export const mpesaService = new MpesaService();
export const mpesaConfigured = isConfigured;
