'use client';

import { useState } from 'react';
import { Wallet, ArrowDownToLine, Clock, Check, AlertCircle, Smartphone, CreditCard, Building2, Download, TrendingUp, Zap } from 'lucide-react';

const TRANSACTIONS = [
  { id: '1', type: 'CREDIT',     desc: 'Safaricom Home Fibre Campaign',  amount: 38250,  date: 'Apr 15, 2025', status: 'completed', note: 'After 15% commission from KES 45,000' },
  { id: '2', type: 'WITHDRAWAL', desc: 'M-Pesa withdrawal',               amount: -20000, date: 'Apr 12, 2025', status: 'completed', note: '+254 7XX XXX XXX' },
  { id: '3', type: 'CREDIT',     desc: 'M-KOPA Solar Panel Campaign',     amount: 23800,  date: 'Apr 8,  2025', status: 'completed', note: 'After 15% commission from KES 28,000' },
  { id: '4', type: 'COMMISSION', desc: 'Yoyzie AI commission (15%)',       amount: -6750,  date: 'Apr 8,  2025', status: 'completed', note: 'Platform fee on KES 45,000 campaign' },
  { id: '5', type: 'CREDIT',     desc: 'Jumia Flash Sale Promo',           amount: 17000,  date: 'Apr 1,  2025', status: 'pending',   note: 'Awaiting brand approval' },
];

const METHODS = [
  { id: 'mpesa',  label: 'M-Pesa',         icon: Smartphone,  color: '#00A651', desc: 'Instant · Min KES 500',           detail: '+254 712 345 678' },
  { id: 'paypal', label: 'PayPal',          icon: CreditCard,  color: '#0070BA', desc: '1–2 business days · Min KES 2,000', detail: 'jerry@example.com' },
  { id: 'bank',   label: 'Bank Transfer',   icon: Building2,   color: '#888888', desc: '2–3 business days · Min KES 5,000', detail: 'Equity Bank ••••4567' },
];

type WithdrawStep = 'idle' | 'form' | 'otp' | 'success';

