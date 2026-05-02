'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DATA = [
  { type: 'Reels / Video', engagement: 8.4, reach: 94, color: '#C9A84C' },
  { type: 'Carousels', engagement: 6.8, reach: 78, color: '#E8C96A' },
  { type: 'Static image', engagement: 4.2, reach: 62, color: '#A855F7' },
  { type: 'Stories', engagement: 3.8, reach: 71, color: '#FF6B35' },
  { type: 'Text only', engagement: 2.9, reach: 48, color: '#F59E0B' },
  { type: 'Links', engagement: 2.1, reach: 42, color: '#EC4899' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 p-3 shadow-xl text-xs" style={{ background: '#0D0D0D' }}>
      <p className="text-white font-medium mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-white/60 capitalize">{p.name}:</span>
          <span className="text-white font-medium">{p.value}{p.dataKey === 'engagement' ? '%' : '%'}</span>
        </div>
      ))}
    </div>
  );
};

export function ContentBreakdown() {
  return (
    <div className="glass rounded-2xl p-5 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Content type performance
          </h3>
          <p className="text-xs text-white/40 mt-0.5">Avg. engagement rate by format</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#C9A84C]" />
            <span className="text-white/40">Engagement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-white/20" />
            <span className="text-white/40">Reach score</span>
          </div>
        </div>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="type" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              axisLine={false} tickLine={false} interval={0} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="engagement" name="Engagement %" radius={[4,4,0,0]}>
              {DATA.map((entry, i) => <Cell key={i} fill={entry.color} opacity={0.85} />)}
            </Bar>
            <Bar dataKey="reach" name="Reach score" radius={[4,4,0,0]} fill="rgba(255,255,255,0.08)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insight */}
      <div className="mt-4 p-3 rounded-xl bg-[#C9A84C]/08 border border-[#C9A84C]/20">
        <p className="text-xs text-white/60 leading-relaxed">
          <span className="text-[#C9A84C] font-medium">AI insight:</span> Reels and video content outperform static images by{' '}
          <span className="text-white font-medium">2x</span> on engagement. Consider shifting 30% of your static posts to short-form video.
        </p>
      </div>
    </div>
  );
}
