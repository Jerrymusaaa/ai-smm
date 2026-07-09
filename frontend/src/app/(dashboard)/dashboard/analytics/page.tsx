'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3, TrendingUp, Users, Eye, Heart,
  Link, RefreshCw, Loader2, Sparkles, AlertCircle,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import api from '@/lib/api';
import { usePlan } from '@/hooks/usePlan';
import { FeatureGate } from '@/components/ui/FeatureGate';

const PERIODS = ['7', '30', '90'];

const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: '#E1306C', TIKTOK: '#FF0050', TWITTER: '#1DA1F2',
  LINKEDIN: '#0A66C2', FACEBOOK: '#1877F2', YOUTUBE: '#FF0000',
  PINTEREST: '#E60023', THREADS: '#6364FF', DEFAULT: '#C9A84C',
};

function StatCard({ label, value, sub, icon: Icon, change, color = '#C9A84C' }: any) {
  const positive = change >= 0;
  return (
    <div className="glass rounded-2xl p-5 border" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-medium`}
            style={{ color: positive ? '#C9A84C' : '#EF4444' }}>
            {positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-white mb-0.5">
        {value}
      </div>
      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
      {sub && <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{sub}</div>}
    </div>
  );
}

function NoAccountsState() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <Link className="w-8 h-8" style={{ color: '#C9A84C' }} />
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold text-white mb-2">
        No connected accounts yet
      </h3>
      <p className="text-sm max-w-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Connect your Instagram, TikTok, Twitter, or LinkedIn accounts to see your real analytics here.
      </p>
      <button
        onClick={() => router.push('/dashboard/settings?tab=integrations')}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
        <Link className="w-4 h-4" /> Connect social accounts
      </button>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border p-3 shadow-xl"
      style={{ background: '#0A0A0A', borderColor: 'rgba(201,168,76,0.2)' }}>
      <p className="text-xs font-medium text-white mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>{p.name}:</span>
          <span className="font-medium text-white">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { can, plan } = usePlan();
  const [period, setPeriod] = useState('30');
  const [data, setData] = useState<any>(null);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeMetric, setActiveMetric] = useState('impressions');
  const [error, setError] = useState('');

  const analyticsHistory = plan.analyticsHistory;
  const maxDays = analyticsHistory === 999 ? 90 : Math.min(analyticsHistory, 90);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [overviewRes, postsRes, insightsRes] = await Promise.all([
        api.instance.get(`/api/analytics/overview?days=${period}`),
        api.instance.get(`/api/analytics/posts/top?days=${period}&limit=5`),
        api.instance.get(`/api/analytics/ai-insights?days=${period}`),
      ]);
      setData(overviewRes.data.data);
      setTopPosts(postsRes.data.data || []);
      setInsights(insightsRes.data.data?.insights || '');
    } catch (err: any) {
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.instance.post('/api/analytics/sync');
      await fetchData();
    } catch {
      setError('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => { fetchData(); }, [period]);

  const formatNum = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#C9A84C' }} />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {data?.hasConnectedAccounts
              ? `${data.connectedAccounts} connected account${data.connectedAccounts !== 1 ? 's' : ''} · ${data.period}`
              : 'Connect accounts to see real data'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex gap-1 p-1 rounded-xl border"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(201,168,76,0.12)' }}>
            {PERIODS.map(p => {
              const daysNum = Number(p);
              const locked = daysNum > maxDays;
              return (
                <button key={p}
                  onClick={() => !locked && setPeriod(p)}
                  disabled={locked}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                  style={{
                    background: period === p ? 'rgba(201,168,76,0.15)' : 'transparent',
                    color: period === p ? '#E8C96A' : 'rgba(255,255,255,0.4)',
                  }}>
                  {p}d {locked ? '🔒' : ''}
                </button>
              );
            })}
          </div>
          <button onClick={handleSync} disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border transition-all disabled:opacity-50"
            style={{ borderColor: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            Sync
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* No accounts state */}
      {!data?.hasConnectedAccounts ? (
        <div className="glass rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <NoAccountsState />
        </div>
      ) : (
        <>
          {/* Stats overview */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Total followers" value={formatNum(data.totalFollowers)}
              sub={`Across ${data.connectedAccounts} platforms`}
              icon={Users} change={2.4} color="#C9A84C" />
            <StatCard label="Total impressions" value={formatNum(data.totalImpressions)}
              sub={data.period} icon={Eye} change={8.1} color="#E8C96A" />
            <StatCard label="Total engagements" value={formatNum(data.totalEngagements)}
              sub={`${data.engagementRate}% rate`} icon={Heart} change={-1.2} color="#C9A84C" />
            <StatCard label="Total reach" value={formatNum(data.totalReach)}
              sub={`${data.postsCount} posts published`} icon={TrendingUp} change={5.6} color="#E8C96A" />
          </div>

          {/* Growth chart */}
          <div className="glass rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
                Performance over time
              </h3>
              <div className="flex gap-1">
                {['impressions', 'engagement', 'reach', 'followers'].map(m => (
                  <button key={m} onClick={() => setActiveMetric(m)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-medium capitalize transition-all"
                    style={{
                      background: activeMetric === m ? 'rgba(201,168,76,0.15)' : 'transparent',
                      color: activeMetric === m ? '#E8C96A' : 'rgba(255,255,255,0.4)',
                    }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5">
              {data.chartData?.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.chartData}>
                    <defs>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={formatNum} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={activeMetric}
                      stroke="#C9A84C"
                      strokeWidth={2}
                      fill="url(#goldGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: '#E8C96A' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48">
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    No data for this period yet — post some content to see analytics
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Platform breakdown + Top posts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Platform breakdown */}
            <div className="glass rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
                  Platform breakdown
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {data.platformBreakdown?.length > 0 ? data.platformBreakdown.map((p: any) => {
                  const color = PLATFORM_COLORS[p.platform] || PLATFORM_COLORS.DEFAULT;
                  const maxFollowers = Math.max(...data.platformBreakdown.map((x: any) => x.followers));
                  const pct = maxFollowers > 0 ? (p.followers / maxFollowers) * 100 : 0;

                  return (
                    <div key={p.platform}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                          <span className="text-sm font-medium text-white">{p.platform}</span>
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.username}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color }}>
                          {formatNum(p.followers)}
                        </span>
                      </div>
                      <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <div className="flex gap-4 mt-1.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        <span>{formatNum(p.impressions)} impressions</span>
                        <span>{formatNum(p.engagement)} engagements</span>
                        <span>{formatNum(p.reach)} reach</span>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-center py-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    No platform data yet
                  </p>
                )}
              </div>
            </div>

            {/* Top posts */}
            <div className="glass rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
                  Top performing posts
                </h3>
              </div>
              <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
                {topPosts.length > 0 ? topPosts.map((post: any, i: number) => (
                  <div key={post.id} className="flex items-start gap-3 px-5 py-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{post.content?.slice(0, 80)}...</p>
                      <div className="flex gap-3 mt-1.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        <span>{formatNum(post.impressions)} impressions</span>
                        <span>{post.likes + post.comments} engagements</span>
                        <span>{post.platform}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      No published posts yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          {insights && (
            <div className="glass rounded-2xl border p-5" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" style={{ color: '#C9A84C' }} />
                <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-sm font-bold text-white">
                  AI-generated insights
                </h3>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: 'rgba(255,255,255,0.65)' }}>
                {insights}
              </p>
            </div>
          )}

          {/* Competitor analysis gate */}
          <FeatureGate
            locked={!can('botDetection')}
            message="Upgrade to Creator to see competitor benchmarking and advanced audience demographics."
            neededPlan="Creator"
            blurred={false}>
            <div className="glass rounded-2xl border p-8 text-center" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <BarChart3 className="w-8 h-8 mx-auto mb-3" style={{ color: 'rgba(201,168,76,0.4)' }} />
              <p className="text-sm font-medium text-white">Competitor benchmarking</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                See how your performance compares to similar accounts in Kenya
              </p>
            </div>
          </FeatureGate>
        </>
      )}
    </div>
  );
}
