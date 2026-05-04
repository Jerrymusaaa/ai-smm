'use client';

import { useState } from 'react';
import { Wallet, TrendingUp, Star, Zap, Shield, Check, ChevronRight, ArrowUpRight } from 'lucide-react';

const JOBS = [
  { id: '1', brand: 'Equity Bank',  title: 'EazzyBiz App Launch',     budget: '30,000–50,000', category: 'Finance',         platforms: ['TikTok','Instagram'], deadline: '5 days left',  match: 94 },
  { id: '2', brand: 'Naivas',       title: 'Fresh Food Campaign',       budget: '15,000–25,000', category: 'Food & Lifestyle', platforms: ['Instagram'],          deadline: '3 days left',  match: 88 },
  { id: '3', brand: 'Jumia Kenya',  title: 'Flash Sale Promo',          budget: '20,000–35,000', category: 'E-commerce',       platforms: ['TikTok','X'],         deadline: '7 days left',  match: 81 },
];

const CAMPAIGNS = [
  { id: '1', brand: 'Safaricom', title: 'Home Fibre Campaign', budget: 45000, status: 'In progress',   progress: 60,  platform: 'Instagram', deadline: 'Apr 28' },
  { id: '2', brand: 'M-KOPA',   title: 'Solar Panel Awareness', budget: 28000, status: 'Pending review', progress: 100, platform: 'TikTok',    deadline: 'May 5'  },
];

export default function InfluencerHub() {
  const [tab, setTab] = useState<'overview' | 'jobs' | 'campaigns'>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-bold text-white">Influencer Hub</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Your campaigns, earnings and marketplace
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border"
          style={{ background: 'rgba(201,168,76,0.08)', borderColor: 'rgba(201,168,76,0.2)', color: '#E8C96A' }}>
          <Star className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Influencer Pro</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Wallet balance',     value: 'KES 24,500', sub: 'Tap to withdraw',         icon: Wallet,     color: '#C9A84C' },
          { label: 'Earned this month',  value: 'KES 73,000', sub: 'After 15% commission',    icon: TrendingUp, color: '#E8C96A' },
          { label: 'Active campaigns',   value: '2',          sub: '1 pending brand review',  icon: Zap,        color: '#C9A84C' },
          { label: 'Audience score',     value: '94%',        sub: 'Human followers',          icon: Shield,     color: '#E8C96A' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-5 border"
            style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${s.color}18`, border: `1px solid ${s.color}25` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold text-white mb-0.5">
              {s.value}
            </div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Commission upgrade nudge */}
      <div className="rounded-2xl p-4 border flex items-center gap-4"
        style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.15)' }}>
        <Zap className="w-5 h-5 flex-shrink-0" style={{ color: '#C9A84C' }} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">You&apos;re on Influencer Pro — 15% commission</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Upgrade to Creator Mode and pay only 10% — save KES 7,500 on a KES 50,000 campaign
          </p>
        </div>
        <button className="text-xs font-semibold whitespace-nowrap transition-colors hover:text-white"
          style={{ color: '#C9A84C' }}>
          Upgrade →
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border"
        style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(201,168,76,0.1)' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'jobs', label: 'Available jobs' },
          { id: 'campaigns', label: 'My campaigns' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: tab === t.id ? 'rgba(201,168,76,0.12)' : 'transparent',
              color:      tab === t.id ? '#E8C96A' : 'rgba(255,255,255,0.4)',
              border:     tab === t.id ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Active campaigns */}
          <div className="glass rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
                Active campaigns
              </h3>
            </div>
            {CAMPAIGNS.map(c => (
              <div key={c.id} className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{c.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {c.brand} · {c.platform}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full font-medium"
                    style={c.status === 'In progress'
                      ? { background: 'rgba(201,168,76,0.15)', color: '#E8C96A' }
                      : { background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                    {c.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs mb-2"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span>KES {c.budget.toLocaleString()} budget</span>
                  <span>Due {c.deadline}</span>
                </div>
                <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-1.5 rounded-full transition-all"
                    style={{ width: `${c.progress}%`, background: 'linear-gradient(90deg,#C9A84C,#E8C96A)' }} />
                </div>
                {c.progress === 100 && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: '#C9A84C' }}>
                    <Check className="w-3.5 h-3.5" /> Delivered — awaiting brand approval
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Audience authenticity */}
          <div className="glass rounded-2xl border p-5" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)' }}
              className="text-base font-bold text-white mb-4">Audience authenticity</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none"
                    stroke="rgba(255,255,255,0.06)" strokeWidth="3.8" />
                  <circle cx="18" cy="18" r="15.9" fill="none"
                    stroke="#C9A84C" strokeWidth="3.8"
                    strokeDasharray="94 6" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ fontFamily: 'var(--font-display)' }}
                    className="text-lg font-bold text-white">94%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Excellent audience quality</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  94% of your followers are estimated real human accounts — highly attractive to brands.
                </p>
              </div>
            </div>
            {[
              { label: 'Real followers',           value: 94, display: '94%' },
              { label: 'Engagement authenticity',  value: 91, display: '91%' },
              { label: 'Comment quality score',    value: 88, display: '88%' },
            ].map(m => (
              <div key={m.label} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{m.label}</span>
                  <span style={{ color: '#E8C96A' }} className="font-medium">{m.display}</span>
                </div>
                <div className="w-full rounded-full h-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-1 rounded-full"
                    style={{ width: m.display, background: 'linear-gradient(90deg,#C9A84C,#E8C96A)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jobs tab */}
      {tab === 'jobs' && (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {JOBS.length} jobs matching your profile
          </p>
          {JOBS.map(job => (
            <div key={job.id}
              className="glass rounded-2xl border p-5 transition-all"
              style={{ borderColor: 'rgba(201,168,76,0.1)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.25)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.1)'}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-white">{job.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                      {job.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(201,168,76,0.12)', color: '#E8C96A' }}>
                      {job.match}% match
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{job.brand}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: '#E8C96A' }}>KES {job.budget}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {job.deadline}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {job.platforms.map(p => (
                    <span key={p} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>
                      {p}
                    </span>
                  ))}
                </div>
                <button className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-white"
                  style={{ color: '#C9A84C' }}>
                  View & apply <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaigns tab */}
      {tab === 'campaigns' && (
        <div className="space-y-4">
          {CAMPAIGNS.map(c => (
            <div key={c.id} className="glass rounded-2xl border p-5"
              style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-white">{c.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {c.brand} · Due {c.deadline}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full font-medium"
                  style={c.status === 'In progress'
                    ? { background: 'rgba(201,168,76,0.12)', color: '#E8C96A' }
                    : { background: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>
                  {c.status}
                </span>
              </div>
              <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <span>Progress: {c.progress}%</span>
                <span>Budget: KES {c.budget.toLocaleString()}</span>
              </div>
              <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-2 rounded-full"
                  style={{ width: `${c.progress}%`, background: 'linear-gradient(90deg,#C9A84C,#E8C96A)' }} />
              </div>
              {c.progress === 100 && (
                <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: '#C9A84C' }}>
                  <Check className="w-3.5 h-3.5" />
                  Content delivered — awaiting brand approval and payment release
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
