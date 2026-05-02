'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import {
  LayoutDashboard, PenSquare, Megaphone, Calendar,
  BarChart3, Users, CreditCard, Settings,
  ChevronLeft, ChevronRight, Wallet, Star,
  Briefcase, X, Zap
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
    <aside
      className={cn(
        'flex-shrink-0 flex flex-col border-r transition-all duration-300 z-30',
        'fixed lg:relative inset-y-0 left-0',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        collapsed ? 'w-16' : 'w-60'
      )}
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #0D0D0F 100%)',
        borderColor: 'rgba(201,168,76,0.12)',
      }}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center border-b flex-shrink-0',
          collapsed ? 'h-16 justify-center px-2' : 'h-16 px-4 gap-3'
        )}
        style={{ borderColor: 'rgba(201,168,76,0.1)' }}
      >
        <div
          className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
          style={{ border: '1px solid rgba(201,168,76,0.35)' }}
        >
          <Image
            src="/images/yoyzie-logo.jpg"
            alt="Yoyzie AI"
            width={36}
            height={36}
            className="object-cover w-full h-full"
          />
        </div>
        {!collapsed && (
          <span
            style={{ fontFamily: 'var(--font-display)', color: '#E8C96A' }}
            className="text-base font-bold tracking-tight"
          >
            Yoyzie AI
          </span>
        )}
        <button
          onClick={onClose}
          className="lg:hidden ml-auto p-1 text-white/30 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Plan badge */}
      {!collapsed && (
        <div className="px-3 pt-4">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
            style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: '#E8C96A',
            }}
          >
            {isInfluencer
              ? <Star className="w-3.5 h-3.5 flex-shrink-0" />
              : <Zap className="w-3.5 h-3.5 flex-shrink-0" />}
            <span className="truncate">
              {isInfluencer ? 'Influencer account' : `${user?.plan || 'Free'} plan`}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 mt-3">
        {navItems.map(item => {
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' &&
              item.href !== '/dashboard/influencer' &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center rounded-xl transition-all group',
                collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2.5'
              )}
              style={active ? {
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.25)',
                color: '#E8C96A',
              } : {
                border: '1px solid transparent',
                color: 'rgba(255,255,255,0.45)',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.05)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }
              }}
            >
              <item.icon
                className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')}
                style={{ color: active ? '#C9A84C' : 'inherit' }}
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      {!collapsed && (
        <div
          className="p-4 border-t"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
                color: '#0A0A0A',
              }}
            >
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full absolute -right-3 top-20 transition-all"
        style={{
          background: '#0D0D0F',
          border: '1px solid rgba(201,168,76,0.25)',
          color: 'rgba(201,168,76,0.6)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = '#E8C96A';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.6)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.25)';
        }}
      >
        {collapsed
          ? <ChevronRight className="w-3.5 h-3.5" />
          : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