export default function WalletPage() {
  const [amount, setAmount]       = useState('');
  const [method, setMethod]       = useState('mpesa');
  const [step, setStep]           = useState<WithdrawStep>('idle');

  const balance = 24500;
  const pending = 17000;

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}
          className="text-2xl sm:text-3xl font-bold text-white">Wallet</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Manage your campaign earnings and withdrawals
        </p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Available */}
        <div className="rounded-2xl p-6 border sm:col-span-1"
          style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.1),rgba(232,201,106,0.04))', borderColor: 'rgba(201,168,76,0.25)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4" style={{ color: '#C9A84C' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Available balance</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)' }} className="text-4xl font-bold text-white mb-1">
            KES {balance.toLocaleString()}
          </div>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Ready to withdraw</p>
          <button onClick={() => setStep('form')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
            <ArrowDownToLine className="w-4 h-4" /> Withdraw funds
          </button>
        </div>

        {/* Pending */}
        <div className="rounded-2xl p-6 border glass"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" style={{ color: '#F59E0B' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Pending approval</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white mb-1">
            KES {pending.toLocaleString()}
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Released after brand confirms delivery
          </p>
        </div>

        {/* Earned */}
        <div className="rounded-2xl p-6 border glass"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" style={{ color: '#C9A84C' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Total earned (April)</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white mb-1">
            KES 73,000
          </div>
          <p className="text-xs" style={{ color: '#E8C96A' }}>↑ 34% from March</p>
        </div>
      </div>

      {/* Commission info */}
      <div className="rounded-2xl p-4 border flex items-center gap-4"
        style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.15)' }}>
        <Zap className="w-5 h-5 flex-shrink-0" style={{ color: '#C9A84C' }} />
        <div className="flex-1">
          <p className="text-sm font-medium text-white">You&apos;re on Influencer Pro — 15% commission</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Upgrade to Creator Mode (10%) — save KES 7,500 on a KES 50,000 campaign
          </p>
        </div>
        <button className="text-xs font-medium whitespace-nowrap transition-colors hover:text-white"
          style={{ color: '#C9A84C' }}>
          Upgrade →
        </button>
      </div>

      {/* Withdraw form */}
      {step === 'form' && (
        <div className="rounded-2xl border p-6 glass"
          style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-5">
            Withdraw funds
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {METHODS.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className="p-4 rounded-xl border text-left transition-all"
                style={{
                  borderColor: method === m.id ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)',
                  background:  method === m.id ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <m.icon className="w-4 h-4" style={{ color: m.color }} />
                  <span className="text-sm font-medium text-white">{m.label}</span>
                </div>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.desc}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{m.detail}</p>
              </button>
            ))}
          </div>
          <div className="mb-5">
            <label className="text-xs block mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Amount (KES)
            </label>
            <input type="number" placeholder="0" value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-lg font-bold text-white outline-none border transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.2)' }} />
            <div className="flex justify-between mt-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <span>Available: KES {balance.toLocaleString()}</span>
              <button onClick={() => setAmount(String(balance))}
                style={{ color: '#C9A84C' }}>Withdraw all</button>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('idle')}
              className="flex-1 py-3 rounded-xl text-sm border transition-all"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
              Cancel
            </button>
            <button onClick={() => setStep('otp')}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* OTP confirmation */}
      {step === 'otp' && (
        <div className="rounded-2xl border p-8 glass text-center"
          style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
            <Smartphone className="w-6 h-6" style={{ color: '#C9A84C' }} />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Confirm withdrawal</h3>
          <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Enter the OTP sent to +254 712 345 678 to confirm
            KES {Number(amount).toLocaleString()} withdrawal
          </p>
          <div className="flex gap-2 justify-center mb-6">
            {[0,1,2,3,4,5].map(i => (
              <input key={i} type="text" maxLength={1}
                className="w-10 h-12 text-center text-lg font-bold text-white rounded-xl border outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.2)' }} />
            ))}
          </div>
          <button onClick={() => setStep('success')}
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
            Confirm withdrawal
          </button>
        </div>
      )}

      {/* Success */}
      {step === 'success' && (
        <div className="rounded-2xl border p-8 glass text-center"
          style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)' }}>
            <Check className="w-6 h-6" style={{ color: '#E8C96A' }} />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Withdrawal initiated!</h3>
          <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            KES {Number(amount).toLocaleString()} is being sent to your M-Pesa.
            You&apos;ll receive an SMS confirmation shortly.
          </p>
          <button onClick={() => { setStep('idle'); setAmount(''); }}
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: '#C9A84C' }}>
            Done
          </button>
        </div>
      )}

      {/* Transaction history */}
      <div className="rounded-2xl border glass overflow-hidden"
        style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Transaction history
          </h3>
          <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <div>
          {TRANSACTIONS.map(tx => (
            <div key={tx.id}
              className="flex items-center gap-4 px-5 py-4 border-b transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.02)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: tx.type === 'CREDIT' ? 'rgba(201,168,76,0.12)'
                    : tx.type === 'COMMISSION' ? 'rgba(245,158,11,0.12)'
                    : 'rgba(255,255,255,0.04)',
                }}>
                {tx.type === 'CREDIT'
                  ? <TrendingUp className="w-4 h-4" style={{ color: '#C9A84C' }} />
                  : tx.type === 'COMMISSION'
                  ? <AlertCircle className="w-4 h-4" style={{ color: '#F59E0B' }} />
                  : <ArrowDownToLine className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{tx.desc}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {tx.date} · {tx.note}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold"
                  style={{ color: tx.amount > 0 ? '#E8C96A' : 'rgba(255,255,255,0.5)' }}>
                  {tx.amount > 0 ? '+' : ''}KES {Math.abs(tx.amount).toLocaleString()}
                </p>
                <p className="text-[10px] mt-0.5"
                  style={{ color: tx.status === 'pending' ? '#F59E0B' : 'rgba(255,255,255,0.3)' }}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
