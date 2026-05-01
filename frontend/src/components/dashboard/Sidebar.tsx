'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import {
  LayoutDashboard, PenSquare, Megaphone, Calendar,
  BarChart3, Users, CreditCard, Settings, ChevronLeft,
  ChevronRight, Wallet, Star, Briefcase, X, Zap
} from 'lucide-react';

const INDIVIDUAL_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/content', label: 'Content Studio', icon: PenSquare },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/dashboard/scheduler', label: 'Scheduler', icon: Calendar },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/influencers', label: 'Influencer Market', icon: Users },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const INFLUENCER_NAV = [
  { href: '/dashboard/influencer', label: 'Influencer Hub', icon: Star },
  { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/content', label: 'Content Studio', icon: PenSquare },
  { href: '/dashboard/scheduler', label: 'Scheduler', icon: Calendar },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/campaigns', label: 'Campaign Jobs', icon: Briefcase },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isInfluencer = user?.accountType === 'INFLUENCER';
  const navItems = isInfluencer ? INFLUENCER_NAV : INDIVIDUAL_NAV;

  return (
    <aside className={cn(
      'flex-shrink-0 flex flex-col border-r border-white/[0.06] transition-all duration-300 z-30',
      'fixed lg:relative inset-y-0 left-0',
      open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      collapsed ? 'w-16' : 'w-60'
    )} style={{ background: '#0A1020' }}>

      {/* Logo */}
      <div className={cn('flex items-center border-b border-white/[0.06] flex-shrink-0', collapsed ? 'h-16 justify-center px-2' : 'h-16 px-5 gap-3')}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00D4AA] flex items-center justify-center flex-shrink-0">
          <img src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" className="w-8 h-8 object-cover rounded-lg" />
        </div>
        {!collapsed && (
          <span style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold" style={{ color: "#E8C96A" }}>Yoyzie AI</span>
        )}
        <button onClick={onClose} className="lg:hidden ml-auto p-1 text-white/30 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Account type badge */}
      {!collapsed && (
        <div className="px-4 pt-4">
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium',
            isInfluencer ? 'bg-[#A855F7]/10 border-[#A855F7]/20 text-[#A855F7]' : 'bg-[#0066FF]/10 border-[#0066FF]/20 text-[#0066FF]'
          )}>
            {isInfluencer ? <Star className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
            {isInfluencer ? 'Influencer account' : `${user?.plan || 'Free'} plan`}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 mt-2">
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/dashboard/influencer' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={cn(
                'flex items-center rounded-xl transition-all group',
                collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2.5',
                active ? 'bg-[#0066FF]/15 text-white border border-[#0066FF]/20' : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
              )}
              title={collapsed ? item.label : undefined}>
              <item.icon className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4', active ? 'text-[#0066FF]' : '')} />
              {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User profile & collapse */}
      {!collapsed && (
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00D4AA] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button onClick={onToggleCollapse}
        className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/10 transition-all absolute -right-3 top-20">
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
