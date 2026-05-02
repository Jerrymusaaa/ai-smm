'use client';

import { Zap, Calendar, Users, Brain, BarChart3, Globe } from 'lucide-react';

const USAGE_ITEMS = [
  {
    label: 'Social platforms', icon: Globe, color: '#C9A84C',
    used: 4, limit: 10, unit: 'platforms',
  },
  {
    label: 'Scheduled posts', icon: Calendar, color: '#E8C96A',
    used: 847, limit: -1, unit: 'posts',
  },
  {
    label: 'AI captions generated', icon: Brain, color: '#A855F7',
    used: 2840, limit: -1, unit: 'captions',
  },
  {
    label: 'Team seats', icon: Users, color: '#FF6B35',
    used: 1, limit: 1, unit: 'seats',
  },
  {
    label: 'Analytics history', icon: BarChart3, color: '#F59E0B',
    used: 90, limit: 90, unit: 'days',
  },
  {
    label: 'API calls', icon: Zap, color: '#EC4899',
    used: 0, limit: 0, unit: 'calls',
  },
];

export function UsageOverview() {
  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
          Usage this month
        </h3>
        <p className="text-xs text-white/40 mt-0.5">Resets on May 1, 2025</p>
      </div>
      <div className="p-5 space-y-4">
        {USAGE_ITEMS.map(item => {
          const isUnlimited = item.limit === -1;
          const isUnavailable = item.limit === 0;
          const pct = isUnlimited || isUnavailable ? 0 : (item.used / item.limit) * 100;
          const isNearLimit = pct >= 80;

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: `${item.color}18`, color: item.color }}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-white/70">{item.label}</span>
                </div>
                <div className="text-xs font-medium text-right">
                  {isUnavailable ? (
                    <span className="text-white/25">Not included</span>
                  ) : isUnlimited ? (
                    <span className="text-[#E8C96A]">{item.used.toLocaleString()} · Unlimited</span>
                  ) : (
                    <span className={isNearLimit ? 'text-[#F59E0B]' : 'text-white/60'}>
                      {item.used} / {item.limit} {item.unit}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-white/[0.06] rounded-full h-1.5">
                {!isUnlimited && !isUnavailable && (
                  <div className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      background: pct >= 90 ? '#EF4444' : pct >= 80 ? '#F59E0B' : item.color,
                    }} />
                )}
                {isUnlimited && (
                  <div className="h-1.5 rounded-full w-full shimmer" style={{ background: `${item.color}30` }} />
                )}
              </div>
              {isNearLimit && !isUnlimited && (
                <p className="text-[10px] text-[#F59E0B] mt-1">
                  Approaching limit — consider upgrading
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
