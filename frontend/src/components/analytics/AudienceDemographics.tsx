'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const AGE_DATA = [
  { name: '13–17', value: 4, color: '#C9A84C' },
  { name: '18–24', value: 28, color: '#E8C96A' },
  { name: '25–34', value: 35, color: '#A855F7' },
  { name: '35–44', value: 19, color: '#FF6B35' },
  { name: '45–54', value: 9, color: '#F59E0B' },
  { name: '55+', value: 5, color: '#EC4899' },
];

const GENDER_DATA = [
  { name: 'Female', value: 58, color: '#A855F7' },
  { name: 'Male', value: 38, color: '#C9A84C' },
  { name: 'Other', value: 4, color: '#E8C96A' },
];

const TOP_COUNTRIES = [
  { country: 'United States', flag: '🇺🇸', pct: 34, followers: 10006 },
  { country: 'United Kingdom', flag: '🇬🇧', pct: 12, followers: 3531 },
  { country: 'Canada', flag: '🇨🇦', pct: 9, followers: 2648 },
  { country: 'Australia', flag: '🇦🇺', pct: 7, followers: 2060 },
  { country: 'Germany', flag: '🇩🇪', pct: 5, followers: 1471 },
  { country: 'India', flag: '🇮🇳', pct: 4, followers: 1177 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 px-3 py-2 shadow-xl text-xs" style={{ background: '#0D0D0D' }}>
      <span className="text-white font-medium">{payload[0].name}: {payload[0].value}%</span>
    </div>
  );
};

export function AudienceDemographics() {
  const [tab, setTab] = useState<'age' | 'gender' | 'location'>('age');

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
          Audience demographics
        </h3>
        <p className="text-xs text-white/40 mt-0.5">Who follows you across all platforms</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] px-3">
        {(['age', 'gender', 'location'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-medium capitalize transition-all border-b-2 -mb-px ${
              tab === t ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-white/40 hover:text-white/70'
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-5">
        {tab === 'location' ? (
          <div className="space-y-3">
            {TOP_COUNTRIES.map(c => (
              <div key={c.country}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <span className="text-sm text-white/70">{c.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40">{c.followers.toLocaleString()}</span>
                    <span className="text-sm font-bold text-white w-8 text-right">{c.pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-white/[0.06] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-[#C9A84C] transition-all"
                    style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-40 h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tab === 'age' ? AGE_DATA : GENDER_DATA}
                    cx="50%" cy="50%" innerRadius={44} outerRadius={70}
                    paddingAngle={2} dataKey="value">
                    {(tab === 'age' ? AGE_DATA : GENDER_DATA).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {(tab === 'age' ? AGE_DATA : GENDER_DATA).map(item => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-xs text-white/60">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{item.value}%</span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1">
                    <div className="h-1 rounded-full transition-all"
                      style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
