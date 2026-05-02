'use client';

import { Download, CheckCircle2, XCircle, Clock } from 'lucide-react';

const INVOICES = [
  { id: 'INV-2025-004', date: 'Apr 1, 2025', amount: '$39.00', plan: 'Pro Plan', status: 'paid', period: 'Apr 2025' },
  { id: 'INV-2025-003', date: 'Mar 1, 2025', amount: '$39.00', plan: 'Pro Plan', status: 'paid', period: 'Mar 2025' },
  { id: 'INV-2025-002', date: 'Feb 1, 2025', amount: '$39.00', plan: 'Pro Plan', status: 'paid', period: 'Feb 2025' },
  { id: 'INV-2025-001', date: 'Jan 1, 2025', amount: '$39.00', plan: 'Pro Plan', status: 'paid', period: 'Jan 2025' },
  { id: 'INV-2024-012', date: 'Dec 1, 2024', amount: '$49.00', plan: 'Pro Plan', status: 'paid', period: 'Dec 2024' },
  { id: 'INV-2024-011', date: 'Nov 1, 2024', amount: '$49.00', plan: 'Pro Plan', status: 'failed', period: 'Nov 2024' },
];

const STATUS_CONFIG = {
  paid: { label: 'Paid', icon: CheckCircle2, color: '#E8C96A', bg: 'rgba(0,212,170,0.1)' },
  failed: { label: 'Failed', icon: XCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  pending: { label: 'Pending', icon: Clock, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
};

export function InvoiceHistory() {
  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Invoice history
          </h3>
          <p className="text-xs text-white/40 mt-0.5">{INVOICES.length} invoices</p>
        </div>
        <button className="text-xs text-[#C9A84C] hover:text-[#3385FF] transition-colors font-medium">
          Download all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Invoice', 'Date', 'Amount', 'Plan', 'Status', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium text-white/30">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {INVOICES.map(inv => {
              const status = STATUS_CONFIG[inv.status as keyof typeof STATUS_CONFIG];
              return (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono text-white/60">{inv.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-white/60">{inv.date}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span style={{ fontFamily: 'var(--font-display)' }}
                      className="text-sm font-bold text-white">{inv.amount}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-white/50">{inv.plan} · {inv.period}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 w-fit px-2 py-1 rounded-full"
                      style={{ background: status.bg }}>
                      <status.icon className="w-3 h-3" style={{ color: status.color }} />
                      <span className="text-[10px] font-medium" style={{ color: status.color }}>
                        {status.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="flex items-center gap-1 text-xs text-white/30 hover:text-white transition-colors">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
