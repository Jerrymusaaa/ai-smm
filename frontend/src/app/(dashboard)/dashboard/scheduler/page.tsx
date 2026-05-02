'use client';

import { useState } from 'react';
import { Plus, CalendarDays, List, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CalendarGrid, ScheduledPost } from '@/components/scheduler/CalendarGrid';
import { PostQueue } from '@/components/scheduler/PostQueue';
import { PostModal } from '@/components/scheduler/PostModal';
import { SchedulerStats } from '@/components/scheduler/SchedulerStats';
import { BestTimesHeatmap } from '@/components/scheduler/BestTimesHeatmap';

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const INITIAL_POSTS: ScheduledPost[] = [
  { id: '1', title: 'Product launch teaser', platform: 'Instagram', platformColor: '#E1306C', platformInitial: 'IG', time: '6:00 PM', date: fmt(today), status: 'scheduled', content: '🚀 Something big is coming. Stay tuned! #launch #excited', hasMedia: true },
  { id: '2', title: 'Morning motivation', platform: 'X / Twitter', platformColor: '#1DA1F2', platformInitial: 'X', time: '8:00 AM', date: fmt(today), status: 'published', content: 'Start your week with intention. What\'s your goal for today? 💪', hasMedia: false },
  { id: '3', title: 'Behind the scenes', platform: 'TikTok', platformColor: '#FF0050', platformInitial: 'TT', time: '8:00 PM', date: fmt(addDays(today, 1)), status: 'scheduled', content: 'POV: A day in our office 😎 #behindthescenes #startup #tech', hasMedia: true },
  { id: '4', title: 'Industry insights', platform: 'LinkedIn', platformColor: '#0A66C2', platformInitial: 'IN', time: '9:00 AM', date: fmt(addDays(today, 1)), status: 'scheduled', content: 'The future of AI in social media marketing: 5 trends to watch in 2025.', hasMedia: false },
  { id: '5', title: 'Weekend giveaway', platform: 'Instagram', platformColor: '#E1306C', platformInitial: 'IG', time: '12:00 PM', date: fmt(addDays(today, 2)), status: 'draft', content: '🎁 GIVEAWAY TIME! We\'re giving away 3 Pro subscriptions. To enter: Follow + Like + Tag a friend!', hasMedia: true },
  { id: '6', title: 'Customer spotlight', platform: 'Facebook', platformColor: '#1877F2', platformInitial: 'FB', time: '2:00 PM', date: fmt(addDays(today, 3)), status: 'scheduled', content: 'Meet Sarah, who grew her Instagram by 340% using Yoyzie AI in just 30 days! 🌟', hasMedia: true },
  { id: '7', title: 'Tips thread', platform: 'X / Twitter', platformColor: '#1DA1F2', platformInitial: 'X', time: '10:00 AM', date: fmt(addDays(today, 4)), status: 'scheduled', content: '10 social media tips that actually work in 2025. Thread 🧵👇', hasMedia: false },
  { id: '8', title: 'Product demo reel', platform: 'TikTok', platformColor: '#FF0050', platformInitial: 'TT', time: '7:00 PM', date: fmt(addDays(today, 5)), status: 'scheduled', content: 'Watch how we schedule 30 posts in under 2 minutes with AI 🤖⚡', hasMedia: true },
  { id: '9', title: 'Founder story', platform: 'LinkedIn', platformColor: '#0A66C2', platformInitial: 'IN', time: '8:00 AM', date: fmt(addDays(today, -1)), status: 'published', content: 'Why I quit my $200K job to build an AI social media tool. The real story.', hasMedia: false },
  { id: '10', title: 'Engagement post', platform: 'Instagram', platformColor: '#E1306C', platformInitial: 'IG', time: '6:00 PM', date: fmt(addDays(today, -1)), status: 'published', content: 'Coffee or tea? ☕🍵 Let us know below! #engagement #community', hasMedia: true },
];

export default function SchedulerPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>(INITIAL_POSTS);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [selectedDate, setSelectedDate] = useState('');

  const openCreate = (date?: string) => {
    setSelectedPost(null);
    setSelectedDate(date || fmt(today));
    setShowModal(true);
  };

  const openEdit = (post: ScheduledPost) => {
    setSelectedPost(post);
    setSelectedDate(post.date);
    setShowModal(true);
  };

  const handleSave = (post: ScheduledPost) => {
    setPosts(prev => {
      const exists = prev.find(p => p.id === post.id);
      return exists
        ? prev.map(p => p.id === post.id ? post : p)
        : [...prev, post];
    });
  };

  const handleDelete = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const upcoming = posts
    .filter(p => p.date >= fmt(today) && p.status !== 'published')
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const recent = posts
    .filter(p => p.status === 'published')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-bold text-white">
            Scheduler
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {upcoming.length} posts queued · {recent.length} published recently
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* AI bulk schedule button */}
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[#E8C96A]/20 text-xs text-[#E8C96A] hover:bg-[#E8C96A]/10 transition-all">
            <Zap className="w-3.5 h-3.5" />
            AI bulk schedule
          </button>

          {/* View toggle */}
          <div className="flex items-center bg-white/[0.04] rounded-xl border border-white/[0.06] p-1">
            <button onClick={() => setView('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'calendar' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
              <CalendarDays className="w-3.5 h-3.5" /> Calendar
            </button>
            <button onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <Button size="sm" onClick={() => openCreate()} className="rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Schedule post
          </Button>
        </div>
      </div>

      {/* Stats */}
      <SchedulerStats />

      {/* AI suggestion banner */}
      <div className="rounded-2xl border border-[#C9A84C]/20 p-4 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.08), rgba(0,212,170,0.04))' }}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium">AI scheduling suggestion</p>
          <p className="text-xs text-white/50 mt-0.5">
            You have no posts scheduled for Saturday evening — your highest engagement window (6–8 PM). Want me to create one?
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="text-xs text-white/40 hover:text-white transition-colors px-3 py-1.5">
            Dismiss
          </button>
          <Button size="sm" onClick={() => openCreate(fmt(addDays(today, 6)))} className="rounded-xl text-xs">
            Create post
          </Button>
        </div>
      </div>

      {/* Calendar or list view */}
      {view === 'calendar' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <CalendarGrid
              posts={posts}
              onDayClick={date => openCreate(date)}
              onPostClick={openEdit}
              onAddPost={date => openCreate(date)}
            />
          </div>
          <div className="space-y-5">
            <PostQueue
              posts={upcoming.slice(0, 8)}
              onPostClick={openEdit}
              title="Upcoming posts"
              emptyMessage="No posts scheduled yet"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PostQueue
            posts={upcoming}
            onPostClick={openEdit}
            title="Upcoming posts"
            emptyMessage="No posts scheduled"
          />
          <PostQueue
            posts={recent}
            onPostClick={openEdit}
            title="Recently published"
            emptyMessage="No published posts yet"
          />
        </div>
      )}

      {/* Best times heatmap */}
      <BestTimesHeatmap />

      {/* Post modal */}
      {showModal && (
        <PostModal
          post={selectedPost}
          defaultDate={selectedDate}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
