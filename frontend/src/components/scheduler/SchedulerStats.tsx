'use client';

import { CalendarDays, Clock, CheckCircle2, TrendingUp, Zap, AlertCircle } from 'lucide-react';

const STATS = [
  { label: 'Scheduled', value: '24', icon: CalendarDays, color: '#C9A84C' },
  { label: 'Published today', value: '3', icon: CheckCircle2, color: '#E8C96A' },
  { label: 'Pending approval', value: '7', icon: Clock, color: '#F59E0B' },
  { label: 'Best time accuracy', value: '94%', icon: TrendingUp, color: '#A855F7' },
  { label: 'Auto-posted', value: '142', icon: Zap, color: '#FF6B35' },
  { label: 'Failed', value: '1', icon: AlertCircle, color: '#EF4444' },
];

export function SchedulerStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {STATS.map(stat => (
        <div key={stat.label} className="glass rounded-2xl p-4 border border-white/[0.06] feature-card">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
            style={{ background: `${stat.color}18`, color: stat.color }}>
            <stat.icon className="w-4 h-4" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', color: stat.color }}
            className="text-2xl font-bold mb-0.5">{stat.value}</div>
          <div className="text-xs text-white/40">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
