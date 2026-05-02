'use client';

import { Users2, TrendingUp, DollarSign, Star, Handshake, Target } from 'lucide-react';

const STATS = [
  { label: 'Total influencers', value: '500K+', icon: Users2, color: '#C9A84C' },
  { label: 'Avg. engagement', value: '4.8%', icon: TrendingUp, color: '#E8C96A' },
  { label: 'Avg. campaign ROI', value: '6.2x', icon: DollarSign, color: '#A855F7' },
  { label: 'Avg. creator rating', value: '4.7★', icon: Star, color: '#F59E0B' },
  { label: 'Active campaigns', value: '2,840', icon: Handshake, color: '#FF6B35' },
  { label: 'Niches covered', value: '200+', icon: Target, color: '#EC4899' },
];

export function MarketplaceStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {STATS.map(s => (
        <div key={s.label} className="glass rounded-2xl p-4 border border-white/[0.06] feature-card">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
            style={{ background: `${s.color}18`, color: s.color }}>
            <s.icon className="w-4 h-4" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', color: s.color }}
            className="text-2xl font-bold mb-0.5">{s.value}</div>
          <div className="text-xs text-white/40">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
