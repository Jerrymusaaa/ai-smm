'use client';

import { useState } from 'react';
import { X, Sparkles, ImageIcon, Clock, Calendar, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScheduledPost } from './CalendarGrid';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C', initial: 'IG' },
  { id: 'tiktok', label: 'TikTok', color: '#FF0050', initial: 'TT' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', initial: 'IN' },
  { id: 'twitter', label: 'X / Twitter', color: '#1DA1F2', initial: 'X' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', initial: 'FB' },
  { id: 'youtube', label: 'YouTube', color: '#FF0000', initial: 'YT' },
];

const BEST_TIMES = [
  { time: '8:00 AM', label: 'Morning peak', score: 82 },
  { time: '12:00 PM', label: 'Lunch break', score: 76 },
  { time: '6:00 PM', label: 'Evening peak', score: 94 },
  { time: '8:00 PM', label: 'Prime time', score: 91 },
  { time: '9:00 PM', label: 'Late evening', score: 78 },
];

interface PostModalProps {
  post?: ScheduledPost | null;
  defaultDate?: string;
  onClose: () => void;
  onSave: (post: ScheduledPost) => void;
  onDelete?: (id: string) => void;
}

export function PostModal({ post, defaultDate, onClose, onSave, onDelete }: PostModalProps) {
  const isEdit = !!post;
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [form, setForm] = useState({
    title: post?.title || '',
    content: post?.content || '',
    platform: post?.platform || 'Instagram',
    platformColor: post?.platformColor || '#E1306C',
    platformInitial: post?.platformInitial || 'IG',
    date: post?.date || defaultDate || '',
    time: post?.time || '6:00 PM',
    status: post?.status || 'scheduled' as ScheduledPost['status'],
    hasMedia: post?.hasMedia || false,
  });

  const update = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const selectPlatform = (p: typeof PLATFORMS[0]) => {
    update('platform', p.label);
    update('platformColor', p.color);
    update('platformInitial', p.initial);
  };

  const generateAI = async () => {
    if (!form.title) return;
    setAiGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    const captions: Record<string, string> = {
      Instagram: `✨ ${form.title}\n\nWe're excited to share something amazing with our community. Stay tuned for what's coming next — this is just the beginning! 🚀\n\nDrop a 🔥 if you're excited!`,
      TikTok: `POV: ${form.title} just changed everything 😤 #viral #trending #fyp`,
      LinkedIn: `Thrilled to share an update about ${form.title}.\n\nThis represents a significant milestone in our journey. We've been working tirelessly to bring this to our community, and the results have exceeded our expectations.\n\nWhat do you think? Share your thoughts below 👇`,
      'X / Twitter': `🚨 Big news: ${form.title}\n\nThread incoming 👇`,
      Facebook: `We're thrilled to announce ${form.title}! This is something we've been working on for a while and we can't wait to share it with all of you. Read more below 👇`,
      YouTube: `In today's video: ${form.title}\n\nDon't forget to like, subscribe, and hit the notification bell so you never miss our latest content!`,
    };
    update('content', captions[form.platform] || captions.Instagram);
    setAiGenerating(false);
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onSave({
      id: post?.id || Math.random().toString(36).slice(2),
      ...form,
    });
    setLoading(false);
    onClose();
  };

  const charLimits: Record<string, number> = {
    'X / Twitter': 280, TikTok: 300, Instagram: 2200,
    LinkedIn: 3000, Facebook: 63206, YouTube: 5000,
  };
  const limit = charLimits[form.platform] || 2200;
  const charCount = form.content.length;
  const charPct = (charCount / limit) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: '#0D1525' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-lg font-bold text-white">
            {isEdit ? 'Edit post' : 'Schedule new post'}
          </h2>
          <button onClick={onClose}
            className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Platform selector */}
          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => {
                const active = form.platform === p.label;
                return (
                  <button key={p.id} onClick={() => selectPlatform(p)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all"
                    style={active ? {
                      background: `${p.color}18`,
                      borderColor: `${p.color}40`,
                      color: p.color,
                    } : { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: active ? `${p.color}30` : 'rgba(255,255,255,0.08)' }}>
                      {p.initial}
                    </div>
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post title */}
          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">Post title / topic</label>
            <input
              type="text"
              placeholder="What is this post about?"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 transition-all"
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white/70">Caption</label>
              <button onClick={generateAI} disabled={!form.title || aiGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0066FF]/15 text-[#0066FF] border border-[#0066FF]/25 hover:bg-[#0066FF]/25 transition-all disabled:opacity-40">
                {aiGenerating
                  ? <><Sparkles className="w-3.5 h-3.5 animate-pulse" /> Generating...</>
                  : <><Wand2 className="w-3.5 h-3.5" /> AI write</>}
              </button>
            </div>
            <textarea
              placeholder={`Write your ${form.platform} caption...`}
              value={form.content}
              onChange={e => update('content', e.target.value)}
              rows={5}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 transition-all resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center gap-2 flex-1 mr-3">
                <div className="flex-1 bg-white/[0.06] rounded-full h-1">
                  <div className="h-1 rounded-full transition-all"
                    style={{
                      width: `${Math.min(charPct, 100)}%`,
                      background: charPct > 90 ? '#EF4444' : charPct > 70 ? '#F59E0B' : '#0066FF'
                    }} />
                </div>
              </div>
              <span className={`text-[11px] ${charCount > limit ? 'text-red-400' : 'text-white/30'}`}>
                {charCount}/{limit}
              </span>
            </div>
          </div>

          {/* Date, time & media row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2">
                <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Date</div>
              </label>
              <input type="date" value={form.date} onChange={e => update('date', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#0066FF]/40 transition-all [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2">
                <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Time</div>
              </label>
              <select value={form.time} onChange={e => update('time', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#0066FF]/40 transition-all">
                {['6:00 AM','8:00 AM','9:00 AM','10:00 AM','12:00 PM','2:00 PM','4:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* AI best times */}
          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
                AI recommended times for {form.platform}
              </div>
            </label>
            <div className="flex gap-2 flex-wrap">
              {BEST_TIMES.map(t => (
                <button key={t.time} onClick={() => update('time', t.time)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all ${
                    form.time === t.time
                      ? 'border-[#0066FF]/40 bg-[#0066FF]/15 text-[#0066FF]'
                      : 'border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70'
                  }`}>
                  <span>{t.time}</span>
                  <span className="text-[10px] opacity-70">{t.score}%</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-white/25 mt-2">
              Score based on your audience activity patterns
            </p>
          </div>

          {/* Media toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4 text-white/40" />
              <div>
                <div className="text-sm font-medium text-white/70">Add media</div>
                <div className="text-xs text-white/30">Image or video attachment</div>
              </div>
            </div>
            <button onClick={() => update('hasMedia', !form.hasMedia)}
              className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0 ${form.hasMedia ? 'bg-[#0066FF]' : 'bg-white/10'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.hasMedia ? 'left-5' : 'left-1'}`} />
            </button>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">Status</label>
            <div className="flex gap-2">
              {(['scheduled', 'draft'] as const).map(s => (
                <button key={s} onClick={() => update('status', s)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all capitalize ${
                    form.status === s
                      ? 'border-[#0066FF]/40 bg-[#0066FF]/15 text-[#0066FF]'
                      : 'border-white/[0.08] text-white/40 hover:border-white/20'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3">
            {isEdit && onDelete && (
              <button onClick={() => { onDelete(post!.id); onClose(); }}
                className="text-sm text-red-400 hover:text-red-300 transition-colors">
                Delete post
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-sm text-white/40 hover:text-white transition-colors">
              Cancel
            </button>
            <Button size="md" loading={loading} onClick={handleSave} className="rounded-xl min-w-[120px]">
              {!loading && (form.status === 'draft' ? 'Save draft' : '📅 Schedule post')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
