'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Loader2, Link2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

const RANGES = [
  { key: '7', label: '7D' },
  { key: '30', label: '30D' },
  { key: '90', label: '90D' },
];

export function EngagementChart() {
  const [range, setRange] = useState('30');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.analytics.overview(Number(range))
      .then(res => {
        if (cancelled) return;
        setData(res.data?.data ?? null);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [range]);

  const chartData = data?.chartData ?? [];

  return (
    <div className="glass rounded-2xl border border-white/[0.06] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Engagement Overview
          </h3>
          <p className="text-xs text-white/40 mt-0.5">
            {data?.hasConnectedAccounts ? `${data.period} · real data from your connected accounts` : 'Real data appears once accounts are connected'}
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {RANGES.map(r => (
            <button key={r.key} onClick={() => setRange(r.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={range === r.key
                ? { background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0A0A0A' }
                : { color: 'rgba(255,255,255,0.4)' }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-[#C9A84C]" />
        </div>
      ) : !data?.hasConnectedAccounts ? (
        <div className="h-64 flex flex-col items-center justify-center text-center">
          <Link2 className="w-8 h-8 mb-3 text-[#C9A84C]/60" />
          <p className="text-sm text-white/70 font-medium mb-1">No data yet</p>
          <p className="text-xs text-white/40 mb-4 max-w-xs">
            Connect your social accounts and publish through Yoyzie — your engagement, reach and impressions will chart here in real time.
          </p>
          <Link href="/dashboard/integrations" className="text-xs text-[#C9A84C] hover:text-[#E8C96A] font-medium">
            Connect accounts →
          </Link>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="engagementGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8C96A" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#E8C96A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="reachTeal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={40} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#0D0D0F', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12 }}
                labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                itemStyle={{ color: '#E8C96A' }}
              />
              <Area type="monotone" dataKey="reach" stroke="#00D4AA" strokeWidth={1.5} fill="url(#reachTeal)" name="Reach" />
              <Area type="monotone" dataKey="engagement" stroke="#E8C96A" strokeWidth={2} fill="url(#engagementGold)" name="Engagement" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
