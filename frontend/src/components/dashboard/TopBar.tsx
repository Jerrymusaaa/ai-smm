'use client';

import { useState } from 'react';
import { Menu, Search, Bell, Plus, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TopBarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

const NOTIFICATIONS = [
  { id: 1, text: 'Campaign "Summer Launch" reached 10K impressions', time: '2m ago', dot: '#00D4AA' },
  { id: 2, text: 'Scheduled post published on Instagram successfully', time: '14m ago', dot: '#0066FF' },
  { id: 3, text: 'New follower milestone: 5,000 on LinkedIn', time: '1h ago', dot: '#A855F7' },
  { id: 4, text: 'AI generated 5 new caption variants for your review', time: '2h ago', dot: '#FF6B35' },
];

export function TopBar({ onMenuClick }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 flex items-center gap-4 px-4 sm:px-6 border-b border-white/[0.06] flex-shrink-0"
      style={{ background: '#0A1020' }}>

      {/* Mobile menu button */}
      <button onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all flex-shrink-0">
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title area */}
      <div className="hidden sm:flex items-center gap-2 text-sm text-white/30">
        <span>SocialAI</span>
        <ChevronDown className="w-3.5 h-3.5 rotate-[-90deg]" />
        <span className="text-white/70 font-medium">Dashboard</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto hidden md:block">
        <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all ${
          searchOpen ? 'border-[#0066FF]/40 bg-white/[0.07]' : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12]'
        }`}>
          <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search posts, campaigns, analytics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
          />
          <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Create button */}
        <Button size="sm" className="hidden sm:flex rounded-xl gap-1.5 text-xs px-3 py-2">
          <Plus className="w-3.5 h-3.5" />
          Create
        </Button>

        {/* AI Assistant quick button */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-[#0066FF]/20 bg-[#0066FF]/10 text-[#0066FF] hover:bg-[#0066FF]/20 transition-all">
          <Sparkles className="w-3.5 h-3.5" />
          Ask AI
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B35] border border-[#0A1020]" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
              style={{ background: '#0D1525' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-sm font-medium text-white">Notifications</span>
                <button className="text-xs text-[#0066FF] hover:text-[#3385FF]">Mark all read</button>
              </div>
              <div className="divide-y divide-white/[0.04] max-h-72 overflow-y-auto">
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.dot }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70 leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-white/30 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-white/[0.06]">
                <button className="text-xs text-white/40 hover:text-white/70 w-full text-center transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00D4AA] flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:scale-105 transition-transform">
          JD
        </div>
      </div>
    </header>
  );
}
