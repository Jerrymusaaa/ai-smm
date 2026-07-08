'use client';

import { usePlan } from '@/hooks/usePlan';
import { FeatureGate, UpgradePrompt } from '@/components/ui/FeatureGate';
import { Users, Search, Filter, Star, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const MOCK_INFLUENCERS = [
  { id:'1', name:'Wairimu Njeri', handle:'@wairiumnjeri', niche:'Fashion & Beauty', platform:'Instagram', followers:'128K', engagement:'6.2%', botScore:96, ctv:'4.8%', match:94, verified:true },
  { id:'2', name:'Brian Odhiambo', handle:'@brianodhiambo', niche:'Tech & Gadgets', platform:'TikTok', followers:'340K', engagement:'8.1%', botScore:91, ctv:'6.2%', match:88, verified:true },
  { id:'3', name:'Amina Hassan', handle:'@aminahassan_ke', niche:'Food & Lifestyle', platform:'Instagram', followers:'67K', engagement:'9.4%', botScore:98, ctv:'7.1%', match:82, verified:false },
  { id:'4', name:'Kevin Mwangi', handle:'@kevinmwangi', niche:'Finance & Business', platform:'LinkedIn', followers:'45K', engagement:'5.8%', botScore:94, ctv:'5.3%', match:79, verified:true },
  { id:'5', name:'Aisha Omar', handle:'@aishaomar_ke', niche:'Health & Fitness', platform:'TikTok', followers:'210K', engagement:'11.2%', botScore:89, ctv:'8.9%', match:76, verified:false },
  { id:'6', name:'Dennis Kamau', handle:'@denniskamau', niche:'Entertainment', platform:'YouTube', followers:'520K', engagement:'4.3%', botScore:92, ctv:'3.8%', match:71, verified:true },
];

function InfluencerCard({ inf, access }: { inf: typeof MOCK_INFLUENCERS[0]; access: 'browse' | 'full' }) {
  return (
    <div className="glass rounded-2xl border p-5 transition-all"
      style={{ borderColor: 'rgba(201,168,76,0.1)' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.25)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.1)'}>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
          {inf.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-white">{inf.name}</span>
            {inf.verified && <Shield className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />}
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{inf.handle}</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block"
            style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>
            {inf.niche}
          </span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs font-bold" style={{ color: '#E8C96A' }}>{inf.match}% match</div>
          <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>AI score</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Followers', value: inf.followers },
          { label: 'Engagement', value: inf.engagement },
          { label: 'Bot score', value: `${inf.botScore}%` },
          { label: 'Click/View', value: inf.ctv },
        ].map(stat => (
          <div key={stat.label} className="text-center p-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="text-xs font-bold text-white">{stat.value}</div>
            <div className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="text-[10px] mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {inf.platform} · {inf.followers} followers
      </div>

      {access === 'full' ? (
        <button className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
          View profile & contact
        </button>
      ) : (
        <button className="w-full py-2.5 rounded-xl text-xs font-medium border"
          style={{ borderColor: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>
          View profile (read only)
        </button>
      )}
    </div>
  );
}

export default function InfluencersPage() {
  const { influencerMarketplace, plan } = usePlan();
  const isLocked = influencerMarketplace === 'none';
  const isBrowseOnly = influencerMarketplace === 'browse';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl sm:text-3xl font-bold text-white">
            Influencer Marketplace
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Discover and hire Kenyan influencers for your campaigns
          </p>
        </div>
      </div>

      {isBrowseOnly && (
        <UpgradePrompt
          message="You can browse influencer profiles but need Power User to contact and hire them."
          neededPlan="Power User"
        />
      )}

      <FeatureGate
        locked={isLocked}
        message="The Influencer Marketplace lets you discover, analyze, and hire Kenyan influencers with AI-powered matching."
        neededPlan="Creator"
        blurred={isLocked}>

        {/* Search and filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(201,168,76,0.15)' }}>
            <Search className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input type="text" placeholder="Search influencers..." className="bg-transparent text-sm text-white outline-none flex-1" style={{ color: 'white' }} />
          </div>
          {['All niches', 'Fashion', 'Tech', 'Food', 'Finance', 'Health'].map(f => (
            <button key={f} className="px-3 py-2.5 rounded-xl text-xs border transition-all"
              style={{ borderColor: 'rgba(201,168,76,0.15)', color: 'rgba(255,255,255,0.5)' }}>
              {f}
            </button>
          ))}
        </div>

        {/* AI match info */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border mb-5"
          style={{ background: 'rgba(201,168,76,0.04)', borderColor: 'rgba(201,168,76,0.12)' }}>
          <Star className="w-4 h-4 flex-shrink-0" style={{ color: '#C9A84C' }} />
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Match percentages are calculated by AI based on your business profile, niche, and campaign goals.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {MOCK_INFLUENCERS.map(inf => (
            <InfluencerCard key={inf.id} inf={inf} access={influencerMarketplace === 'full' ? 'full' : 'browse'} />
          ))}
        </div>
      </FeatureGate>
    </div>
  );
}
