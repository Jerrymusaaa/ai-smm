'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Users, Heart, Eye, MousePointerClick, Share2, Loader2, Link2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: '#E1306C',
  TIKTOK: '#FF0050',
  LINKEDIN: '#0A66C2',
  TWITTER: '#1DA1F2',
  FACEBOOK: '#1877F2',
  YOUTUBE: '#FF0000',
  PINTEREST: '#E60023',
  THREADS: '#A1A1A1',
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function StatsCards() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.analytics.overview(30)
      .then(res => {
        if (cancelled) return;
        setData(res.data?.data ?? null);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="stat-card glass rounded-2xl border border-white/[0.06] p-5">
            <Loader2 className="w-4 h-4 animate-spin text-[#C9A84C]/50" />
          </div>
        ))}
      </div>
    );
  }

  if (!data?.hasConnectedAccounts) {
    return (
      <div className="glass rounded-2xl border border-[#C9A84C]/20 p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
          <Link2 className="w-5 h-5 text-[#E8C96A]" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold text-white">Connect your social accounts to see real analytics</p>
          <p className="text-xs text-white/50 mt-1">
            Once connected, your real follower counts, engagement, impressions and reach will appear here — no sample numbers.
          </p>
        </div>
        <Link href="/dashboard/integrations" className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0A0A0A' }}>
          Connect accounts
        </Link>
      </div>
    );
  }

  const totalEngagement = data.totalEngagements ?? 0;
  const totalImpressions = data.totalImpressions ?? 0;
  const totalReach = data.totalReach ?? 0;
  const totalClicks = data.totalClicks ?? 0;

  const STAT_ITEMS = [
    {
      label: 'Total Followers',
      value: formatNumber(data.totalFollowers ?? 0),
      sub: `${data.connectedAccounts ?? 0} account${(data.connectedAccounts ?? 0) === 1 ? '' : 's'} connected`,
      icon: Users,
      color: '#C9A84C',
      sparkColor: '#C9A84C',
      sparkData: data.chartData?.slice(-12).map((d: any) => d.followers ?? 0) ?? [],
    },
    {
      label: 'Total Engagement',
      value: formatNumber(totalEngagement),
      sub: `${data.engagementRate ?? '0'}% rate`,
      icon: Heart,
      color: '#E8C96A',
      sparkColor: '#E8C96A',
      sparkData: data.chartData?.slice(-12).map((d: any) => d.engagement ?? 0) ?? [],
    },
    {
      label: 'Impressions',
      value: formatNumber(totalImpressions),
      sub: `${data.postsCount ?? 0} posts in period`,
      icon: Eye,
      color: '#A855F7',
      sparkColor: '#A855F7',
      sparkData: data.chartData?.slice(-12).map((d: any) => d.impressions ?? 0) ?? [],
    },
    {
      label: 'Total Reach',
      value: formatNumber(totalReach),
      sub: `${formatNumber(totalClicks)} link clicks`,
      icon: MousePointerClick,
      color: '#00D4AA',
      sparkColor: '#00D4AA',
      sparkData: data.chartData?.slice(-12).map((d: any) => d.reach ?? 0) ?? [],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_ITEMS.map(stat => {
        const max = Math.max(...stat.sparkData, 1);
        return (
          <div key={stat.label} className="stat-card glass rounded-2xl border border-white/[0.06] p-5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <Share2 className="w-3.5 h-3.5 text-white/10" />
            </div>
            <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {stat.value}
            </div>
            <div className="flex items-center justify-between mt-1 mb-3">
              <span className="text-xs text-white/40">{stat.label}</span>
            </div>
            <p className="text-[11px] text-white/30">{stat.sub}</p>
            {/* Real sparkline from chart data */}
            {stat.sparkData.length > 0 && (
              <div className="flex items-end gap-0.5 h-6 mt-3">
                {stat.sparkData.map((v: number, i: number) => (
                  <div key={i} className="flex-1 rounded-t"
                    style={{ height: `${Math.max((v / max) * 100, 4)}%`, background: stat.sparkColor, opacity: 0.25 + (i / stat.sparkData.length) * 0.55 }} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
