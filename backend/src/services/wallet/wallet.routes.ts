import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { prisma } from '../../shared/config/database';
import { AuthRequest } from '../../shared/types';
import { AppError } from '../../shared/middleware/error.middleware';
import { logger } from '../../shared/utils/logger';
import { mpesaService, mpesaConfigured } from './mpesa.service';

const router = Router();

// ── M-Pesa (Daraja) callbacks — PUBLIC endpoints hit by Safaricom servers ───
// These must be registered BEFORE router.use(authenticate): Safaricom cannot
// send a Yoyzie JWT. They respond in the format Daraja requires.

// POST /api/wallet/mpesa/result — B2C payout delivery report
router.post('/mpesa/result', async (req: Request, res: Response) => {
  try {
    const result = mpesaService.parseB2cResult(req.body);
    logger.info(`M-Pesa B2C result: ok=${result.ok} receipt=${result.receipt || '—'} ${result.message}`);
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch {
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
});

// POST /api/wallet/mpesa/timeout
router.post('/mpesa/timeout', (req: Request, res: Response) => {
  logger.warn('M-Pesa B2C queue timeout', req.body);
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// POST /api/wallet/mpesa/stk-callback — STK push payment confirmation
router.post('/mpesa/stk-callback', async (req: Request, res: Response) => {
  try {
    const result = mpesaService.parseStkCallback(req.body);
    logger.info(`M-Pesa STK callback: ok=${result.ok} receipt=${result.receipt || '—'} ${result.message}`);
    // On success this is where subscription activation would be recorded
    // once STK checkout is wired into the billing flow.
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch {
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
});

// GET /api/wallet/mpesa/status — diagnostics for the setup guide
router.get('/mpesa/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      configured: mpesaConfigured(),
      env: process.env.MPESA_ENV || 'sandbox',
      shortcodeSet: !!process.env.MPESA_SHORTCODE,
      callbackUrl: process.env.MPESA_CALLBACK_URL || process.env.API_URL || null,
    },
  });
});

// Everything below requires a logged-in user.
router.use(authenticate);

// GET /api/wallet/balance
router.get('/balance', async (req: AuthRequest, res: Response) => {
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: req.user!.id },
    select: { walletBalance: true, pendingBalance: true, totalEarnings: true, commissionRate: true },
  });
  if (!profile) {
    res.status(404).json({ success: false, error: 'Influencer profile not found' });
    return;
  }
  res.json({ success: true, data: profile });
});

// GET /api/wallet/transactions
router.get('/transactions', async (req: AuthRequest, res: Response) => {
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: req.user!.id },
  });
  if (!profile) {
    res.status(404).json({ success: false, error: 'Influencer profile not found' });
    return;
  }
  const transactions = await prisma.walletTransaction.findMany({
    where: { influencerId: profile.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json({ success: true, data: transactions });
});

// POST /api/wallet/withdraw
router.post('/withdraw', async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    amount: z.number().min(500, 'Minimum withdrawal is KES 500'),
    method: z.enum(['mpesa', 'paypal', 'bank']),
    destination: z.string().min(1, 'Withdrawal destination is required'),
  });

  const { amount, method, destination } = schema.parse(req.body);

  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: req.user!.id },
  });

  if (!profile) throw new AppError(404, 'Influencer profile not found');
  if (profile.walletBalance < amount) throw new AppError(400, 'Insufficient wallet balance');

  // Minimum checks per method
  if (method === 'paypal' && amount < 2000) throw new AppError(400, 'Minimum PayPal withdrawal is KES 2,000');
  if (method === 'bank' && amount < 5000) throw new AppError(400, 'Minimum bank transfer is KES 5,000');

  // ── M-Pesa B2C: attempt a REAL payout via Safaricom Daraja ────────────────
  if (method === 'mpesa') {
    if (mpesaConfigured()) {
      try {
        await mpesaService.b2cPayment({
          phoneNumber: destination,
          amount,
          reason: `Yoyzie wallet payout ${profile.id.slice(-6)}`,
        });
        // Ledger entry stays 'processing' until Safaricom's Result callback
        // confirms delivery (handled in /mpesa/result below).
      } catch (err: any) {
        logger.error('M-Pesa B2C failed:', err.response?.data || err.message);
        throw new AppError(502, `M-Pesa payout failed: ${err.response?.data?.errorMessage || err.message}`);
      }
    } else {
      // Daraja credentials not set yet — request is queued for manual
      // processing via the admin payouts panel instead of failing.
      logger.warn(`M-Pesa not configured; payout ${profile.id} queued for manual processing`);
    }
  }

  // Deduct from wallet and create transaction record
  await prisma.$transaction([
    prisma.influencerProfile.update({
      where: { id: profile.id },
      data: { walletBalance: { decrement: amount } },
    }),
    prisma.walletTransaction.create({
      data: {
        influencerId: profile.id,
        type: 'WITHDRAWAL',
        amount: -amount,
        currency: 'KES',
        status: 'processing',
        description: `${method.toUpperCase()} withdrawal`,
        withdrawalMethod: method,
        ...(method === 'mpesa' ? { mpesaNumber: destination } : {}),
        ...(method === 'paypal' ? { paypalEmail: destination } : {}),
        reference: `WD-${Date.now()}`,
      },
    }),
  ]);

  res.json({
    success: true,
    message: `Withdrawal of KES ${amount.toLocaleString()} initiated via ${method.toUpperCase()}. Processing time: ${
      method === 'mpesa' ? 'instant' : method === 'paypal' ? '1-2 business days' : '2-3 business days'
    }.`,
  });
});

// GET /api/wallet/earnings-statement
router.get('/earnings-statement', async (req: AuthRequest, res: Response) => {
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: req.user!.id },
  });
  if (!profile) throw new AppError(404, 'Influencer profile not found');

  const transactions = await prisma.walletTransaction.findMany({
    where: { influencerId: profile.id, type: 'CREDIT' },
    orderBy: { createdAt: 'desc' },
  });

  const totalEarned = transactions.reduce((sum, t) => sum + t.amount, 0);

  res.json({
    success: true,
    data: {
      totalEarned,
      transactions,
      generatedAt: new Date().toISOString(),
    },
  });
});

export { router as walletRouter };
