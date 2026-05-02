'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu, Search, Bell, Plus, Sparkles,
  ChevronDown, LogOut, User, Settings
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

interface TopBarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

const NOTIFICATIONS = [
  { id: 1, text: 'Your post reached 10,000 impressions', time: '2m ago', dot: '#C9A84C' },
  { id: 2, text: 'Scheduled post published successfully', time: '14m ago', dot: '#E8C96A' },
  { id: 3, text: 'New follower milestone: 5,000 on LinkedIn', time: '1h ago', dot: '#C9A84C' },
  { id: 4, text: 'AI generated 5 new caption variants', time: '2h ago', dot: '#E8C96A' },
];

export function TopBar({ onMenuClick }: TopBarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const goldBorder = 'rgba(201,168,76,0.15)';
  const goldBorderHover = 'rgba(201,168,76,0.3)';

  return (
    <header
      className="h-16 flex items-center gap-4 px-4 sm:px-6 border-b flex-shrink-0"
      style={{ background: '#0A0A0A', borderColor: 'rgba(201,168,76,0.1)' }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg transition-colors"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
        <span style={{ color: '#E8C96A', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
          Yoyzie AI
        </span>
        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Dashboard</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto hidden md:block">
        <div
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all"
          style={{
            border: `1px solid ${searchOpen ? goldBorderHover : goldBorder}`,
            background: searchOpen ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.02)',
          }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }} />
          <input
            type="text"
            placeholder="Search posts, campaigns, analytics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'white' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Create button */}
        <button
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
            color: '#0A0A0A',
          }}
        >
          <Plus className="w-3.5 h-3.5" /> Create
        </button>

        {/* AI button */}
        <button
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all"
          style={{
            borderColor: 'rgba(201,168,76,0.25)',
            background: 'rgba(201,168,76,0.08)',
            color: '#E8C96A',
          }}
        >
          <Sparkles className="w-3.5 h-3.5" /> Ask AI
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
            className="relative p-2 rounded-xl transition-all"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <Bell className="w-5 h-5" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border"
              style={{ background: '#C9A84C', borderColor: '#0A0A0A' }}
            />
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden"
              style={{ background: '#0D0D0F', borderColor: 'rgba(201,168,76,0.15)' }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'rgba(201,168,76,0.1)' }}
              >
                <span className="text-sm font-medium text-white">Notifications</span>
                <button className="text-xs" style={{ color: '#C9A84C' }}>Mark all read</button>
              </div>
              <div className="divide-y max-h-72 overflow-y-auto"
                style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
                {NOTIFICATIONS.map(n => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: n.dot }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {n.text}
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {n.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1 rounded-xl transition-all"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0A0A0A' }}
            >
              {initials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 hidden sm:block"
              style={{ color: 'rgba(255,255,255,0.3)' }} />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-2xl z-50 overflow-hidden"
              style={{ background: '#0D0D0F', borderColor: 'rgba(201,168,76,0.15)' }}
            >
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: 'rgba(201,168,76,0.1)' }}
              >
                <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {user?.email}
                </p>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium mt-1.5 inline-block"
                  style={{ background: 'rgba(201,168,76,0.15)', color: '#E8C96A' }}
                >
                  {user?.plan || 'FREE'} Plan
                </span>
              </div>
              <div className="p-2">
                {[
                  { icon: User, label: 'Profile', href: '/dashboard/settings' },
                  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => { router.push(item.href); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.06)';
                      (e.currentTarget as HTMLElement).style.color = 'white';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
                <div className="border-t mt-1 pt-1" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all"
                    style={{ color: 'rgba(239,68,68,0.7)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)';
                      (e.currentTarget as HTMLElement).style.color = '#EF4444';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.7)';
                    }}
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
