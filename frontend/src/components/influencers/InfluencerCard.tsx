'use client';

import { useState } from 'react';
import { Star, TrendingUp, Users, Heart, MessageCircle, ExternalLink, BookmarkPlus, BookmarkCheck, Verified } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  category: string;
  tier: 'nano' | 'micro' | 'macro' | 'mega';
  platforms: { id: string; color: string; initial: string; followers: string }[];
  totalFollowers: string;
  engagementRate: number;
  avgLikes: string;
  avgComments: string;
  rating: number;
  reviews: number;
  pricePerPost: string;
  location: string;
  tags: string[];
  bio: string;
  verified: boolean;
  recentGrowth: string;
  audienceMatch: number;
  campaignsCompleted: number;
}

const TIER_CONFIG = {
  nano: { label: 'Nano', color: '#00D4AA', bg: 'rgba(0,212,170,0.12)', range: '1K–10K' },
  micro: { label: 'Micro', color: '#0066FF', bg: 'rgba(0,102,255,0.12)', range: '10K–100K' },
  macro: { label: 'Macro', color: '#A855F7', bg: 'rgba(168,85,247,0.12)', range: '100K–1M' },
  mega: { label: 'Mega', color: '#FF6B35', bg: 'rgba(255,107,53,0.12)', range: '1M+' },
};

interface InfluencerCardProps {
  influencer: Influencer;
  onContact: (i: Influencer) => void;
  onView: (i: Influencer) => void;
}

export function InfluencerCard({ influencer, onContact, onView }: InfluencerCardProps) {
  const [saved, setSaved] = useState(false);
  const tier = TIER_CONFIG[influencer.tier];

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden feature-card flex flex-col">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${tier.color}40, ${tier.color}20)`, border: `1.5px solid ${tier.color}40` }}>
              {influencer.avatar}
            </div>
            {influencer.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0066FF] border-2 flex items-center justify-center"
                style={{ borderColor: '#0D1525' }}>
                <Verified className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <h3 className="text-sm font-semibold text-white truncate">{influencer.name}</h3>
            </div>
            <p className="text-xs text-white/40 mb-1.5">{influencer.handle}</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: tier.bg, color: tier.color }}>
                {tier.label} · {tier.range}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40">
                {influencer.category}
              </span>
            </div>
          </div>

          <button onClick={() => setSaved(!saved)}
            className={cn('p-1.5 rounded-lg transition-all flex-shrink-0',
              saved ? 'text-[#0066FF] bg-[#0066FF]/10' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.06]')}>
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
          </button>
        </div>

        {/* Bio */}
        <p className="text-xs text-white/50 leading-relaxed line-clamp-2 mb-4">{influencer.bio}</p>

        {/* Platform badges */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {influencer.platforms.map(p => (
            <div key={p.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium"
              style={{ background: `${p.color}15`, border: `1px solid ${p.color}25`, color: p.color }}>
              <div className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold text-white"
                style={{ background: p.color }}>
                {p.initial}
              </div>
              {p.followers}
            </div>
          ))}
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/[0.03] rounded-xl p-2.5 text-center border border-white/[0.04]">
            <div style={{ fontFamily: 'var(--font-display)' }} className="text-sm font-bold text-[#0066FF]">
              {influencer.totalFollowers}
            </div>
            <div className="text-[10px] text-white/40 mt-0.5 flex items-center justify-center gap-1">
              <Users className="w-2.5 h-2.5" /> Total
            </div>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-2.5 text-center border border-white/[0.04]">
            <div style={{ fontFamily: 'var(--font-display)' }} className="text-sm font-bold text-[#00D4AA]">
              {influencer.engagementRate}%
            </div>
            <div className="text-[10px] text-white/40 mt-0.5 flex items-center justify-center gap-1">
              <Heart className="w-2.5 h-2.5" /> Eng. rate
            </div>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-2.5 text-center border border-white/[0.04]">
            <div style={{ fontFamily: 'var(--font-display)' }} className="text-sm font-bold text-[#A855F7]">
              {influencer.audienceMatch}%
            </div>
            <div className="text-[10px] text-white/40 mt-0.5">Match</div>
          </div>
        </div>

        {/* Rating & growth */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-3 h-3"
                  fill={i <= Math.floor(influencer.rating) ? '#F59E0B' : 'none'}
                  stroke={i <= Math.floor(influencer.rating) ? '#F59E0B' : 'rgba(255,255,255,0.2)'}
                />
              ))}
            </div>
            <span className="text-xs text-white/50">{influencer.rating} ({influencer.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-[#00D4AA] text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>{influencer.recentGrowth} this month</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {influencer.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/40 border border-white/[0.06]">
              #{tag}
            </span>
          ))}
        </div>

        {/* Price & campaigns */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-white/30">From </span>
            <span style={{ fontFamily: 'var(--font-display)' }} className="text-white font-bold text-sm">
              {influencer.pricePerPost}
            </span>
            <span className="text-white/30"> / post</span>
          </div>
          <span className="text-white/30">{influencer.campaignsCompleted} campaigns done</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto px-5 pb-5 flex gap-2">
        <button onClick={() => onView(influencer)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all">
          <ExternalLink className="w-3.5 h-3.5" /> View profile
        </button>
        <button onClick={() => onContact(influencer)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-[#0066FF] text-white hover:bg-[#0052CC] transition-all shadow-lg shadow-blue-500/20">
          <MessageCircle className="w-3.5 h-3.5" /> Contact
        </button>
      </div>
    </div>
  );
}
