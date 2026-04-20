'use client';

import { useState } from 'react';
import { Wallet, TrendingUp, Star, Zap, Shield, ArrowUpRight, Clock, Check, ChevronRight } from 'lucide-react';

const ACTIVE_CAMPAIGNS = [
  { id: '1', brand: 'Safaricom', title: 'Home Fibre Campaign', budget: 45000, status: 'In progress', deadline: 'Apr 28', progress: 60, platform: 'Instagram' },
  { id: '2', brand: 'M-KOPA', title: 'Solar Panel Awareness', budget: 28000, status: 'Pending review', deadline: 'May 5', progress: 100, platform: 'TikTok' },
];

const AVAILABLE_JOBS = [
  { id: '1', brand: 'Equity Bank', title: 'EazzyBiz App Launch', budget: '30,000–50,000', category: 'Finance', platforms: ['TikTok', 'Instagram'], deadline: '5 days left' },
  { id: '2', brand: 'Naivas', title: 'Fresh Food Campaign', budget: '15,000–25,000', category: 'Food & Lifestyle', platforms: ['Instagram'], deadline: '3 days left' },
  { id: '3', brand: 'Jumia Kenya', title: 'Flash Sale Promo', budget: '20,000–35,000', category: 'E-commerce', platforms: ['TikTok', 'Twitter'], deadline: '7 days left' },
];

export default function InfluencerDashboard() {
  const [tab, setTab] = useState<'overview' | 'jobs' | 'campaigns'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl sm:text-3xl font-bold text-white">
            Influencer Hub
          </h1>
          <p className="text-white/40 text-sm mt-1">Your campaigns, earnings, and marketplace</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00D4AA]/15 border border-[#00D4AA]/25">
          <Star className="w-3.5 h-3.5 text-[#00D4AA]" />
          <span className="text-xs font-medium text-[#00D4AA]">Influencer Pro</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Wallet balance', value: 'KES 24,500', sub: 'Available to withdraw', icon: Wallet, color: '#00D4AA' },
          { label: 'This month earnings', value: 'KES 73,000', sub: 'After 15% commission', icon: TrendingUp, color: '#0066FF' },
          { label: 'Active campaigns', value: '2', sub: '1 pending review', icon: Zap, color: '#A855F7' },
          { label: 'Audience score', value: '94%', sub: 'Human followers', icon: Shield, color: '#FF6B35' },
        ].map(stat => (
          <div key={stat.label} className="glass rounded-2xl p-5 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}18`, color: stat.color }}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold text-white mb-0.5">{stat.value}</div>
            <div className="text-xs text-white/40">{stat.label}</div>
            <div className="text-[10px] text-white/25 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Commission info */}
      <div className="glass rounded-2xl border border-[#00D4AA]/20 p-4 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(0,102,255,0.04))' }}>
        <Zap className="w-5 h-5 text-[#00D4AA] flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-white">You're on the Influencer Pro plan — 15% commission</p>
          <p className="text-xs text-white/50">Upgrade to Creator Mode and reduce commission to 10% — save KES 7,500 on a KES 50,000 campaign</p>
        </div>
        <button className="text-xs font-medium text-[#00D4AA] hover:text-white transition-colors whitespace-nowrap">Upgrade →</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
        {[{ id: 'overview', label: 'Overview' }, { id: 'jobs', label: 'Available jobs' }, { id: 'campaigns', label: 'My campaigns' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Active Campaigns */}
          <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">Active campaigns</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {ACTIVE_CAMPAIGNS.map(c => (
                <div key={c.id} className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-white">{c.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">{c.brand} · {c.platform}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${c.status === 'In progress' ? 'bg-[#0066FF]/20 text-[#0066FF]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                    <span>KES {c.budget.toLocaleString()} budget</span>
                    <span>Due {c.deadline}</span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-[#00D4AA] transition-all" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bot Detection Summary */}
          <div className="glass rounded-2xl border border-white/[0.06] p-5">
            <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-4">Audience authenticity</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.8" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00D4AA" strokeWidth="3.8" strokeDasharray="94 6" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ fontFamily: 'var(--font-display)' }} className="text-lg font-bold text-white">94%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">Excellent audience quality</p>
                <p className="text-xs text-white/40 leading-relaxed">94% of your followers are estimated to be real human accounts. This makes you highly attractive to brands.</p>
              </div>
            </div>
            {[
              { label: 'Real followers', value: '94%', color: '#00D4AA' },
              { label: 'Engagement authenticity', value: '91%', color: '#0066FF' },
              { label: 'Comment quality score', value: '88%', color: '#A855F7' },
            ].map(m => (
              <div key={m.label} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">{m.label}</span>
                  <span className="font-medium" style={{ color: m.color }}>{m.value}</span>
                </div>
                <div className="w-full bg-white/[0.06] rounded-full h-1">
                  <div className="h-1 rounded-full" style={{ width: m.value, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'jobs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/50">{AVAILABLE_JOBS.length} jobs available matching your profile</p>
            <button className="text-xs text-[#0066FF]">Filter by category</button>
          </div>
          {AVAILABLE_JOBS.map(job => (
            <div key={job.id} className="glass rounded-2xl border border-white/[0.06] p-5 hover:border-white/15 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{job.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40">{job.category}</span>
                  </div>
                  <p className="text-xs text-white/40">{job.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#00D4AA]">KES {job.budget}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{job.deadline}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {job.platforms.map(p => (
                    <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-[#0066FF]/15 text-[#0066FF]">{p}</span>
                  ))}
                </div>
                <button className="flex items-center gap-1 text-xs font-medium text-[#0066FF] hover:text-white transition-colors">
                  View & apply <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'campaigns' && (
        <div className="space-y-4">
          {ACTIVE_CAMPAIGNS.map(c => (
            <div key={c.id} className="glass rounded-2xl border border-white/[0.06] p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-white">{c.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{c.brand} · Due {c.deadline}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${c.status === 'In progress' ? 'bg-[#0066FF]/20 text-[#0066FF]' : 'bg-[#00D4AA]/20 text-[#00D4AA]'}`}>
                  {c.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                <span>Progress: {c.progress}%</span>
                <span>Budget: KES {c.budget.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/[0.06] rounded-full h-2 mb-4">
                <div className="h-2 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00D4AA]" style={{ width: `${c.progress}%` }} />
              </div>
              {c.progress === 100 && (
                <div className="flex items-center gap-2 text-xs text-[#00D4AA]">
                  <Check className="w-3.5 h-3.5" /> Content delivered — awaiting brand approval and payment release
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
