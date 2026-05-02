'use client';

import { Clock, CheckCircle2, AlertCircle, FileText, ImageIcon, MoreHorizontal, GripVertical } from 'lucide-react';
import { ScheduledPost } from './CalendarGrid';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', icon: Clock, color: '#C9A84C', bg: 'rgba(0,102,255,0.1)' },
  published: { label: 'Published', icon: CheckCircle2, color: '#E8C96A', bg: 'rgba(0,212,170,0.1)' },
  draft: { label: 'Draft', icon: FileText, color: '#888', bg: 'rgba(136,136,136,0.1)' },
  failed: { label: 'Failed', icon: AlertCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

interface PostQueueProps {
  posts: ScheduledPost[];
  onPostClick: (post: ScheduledPost) => void;
  title: string;
  emptyMessage?: string;
}

export function PostQueue({ posts, onPostClick, title, emptyMessage }: PostQueueProps) {
  const grouped = posts.reduce((acc, post) => {
    const key = post.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(post);
    return acc;
  }, {} as Record<string, ScheduledPost[]>);

  const sortedDates = Object.keys(grouped).sort();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
          {title}
        </h3>
        <span className="text-xs text-white/40">{posts.length} posts</span>
      </div>

      {posts.length === 0 ? (
        <div className="p-10 text-center">
          <Clock className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">{emptyMessage || 'No posts yet'}</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04] max-h-[500px] overflow-y-auto">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="px-5 py-2 bg-white/[0.02] border-b border-white/[0.04]">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  {formatDate(date)}
                </span>
              </div>
              {grouped[date].map(post => {
                const status = STATUS_CONFIG[post.status];
                return (
                  <div key={post.id}
                    onClick={() => onPostClick(post)}
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className="text-white/10 group-hover:text-white/30 transition-colors mt-1 flex-shrink-0">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Platform badge */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                      style={{ background: `${post.platformColor}25`, border: `1px solid ${post.platformColor}35` }}>
                      {post.platformInitial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-medium text-white/80 truncate">{post.title}</span>
                        {post.hasMedia && <ImageIcon className="w-3 h-3 text-white/30 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-white/40 line-clamp-1 mb-1.5">{post.content}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ background: status.bg, color: status.color }}>
                          <status.icon className="w-3 h-3" />
                          {status.label}
                        </div>
                        <span className="text-[10px] text-white/30">{post.time}</span>
                        <span className="text-[10px] text-white/30">· {post.platform}</span>
                      </div>
                    </div>

                    <button
                      onClick={e => e.stopPropagation()}
                      className="p-1 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
