'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Link2 } from 'lucide-react';
import { api } from '@/lib/api';

const PLATFORM_META: Record<string, { label: string; initial: string; color: string }> = {
  INSTAGRAM: { label: 'Instagram', initial: 'IG', color: '#E1306C' },
  TIKTOK: { label: 'TikTok', initial: 'TT', color: '#FF0050' },
  LINKEDIN: { label: 'LinkedIn', initial: 'IN', color: '#0A66C2' },
  TWITTER: { label: 'X / Twitter', initial: 'X', color: '#1DA1F2' },
  FACEBOOK: { label: 'Facebook', initial: 'FB', color: '#1877F2' },
  YOUTUBE: { label: 'YouTube', initial: 'YT', color: '#FF0000' },
  PINTEREST: { label: 'Pinterest', initial: 'PI', color: '#E60023' },
  THREADS: { label: 'Threads', initial: 'TH', color: '#A1A1A1' },
};

export function PlatformBreakdown() {
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

  const platforms: any[] = data?.platformBreakdown ?? [];

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Platform Breakdown
          </h3>
          <p className="text-xs text-white/40 mt-0.5">Performance by network</p>
        </div>
        <div className="text-right">
          <div style={{ fontFamily: 'var(--font-display)' }} className="text-lg font-bold text-white">
            {(data?.totalFollowers ?? 0).toLocaleString()}
          </div>
          <div className="text-xs text-white/40">Total followers</div>
        </div>
      </div>

      {loading ? (
        <div className="px-5 py-12 text-center">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#C9A84C]" />
          <p className="text-xs text-white/30 mt-2">Loading analytics…</p>
        </div>
      ) : !data?.hasConnectedAccounts ? (
        <div className="px-5 py-10 text-center">
          <Link2 className="w-8 h-8 mx-auto mb-3 text-[#C9A84C]/60" />
          <p className="text-sm text-white/70 font-medium mb-1">No platforms connected</p>
          <p className="text-xs text-white/40 mb-4 max-w-xs mx-auto">
            Connect your social media accounts to see real follower counts, engagement, and reach per platform.
          </p>
          <Link href="/dashboard/integrations" className="text-xs text-[#C9A84C] hover:text-[#E8C96A] font-medium">
            Connect accounts →
          </Link>
        </div>
      ) : (
        <>
          {/* Combined bar */}
          {data.totalFollowers > 0 && (
            <div className="px-5 py-3 border-b border-white/[0.04]">
              <div className="flex rounded-full overflow-hidden h-2 gap-px">
                {platforms.map((p: any) => {
                  const meta = PLATFORM_META[p.platform] || { color: '#888' };
                  const pct = data.totalFollowers > 0 ? (p.followers / data.totalFollowers) * 100 : 0;
                  return (
                    <div key={p.id || p.platform} style={{ width: `${pct}%`, background: meta.color }}
                      className="transition-all" title={`${meta.label || p.platform}: ${pct.toFixed(1)}%`} />
                  );
                })}
              </div>
            </div>
          )}

          {/* Platform rows */}
          <div className="divide-y divide-white/[0.04]">
            {platforms.map((p: any) => {
              const meta = PLATFORM_META[p.platform] || { label: p.platform, initial: '??', color: '#888' };
              const pct = data.totalFollowers > 0 ? (p.followers / data.totalFollowers) * 100 : 0;
              const engRate = p.reach > 0 ? ((p.engagement / p.reach) * 100).toFixed(1) : '0.0';
              return (
                <div key={p.id || p.platform} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: `${meta.color}25`, border: `1px solid ${meta.color}35` }}>
                    {meta.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-white/80 truncate">
                        {meta.label} <span className="text-white/30 text-xs">{p.username}</span>
                      </span>
                      <span className="text-xs font-bold text-white">{p.followers.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/[0.06] rounded-full h-1">
                      <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: meta.color }} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 min-w-[60px]">
                    <div className="text-xs font-medium text-[#E8C96A]">{engRate}%</div>
                    <div className="text-[10px] text-white/30">eng. rate</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="px-5 py-3 border-t border-white/[0.06]">
        <Link href="/dashboard/integrations" className="text-xs text-[#C9A84C] hover:text-[#3385FF] font-medium transition-colors">
          + Connect more platforms
        </Link>
      </div>
    </div>
  );
}
