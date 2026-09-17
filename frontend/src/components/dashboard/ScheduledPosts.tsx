'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle2, AlertCircle, Loader2, CalendarPlus, Link2 } from 'lucide-react';
import { api } from '@/lib/api';

const PLATFORM_STYLES: Record<string, { label: string; initial: string; color: string }> = {
  INSTAGRAM: { label: 'Instagram', initial: 'IG', color: '#E1306C' },
  TIKTOK: { label: 'TikTok', initial: 'TT', color: '#FF0050' },
  LINKEDIN: { label: 'LinkedIn', initial: 'IN', color: '#0A66C2' },
  TWITTER: { label: 'X / Twitter', initial: 'X', color: '#1DA1F2' },
  FACEBOOK: { label: 'Facebook', initial: 'FB', color: '#1877F2' },
  YOUTUBE: { label: 'YouTube', initial: 'YT', color: '#FF0000' },
  PINTEREST: { label: 'Pinterest', initial: 'PI', color: '#E60023' },
  THREADS: { label: 'Threads', initial: 'TH', color: '#000000' },
};

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  SCHEDULED: { label: 'Scheduled', icon: Clock, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  PUBLISHED: { label: 'Published', icon: CheckCircle2, color: '#E8C96A', bg: 'rgba(0,212,170,0.1)' },
  DRAFT: { label: 'Draft', icon: Loader2, color: '#888', bg: 'rgba(136,136,136,0.1)' },
  FAILED: { label: 'Failed', icon: AlertCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

function formatWhen(post: any) {
  const d = post.scheduledAt || post.publishedAt;
  if (!d) return '—';
  const date = new Date(d);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === new Date(today.getTime() + 864e5).toDateString();
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (isToday) return `Today, ${time}`;
  if (isTomorrow) return `Tomorrow, ${time}`;
  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`;
}

export function ScheduledPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [noAccounts, setNoAccounts] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.analytics.overview(30)
      .then(res => {
        if (cancelled) return;
        if (res.data?.data && res.data.data.hasConnectedAccounts === false) setNoAccounts(true);
      })
      .catch(() => {})
      .finally(() => {});
    api.posts.list({ limit: 8 })
      .then(res => {
        if (cancelled) return;
        setPosts(res.data?.data?.posts ?? res.data?.data ?? []);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Scheduled Posts
          </h3>
          <p className="text-xs text-white/40 mt-0.5">Upcoming &amp; recent</p>
        </div>
        <Link href="/dashboard/scheduler" className="text-xs text-[#C9A84C] hover:text-[#3385FF] font-medium transition-colors">
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="px-5 py-12 text-center">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#C9A84C]" />
          <p className="text-xs text-white/30 mt-2">Loading your posts…</p>
        </div>
      ) : noAccounts ? (
        <div className="px-5 py-10 text-center">
          <Link2 className="w-8 h-8 mx-auto mb-3 text-[#C9A84C]/60" />
          <p className="text-sm text-white/70 font-medium mb-1">No social accounts connected yet</p>
          <p className="text-xs text-white/40 mb-4 max-w-xs mx-auto">
            Connect your social media accounts and your real scheduled posts will appear here.
          </p>
          <Link href="/dashboard/integrations" className="text-xs text-[#C9A84C] hover:text-[#E8C96A] font-medium">
            Connect accounts →
          </Link>
        </div>
      ) : posts.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <CalendarPlus className="w-8 h-8 mx-auto mb-3 text-[#C9A84C]/60" />
          <p className="text-sm text-white/70 font-medium mb-1">Nothing scheduled yet</p>
          <p className="text-xs text-white/40 mb-4 max-w-xs mx-auto">
            Create your first post in the scheduler and it will show up here.
          </p>
          <Link href="/dashboard/scheduler" className="text-xs text-[#C9A84C] hover:text-[#E8C96A] font-medium">
            Open scheduler →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {posts.map((post: any) => {
            const style = PLATFORM_STYLES[post.platform] || { label: post.platform, initial: '??', color: '#888' };
            const status = STATUS_CONFIG[post.status] || STATUS_CONFIG.DRAFT;
            return (
              <div key={post.id} className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ background: `${style.color}25`, border: `1px solid ${style.color}35` }}>
                  {style.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white/70">{style.label}</span>
                    <span className="text-[10px] text-white/30">·</span>
                    <span className="text-[10px] text-white/30">{formatWhen(post)}</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{post.content || post.title || '(no text)'}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full flex-shrink-0"
                  style={{ background: status.bg }}>
                  <status.icon className="w-3 h-3" style={{ color: status.color }} />
                  <span className="text-[10px] font-medium" style={{ color: status.color }}>{status.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
