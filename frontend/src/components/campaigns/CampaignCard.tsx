'use client';

import { useState } from 'react';
import { MoreHorizontal, Play, Pause, Trash2, Edit, TrendingUp, Eye, MousePointerClick, Users } from 'lucide-react';

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft' | 'completed' | 'scheduled';
  type: string;
  platforms: { id: string; color: string; initial: string }[];
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  reach: number;
  clicks: number;
  engagement: number;
  conversions: number;
  goal: string;
  progress: number;
  color: string;
}

const STATUS_CONFIG = {
  active: { label: 'Active', bg: 'rgba(0,212,170,0.12)', color: '#00D4AA', dot: '#00D4AA' },
  paused: { label: 'Paused', bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', dot: '#F59E0B' },
  draft: { label: 'Draft', bg: 'rgba(136,136,136,0.12)', color: '#888', dot: '#888' },
  completed: { label: 'Completed', bg: 'rgba(168,85,247,0.12)', color: '#A855F7', dot: '#A855F7' },
  scheduled: { label: 'Scheduled', bg: 'rgba(0,102,255,0.12)', color: '#0066FF', dot: '#0066FF' },
};

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (c: Campaign) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function CampaignCard({ campaign, onEdit, onDelete, onToggle }: CampaignCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_CONFIG[campaign.status];
  const budgetPct = Math.min((campaign.spent / campaign.budget) * 100, 100);

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden feature-card">
      {/* Color accent bar */}
      <div className="h-1 w-full" style={{ background: campaign.color }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-sm font-semibold text-white truncate">{campaign.name}</h3>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0"
                style={{ background: status.bg, color: status.color }}>
                <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: status.dot }} />
                {status.label}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-white/40">{campaign.type}</span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-white/40">{campaign.goal}</span>
            </div>
          </div>

          {/* Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-white/10 shadow-2xl z-20 overflow-hidden"
                style={{ background: '#0D1525' }}>
                <button onClick={() => { onEdit(campaign); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/[0.06] transition-all">
                  <Edit className="w-3.5 h-3.5" /> Edit campaign
                </button>
                <button onClick={() => { onToggle(campaign.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/[0.06] transition-all">
                  {campaign.status === 'active'
                    ? <><Pause className="w-3.5 h-3.5" /> Pause</>
                    : <><Play className="w-3.5 h-3.5" /> Resume</>}
                </button>
                <button onClick={() => { onDelete(campaign.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Platform badges */}
        <div className="flex items-center gap-1.5 mb-4">
          {campaign.platforms.map(p => (
            <div key={p.id}
              className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: `${p.color}25`, border: `1px solid ${p.color}35` }}>
              {p.initial}
            </div>
          ))}
          <span className="text-xs text-white/30 ml-1">{campaign.startDate} → {campaign.endDate}</span>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Reach', value: campaign.reach >= 1000 ? `${(campaign.reach/1000).toFixed(1)}K` : campaign.reach, icon: Eye, color: '#0066FF' },
            { label: 'Clicks', value: campaign.clicks >= 1000 ? `${(campaign.clicks/1000).toFixed(1)}K` : campaign.clicks, icon: MousePointerClick, color: '#00D4AA' },
            { label: 'Engagement', value: `${campaign.engagement}%`, icon: TrendingUp, color: '#A855F7' },
            { label: 'Conversions', value: campaign.conversions, icon: Users, color: '#FF6B35' },
          ].map(m => (
            <div key={m.label} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
              <div className="flex items-center gap-1.5 mb-1">
                <m.icon className="w-3 h-3" style={{ color: m.color }} />
                <span className="text-[10px] text-white/40">{m.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', color: m.color }}
                className="text-base font-bold">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Budget bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-white/40">Budget used</span>
            <span className="text-[11px] text-white/60">
              ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-white/[0.06] rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all"
              style={{
                width: `${budgetPct}%`,
                background: budgetPct > 90 ? '#EF4444' : budgetPct > 70 ? '#F59E0B' : campaign.color
              }} />
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-white/40">Campaign progress</span>
            <span className="text-[11px] text-white/60">{campaign.progress}%</span>
          </div>
          <div className="w-full bg-white/[0.06] rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${campaign.progress}%`, background: campaign.color }} />
          </div>
        </div>
      </div>
    </div>
  );
}
