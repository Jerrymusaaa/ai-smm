'use client';

import { Calendar, CreditCard, TrendingUp, Zap } from 'lucide-react';

export function BillingOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[
        {
          label: 'Current plan', value: 'Pro Plan', sub: 'Billed annually',
          icon: Zap, color: '#0066FF',
          extra: <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0066FF]/20 text-[#0066FF] font-medium">Active</span>,
        },
        {
          label: 'Next billing date', value: 'May 1, 2025', sub: '$39.00 due',
          icon: Calendar, color: '#00D4AA', extra: null,
        },
        {
          label: 'Payment method', value: 'Visa •••• 4242', sub: 'Expires 04/27',
          icon: CreditCard, color: '#A855F7', extra: null,
        },
        {
          label: 'Total spent', value: '$468.00', sub: 'Since Jan 2025',
          icon: TrendingUp, color: '#FF6B35', extra: null,
        },
      ].map(item => (
        <div key={item.label} className="glass rounded-2xl p-5 border border-white/[0.06] feature-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${item.color}18`, color: item.color }}>
              <item.icon className="w-4 h-4" />
            </div>
            {item.extra}
          </div>
          <div style={{ fontFamily: 'var(--font-display)' }}
            className="text-lg font-bold text-white mb-0.5">{item.value}</div>
          <div className="text-xs text-white/40">{item.label}</div>
          <div className="text-[10px] text-white/25 mt-0.5">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}
