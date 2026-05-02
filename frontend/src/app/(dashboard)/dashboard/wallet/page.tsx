'use client';

import { useState } from 'react';
import { Wallet, ArrowDownToLine, Clock, Check, AlertCircle, Smartphone, CreditCard, Building2, Download } from 'lucide-react';

const TRANSACTIONS = [
  { id: '1', type: 'CREDIT', desc: 'Safaricom campaign payout', amount: 38250, date: 'Apr 15, 2025', status: 'completed', note: 'After 15% commission from KES 45,000' },
  { id: '2', type: 'WITHDRAWAL', desc: 'M-Pesa withdrawal', amount: -20000, date: 'Apr 12, 2025', status: 'completed', note: '+254 7XX XXX XXX' },
  { id: '3', type: 'CREDIT', desc: 'M-KOPA Solar campaign payout', amount: 23800, date: 'Apr 8, 2025', status: 'completed', note: 'After 15% commission from KES 28,000' },
  { id: '4', type: 'COMMISSION', desc: 'Yoyzie AI commission (15%)', amount: -6750, date: 'Apr 8, 2025', status: 'completed', note: 'Platform fee on KES 45,000 campaign' },
  { id: '5', type: 'CREDIT', desc: 'Jumia Flash Sale campaign', amount: 17000, date: 'Apr 1, 2025', status: 'pending', note: 'Awaiting brand approval' },
];

const WITHDRAW_METHODS = [
  { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, color: '#00A651', desc: 'Instant • Min KES 500', detail: '+254 712 345 678' },
  { id: 'paypal', label: 'PayPal', icon: CreditCard, color: '#0070BA', desc: '1-2 business days • Min KES 2,000', detail: 'jerry@example.com' },
  { id: 'bank', label: 'Bank Transfer', icon: Building2, color: '#888888', desc: '2-3 business days • Min KES 5,000', detail: 'Equity Bank ••••4567' },
];

