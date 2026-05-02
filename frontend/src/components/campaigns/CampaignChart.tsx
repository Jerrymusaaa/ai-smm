'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DATA = [
  { name: 'Week 1', reach: 42000, clicks: 3200, conversions: 180 },
  { name: 'Week 2', reach: 58000, clicks: 4800, conversions: 240 },
  { name: 'Week 3', reach: 51000, clicks: 4100, conversions: 210 },
  { name: 'Week 4', reach: 74000, clicks: 6200, conversions: 380 },
  { name: 'Week 5', reach: 68000, clicks: 5800, conversions: 320 },
  { name: 'Week 6', reach: 89000, clicks: 7400, conversions: 420 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 p-3 shadow-xl text-xs" style={{ background: '#0D0D0D' }}>
      <p className="text-white/50 mb-2 font-medium">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-white/60 capitalize">{p.dataKey}:</span>
          <span className="text-white font-medium">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export function CampaignChart() {
  return (
    <div className="glass rounded-2xl p-5 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Campaign Performance
          </h3>
          <p className="text-xs text-white/40 mt-0.5">Reach, clicks and conversions over time</p>
        </div>
        <select className="bg-white/[0.05] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white/60 outline-none">
          <option>Last 6 weeks</option>
          <option>Last 3 months</option>
          <option>Last 6 months</option>
        </select>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="reach" fill="#C9A84C" radius={[4,4,0,0]} opacity={0.8} />
            <Bar dataKey="clicks" fill="#E8C96A" radius={[4,4,0,0]} opacity={0.8} />
            <Bar dataKey="conversions" fill="#A855F7" radius={[4,4,0,0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-6 mt-3 justify-center">
        {[
          { label: 'Reach', color: '#C9A84C' },
          { label: 'Clicks', color: '#E8C96A' },
          { label: 'Conversions', color: '#A855F7' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
            <span className="text-xs text-white/40">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
