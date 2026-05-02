'use client';

import { Megaphone, TrendingUp, DollarSign, MousePointerClick, Eye, Target } from 'lucide-react';

const STATS = [
  { label: 'Active campaigns', value: '8', icon: Megaphone, color: '#C9A84C', change: '+2 this month' },
  { label: 'Total reach', value: '2.4M', icon: Eye, color: '#E8C96A', change: '+18% vs last month' },
  { label: 'Avg. engagement', value: '6.8%', icon: TrendingUp, color: '#A855F7', change: '+1.2% vs last month' },
  { label: 'Total clicks', value: '84.2K', icon: MousePointerClick, color: '#FF6B35', change: '+24% vs last month' },
  { label: 'Campaign ROI', value: '280%', icon: Target, color: '#F59E0B', change: '+40% vs last month' },
  { label: 'Ad spend', value: '$4,280', icon: DollarSign, color: '#EC4899', change: '-8% vs last month' },
];

export function CampaignStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {STATS.map(stat => (
        <div key={stat.label} className="glass rounded-2xl p-4 border border-white/[0.06] feature-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${stat.color}18`, color: stat.color }}>
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', color: stat.color }}
            className="text-2xl font-bold mb-0.5">{stat.value}</div>
          <div className="text-xs text-white/50 mb-1">{stat.label}</div>
          <div className="text-[10px] text-white/30">{stat.change}</div>
        </div>
      ))}
    </div>
  );
}