export default function WalletPage() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('mpesa');
  const [withdrawStep, setWithdrawStep] = useState<'idle' | 'form' | 'otp' | 'success'>('idle');
  const [otp, setOtp] = useState('');

  const balance = 24500;
  const pending = 17000;

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl sm:text-3xl font-bold text-white">Wallet</h1>
        <p className="text-white/40 text-sm mt-1">Manage your campaign earnings and withdrawals</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 border border-[#E8C96A]/20 sm:col-span-1"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(0,102,255,0.04))' }}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-[#E8C96A]" />
            <span className="text-xs text-white/50">Available balance</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)' }} className="text-4xl font-bold text-white mb-1">
            KES {balance.toLocaleString()}
          </div>
          <p className="text-xs text-white/30">Ready to withdraw</p>
          <button onClick={() => setWithdrawStep('form')}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-[#E8C96A] text-white hover:opacity-90 transition-all">
            <ArrowDownToLine className="w-4 h-4" /> Withdraw funds
          </button>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-xs text-white/50">Pending approval</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white mb-1">
            KES {pending.toLocaleString()}
          </div>
          <p className="text-xs text-white/30">Released after brand confirms delivery</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-xs text-white/50">Total earned (April)</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white mb-1">
            KES 73,000
          </div>
          <p className="text-xs text-[#E8C96A]">↑ 34% from March</p>
        </div>
      </div>

      {/* Withdraw Form */}
      {withdrawStep === 'form' && (
        <div className="glass rounded-2xl border border-[#E8C96A]/20 p-6">
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-5">Withdraw funds</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {WITHDRAW_METHODS.map(method => (
              <button key={method.id} onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-xl border text-left transition-all ${selectedMethod === method.id ? 'border-[#E8C96A]/40 bg-[#E8C96A]/08' : 'border-white/[0.06] hover:border-white/15'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <method.icon className="w-4 h-4" style={{ color: method.color }} />
                  <span className="text-sm font-medium text-white">{method.label}</span>
                </div>
                <p className="text-[10px] text-white/40">{method.desc}</p>
                <p className="text-[10px] text-white/50 mt-1">{method.detail}</p>
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="text-xs text-white/50 block mb-1.5">Amount to withdraw (KES)</label>
            <input type="number" placeholder="0"
              value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-lg font-bold text-white placeholder-white/25 outline-none focus:border-[#E8C96A]/40 transition-all" />
            <div className="flex justify-between text-xs text-white/30 mt-1.5">
              <span>Available: KES {balance.toLocaleString()}</span>
              <button onClick={() => setWithdrawAmount(balance.toString())} className="text-[#E8C96A] hover:text-white transition-colors">Withdraw all</button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setWithdrawStep('idle')}
              className="flex-1 py-3 rounded-xl text-sm border border-white/10 text-white/50 hover:text-white transition-all">
              Cancel
            </button>
            <button onClick={() => setWithdrawStep('otp')}
              className="flex-1 py-3 rounded-xl text-sm font-medium bg-[#E8C96A] text-white hover:opacity-90 transition-all">
              Continue
            </button>
          </div>
        </div>
      )}

      {withdrawStep === 'otp' && (
        <div className="glass rounded-2xl border border-[#E8C96A]/20 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#E8C96A]/15 border border-[#E8C96A]/25 flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-6 h-6 text-[#E8C96A]" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Confirm withdrawal</h3>
          <p className="text-xs text-white/40 mb-5">Enter the OTP sent to +254 712 345 678 to confirm withdrawal of KES {Number(withdrawAmount).toLocaleString()}</p>
          <div className="flex gap-2 justify-center mb-5">
            {[0,1,2,3,4,5].map(i => (
              <input key={i} type="text" maxLength={1}
                className="w-10 h-12 text-center text-lg font-bold text-white bg-white/[0.05] border border-white/10 rounded-xl outline-none focus:border-[#E8C96A]/40 transition-all" />
            ))}
          </div>
          <button onClick={() => setWithdrawStep('success')}
            className="w-full py-3 rounded-xl text-sm font-medium bg-[#E8C96A] text-white hover:opacity-90 transition-all">
            Confirm withdrawal
          </button>
        </div>
      )}

      {withdrawStep === 'success' && (
        <div className="glass rounded-2xl border border-[#E8C96A]/20 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#E8C96A]/20 border border-[#E8C96A]/30 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-[#E8C96A]" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Withdrawal initiated!</h3>
          <p className="text-xs text-white/40 mb-5">KES {Number(withdrawAmount).toLocaleString()} is being sent to your M-Pesa. You'll receive an SMS confirmation shortly.</p>
          <button onClick={() => { setWithdrawStep('idle'); setWithdrawAmount(''); }} className="text-sm text-[#E8C96A] hover:text-white transition-colors">Done</button>
        </div>
      )}

      {/* Transaction History */}
      <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">Transaction history</h3>
          <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
            <Download className="w-3.5 h-3.5" /> Export statement
          </button>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                tx.type === 'CREDIT' ? 'bg-[#E8C96A]/15' : tx.type === 'COMMISSION' ? 'bg-[#F59E0B]/15' : 'bg-white/[0.06]'
              }`}>
                {tx.type === 'CREDIT' ? <ArrowDownToLine className="w-4 h-4 text-[#E8C96A] rotate-180" />
                  : tx.type === 'COMMISSION' ? <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                  : <ArrowDownToLine className="w-4 h-4 text-white/40" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 truncate">{tx.desc}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{tx.date} · {tx.note}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-[#E8C96A]' : 'text-white/50'}`}>
                  {tx.amount > 0 ? '+' : ''}KES {Math.abs(tx.amount).toLocaleString()}
                </p>
                <p className={`text-[10px] mt-0.5 ${tx.status === 'pending' ? 'text-[#F59E0B]' : 'text-white/30'}`}>
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
