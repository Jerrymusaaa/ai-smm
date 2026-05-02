'use client';

import { StatsCards } from '@/components/dashboard/StatsCards';
import { EngagementChart } from '@/components/dashboard/EngagementChart';
import { AIChatPanel } from '@/components/dashboard/AIChatPanel';
import { ScheduledPosts } from '@/components/dashboard/ScheduledPosts';
import { PlatformBreakdown } from '@/components/dashboard/PlatformBreakdown';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-bold text-white">
            Good morning, Jerry 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Here&apos;s what&apos;s happening across your social platforms today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* AI insight badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[#E8C96A]/20">
            <TrendingUp className="w-4 h-4 text-[#E8C96A]" />
            <span className="text-xs text-white/60">
              <span className="text-[#E8C96A] font-medium">+28%</span> engagement this week
            </span>
          </div>
          <Button size="sm" className="rounded-xl gap-2">
            <Sparkles className="w-4 h-4" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* AI suggestion banner */}
      <div className="rounded-2xl border border-[#C9A84C]/20 p-4 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.08), rgba(0,212,170,0.05))' }}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-600/20">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium">AI recommendation</p>
          <p className="text-xs text-white/50 mt-0.5 truncate">
            Your TikTok engagement peaks at 8PM EST. You have no posts scheduled tonight — want me to create one?
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="text-xs text-white/40 hover:text-white transition-colors px-3 py-1.5">
            Dismiss
          </button>
          <Button size="sm" className="rounded-xl text-xs">
            Create post
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <StatsCards />

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart - takes 2/3 width */}
        <div className="xl:col-span-2">
          <EngagementChart />
        </div>
        {/* Platform breakdown - takes 1/3 */}
        <div className="xl:col-span-1">
          <PlatformBreakdown />
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* AI Chat - takes 1/3 */}
        <div className="xl:col-span-1 order-2 xl:order-1">
          <AIChatPanel />
        </div>
        {/* Scheduled posts - takes 2/3 */}
        <div className="xl:col-span-2 order-1 xl:order-2">
          <ScheduledPosts />
        </div>
      </div>
    </div>
  );
}
