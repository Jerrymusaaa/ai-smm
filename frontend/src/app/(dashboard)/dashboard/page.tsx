'use client';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { EngagementChart } from '@/components/dashboard/EngagementChart';
import { ScheduledPosts } from '@/components/dashboard/ScheduledPosts';
import { PlatformBreakdown } from '@/components/dashboard/PlatformBreakdown';
import { useAuthStore } from '@/store/auth.store';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const user = useAuthStore(s => s.user);
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-bold text-white">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Here&apos;s what&apos;s happening across your social platforms today.
          </p>
        </div>
      </div>

      {/* Stats grid — real data with connect-accounts empty state */}
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

      {/* Scheduled posts — full width now that the demo assistant is gone */}
      <ScheduledPosts />
    </div>
  );
}
