'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScheduledPost {
  id: string;
  title: string;
  platform: string;
  platformColor: string;
  platformInitial: string;
  time: string;
  date: string;
  status: 'scheduled' | 'published' | 'draft' | 'failed';
  content: string;
  hasMedia: boolean;
}

interface CalendarGridProps {
  posts: ScheduledPost[];
  onDayClick: (date: string) => void;
  onPostClick: (post: ScheduledPost) => void;
  onAddPost: (date: string) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const STATUS_COLORS = {
  scheduled: '#C9A84C',
  published: '#E8C96A',
  draft: '#888888',
  failed: '#EF4444',
};

export function CalendarGrid({ posts, onDayClick, onPostClick, onAddPost }: CalendarGridProps) {
  const today = new Date();
  const [current, setCurrent] = useState({ month: today.getMonth(), year: today.getFullYear() });

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const daysInPrev = new Date(current.year, current.month, 0).getDate();

  const cells: { day: number; month: 'prev' | 'current' | 'next'; dateStr: string }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const m = current.month === 0 ? 11 : current.month - 1;
    const y = current.month === 0 ? current.year - 1 : current.year;
    cells.push({ day: d, month: 'prev', dateStr: `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d, month: 'current',
      dateStr: `${current.year}-${String(current.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    });
  }

  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = current.month === 11 ? 0 : current.month + 1;
    const y = current.month === 11 ? current.year + 1 : current.year;
    cells.push({ day: d, month: 'next', dateStr: `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` });
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const prevMonth = () => setCurrent(c => c.month === 0
    ? { month: 11, year: c.year - 1 }
    : { month: c.month - 1, year: c.year });

  const nextMonth = () => setCurrent(c => c.month === 11
    ? { month: 0, year: c.year + 1 }
    : { month: c.month + 1, year: c.year });

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* Calendar header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
          {MONTHS[current.month]} {current.year}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrent({ month: today.getMonth(), year: today.getFullYear() })}
            className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white glass border border-white/[0.06] transition-all">
            Today
          </button>
          <button onClick={prevMonth}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-white/[0.06]">
        {DAYS.map(d => (
          <div key={d} className="py-2 text-center text-[11px] font-medium text-white/30">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          const cellPosts = posts.filter(p => p.date === cell.dateStr);
          const isToday = cell.dateStr === todayStr;
          const isCurrent = cell.month === 'current';
          const isLast = idx >= 35;

          return (
            <div
              key={`${cell.dateStr}-${idx}`}
              onClick={() => isCurrent && onDayClick(cell.dateStr)}
              className={cn(
                'min-h-[90px] p-2 border-b border-r border-white/[0.04] transition-all group',
                isCurrent ? 'cursor-pointer hover:bg-white/[0.02]' : 'opacity-30',
                isLast ? 'border-b-0' : '',
                (idx + 1) % 7 === 0 ? 'border-r-0' : '',
              )}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn(
                  'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full',
                  isToday ? 'bg-[#C9A84C] text-white' : isCurrent ? 'text-white/60' : 'text-white/20'
                )}>
                  {cell.day}
                </span>
                {isCurrent && (
                  <button
                    onClick={e => { e.stopPropagation(); onAddPost(cell.dateStr); }}
                    className="w-5 h-5 rounded-md bg-white/[0.06] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#C9A84C]/20 hover:text-[#C9A84C] text-white/40">
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Posts */}
              <div className="space-y-1">
                {cellPosts.slice(0, 3).map(post => (
                  <div
                    key={post.id}
                    onClick={e => { e.stopPropagation(); onPostClick(post); }}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium truncate cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      background: `${STATUS_COLORS[post.status]}15`,
                      color: STATUS_COLORS[post.status],
                      border: `1px solid ${STATUS_COLORS[post.status]}25`
                    }}
                  >
                    <div className="w-3 h-3 rounded flex items-center justify-center text-[7px] font-bold text-white flex-shrink-0"
                      style={{ background: post.platformColor }}>
                      {post.platformInitial[0]}
                    </div>
                    <span className="truncate">{post.time} {post.title}</span>
                  </div>
                ))}
                {cellPosts.length > 3 && (
                  <div className="text-[10px] text-white/30 px-1">
                    +{cellPosts.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
