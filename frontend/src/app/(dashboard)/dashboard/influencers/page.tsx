'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePlan } from '@/hooks/usePlan';
import { FeatureGate, UpgradePrompt } from '@/components/ui/FeatureGate';
import { Search, Shield, Star, Loader2, RefreshCw, X } from 'lucide-react';
import api from '@/lib/api';

const NICHES = [
  'All', 'Fashion & Beauty', 'Tech & Gadgets', 'Food & Lifestyle',
  'Finance & Business', 'Health & Fitness', 'Entertainment',
  'Travel & Adventure', 'Parenting & Family', 'Education', 'Gaming',
];

interface Influencer {
  id: string;
  name: string;
  avatar?: string;
  niches: string[];
  platforms: string[];
  handle: string;
  followersDisplay: string;
  engagementRate: number;
  botScore: number;
  clickToViewRatio: number;
  verifiedBadge: boolean;
  rating: number;
  totalCampaigns: number;
  match: number;
  matchReason?: string;
  commissionRate: number;
}

function InfluencerCard({
  inf, access, onContact,
}: {
  inf: Influencer;
  access: 'browse' | 'full';
  onContact: (inf: Influencer) => void;
}) {
  const initials = inf.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="glass rounded-2xl border p-5 flex flex-col transition-all"
      style={{ borderColor: 'rgba(201,168,76,0.1)' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.1)'}>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-white truncate">{inf.name}</span>
            {inf.verifiedBadge && (
              <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{inf.handle}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {inf.niches.slice(0, 2).map(n => (
              <span key={n} className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>
                {n}
              </span>
            ))}
          </div>
        </div>
        {inf.match > 0 && (
          <div className="text-right flex-shrink-0">
            <div className="text-xs font-bold" style={{ color: inf.match >= 85 ? '#E8C96A' : inf.match >= 70 ? '#C9A84C' : 'rgba(255,255,255,0.5)' }}>
              {inf.match}%
            </div>
            <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>AI match</div>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Followers', value: inf.followersDisplay },
          { label: 'Engagement', value: `${inf.engagementRate}%` },
          { label: 'Bot score', value: `${inf.botScore}%` },
          { label: 'Click/View', value: `${inf.clickToViewRatio}%` },
        ].map(s => (
          <div key={s.label} className="text-center p-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="text-xs font-bold text-white">{s.value}</div>
            <div className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Platforms + campaigns */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 flex-wrap">
          {inf.platforms.slice(0, 3).map(p => (
            <span key={p} className="text-[9px] px-1.5 py-0.5 rounded border"
              style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
              {p}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <Star className="w-3 h-3" style={{ color: '#C9A84C' }} />
          {inf.rating} · {inf.totalCampaigns} campaigns
        </div>
      </div>

      {/* Match reason */}
      {inf.matchReason && (
        <p className="text-[10px] mb-3 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          💡 {inf.matchReason}
        </p>
      )}

      {/* Action */}
      {access === 'full' ? (
        <button onClick={() => onContact(inf)}
          className="w-full mt-auto py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
          View profile & contact
        </button>
      ) : (
        <button className="w-full mt-auto py-2.5 rounded-xl text-xs font-medium border transition-all"
          style={{ borderColor: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>
          View profile (read only)
        </button>
      )}
    </div>
  );
}

function ContactModal({ inf, onClose }: { inf: Influencer; onClose: () => void }) {
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg rounded-2xl border overflow-hidden shadow-2xl"
        style={{ background: '#0A0A0A', borderColor: 'rgba(201,168,76,0.2)' }}>

        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Contact {inf.name}
          </h2>
          <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.3)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
              <Star className="w-6 h-6" style={{ color: '#E8C96A' }} />
            </div>
            <p className="text-base font-semibold text-white mb-2">Proposal sent!</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {inf.name} will be notified and can respond via the platform.
            </p>
            <button onClick={onClose} className="mt-4 text-sm" style={{ color: '#C9A84C' }}>Close</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.12)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
                {inf.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{inf.name}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {inf.niches.join(' · ')} · {inf.followersDisplay} followers
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs block mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Campaign budget (KES)
              </label>
              <input type="number" value={budget} onChange={e => setBudget(e.target.value)}
                placeholder="e.g. 25000"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none border transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.15)' }} />
            </div>

            <div>
              <label className="text-xs block mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Campaign brief / message
              </label>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder={`Hi ${inf.name.split(' ')[0]}, I'd like to collaborate with you on...`}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none border transition-all resize-none"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.15)' }} />
            </div>

            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm border transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                Cancel
              </button>
              <button
                onClick={() => setSent(true)}
                disabled={!message.trim() || !budget}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
                Send proposal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InfluencersPage() {
  const { influencerMarketplace, plan } = usePlan();
  const isLocked = influencerMarketplace === 'none';
  const isBrowseOnly = influencerMarketplace === 'browse';
  const access = influencerMarketplace === 'full' ? 'full' : 'browse';

  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeNiche, setActiveNiche] = useState('All');
  const [businessDesc, setBusinessDesc] = useState('');
  const [showMatchInput, setShowMatchInput] = useState(false);
  const [contactInf, setContactInf] = useState<Influencer | null>(null);
  const [error, setError] = useState('');

  const fetchInfluencers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (activeNiche !== 'All') params.niche = activeNiche;

      const query = new URLSearchParams(params).toString();
      const res = await api.instance.get(`/api/influencers${query ? `?${query}` : ''}`);
      setInfluencers(res.data.data || []);
    } catch (err: any) {
      setError('Failed to load influencers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, activeNiche]);

  const fetchAIMatches = async () => {
    setMatchLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (businessDesc) params.businessDescription = businessDesc;
      if (activeNiche !== 'All') params.niche = activeNiche;

      const query = new URLSearchParams(params).toString();
      const res = await api.instance.get(`/api/influencers/match${query ? `?${query}` : ''}`);
      setInfluencers(res.data.data || []);
      setShowMatchInput(false);
    } catch (err: any) {
      setError('AI matching failed. Showing all influencers instead.');
      fetchInfluencers();
    } finally {
      setMatchLoading(false);
    }
  };

  useEffect(() => {
    if (!isLocked) fetchInfluencers();
  }, [isLocked, fetchInfluencers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-bold text-white">
            Influencer Marketplace
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Discover and hire Kenyan influencers for your campaigns
          </p>
        </div>
        {!isLocked && (
          <button
            onClick={() => setShowMatchInput(!showMatchInput)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
            ✨ AI Match for me
          </button>
        )}
      </div>

      {isBrowseOnly && (
        <UpgradePrompt
          message="You can browse profiles but need Power User to contact and hire influencers."
          neededPlan="Power User"
        />
      )}

      <FeatureGate
        locked={isLocked}
        message="Discover, analyze and hire real Kenyan influencers with AI-powered matching, bot detection scores and click-to-view analytics."
        neededPlan="Creator"
        blurred={isLocked}>

        {/* AI match input */}
        {showMatchInput && (
          <div className="glass rounded-2xl border p-5 space-y-3"
            style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
            <h3 className="text-sm font-semibold text-white">
              ✨ Describe your business and we&apos;ll find the best influencer matches
            </h3>
            <textarea
              value={businessDesc}
              onChange={e => setBusinessDesc(e.target.value)}
              placeholder="e.g. We run a Nairobi-based organic skincare brand targeting young Kenyan women aged 20-35. We want influencers who genuinely care about natural beauty and wellness..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none border resize-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.15)' }} />
            <div className="flex gap-2">
              <button onClick={() => setShowMatchInput(false)}
                className="px-4 py-2 rounded-xl text-xs border transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                Cancel
              </button>
              <button onClick={fetchAIMatches} disabled={matchLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
                {matchLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Calculating matches...</> : 'Find my matches'}
              </button>
            </div>
          </div>
        )}

        {/* Search and filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(201,168,76,0.12)' }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchInfluencers()}
              placeholder="Search by name..."
              className="bg-transparent text-sm text-white outline-none flex-1"
            />
            {search && (
              <button onClick={() => { setSearch(''); }} style={{ color: 'rgba(255,255,255,0.3)' }}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {NICHES.map(n => (
              <button key={n} onClick={() => setActiveNiche(n)}
                className="px-3 py-1.5 rounded-xl text-xs border transition-all"
                style={{
                  borderColor: activeNiche === n ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)',
                  background: activeNiche === n ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                  color: activeNiche === n ? '#E8C96A' : 'rgba(255,255,255,0.5)',
                }}>
                {n}
              </button>
            ))}
            <button onClick={fetchInfluencers}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border transition-all"
              style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
              <RefreshCw className="w-3 h-3" /> Search
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
            {error}
          </div>
        )}

        {/* Results */}
        {loading || matchLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#C9A84C' }} />
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {matchLoading ? 'AI is calculating matches...' : 'Loading influencers...'}
              </p>
            </div>
          </div>
        ) : influencers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <Search className="w-6 h-6" style={{ color: '#C9A84C' }} />
            </div>
            <p className="text-sm font-medium text-white mb-1">No influencers found</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Try a different search or niche filter
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {influencers.length} influencer{influencers.length !== 1 ? 's' : ''}
                {influencers[0]?.match > 0 ? ' — sorted by AI match score' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {influencers.map(inf => (
                <InfluencerCard key={inf.id} inf={inf} access={access} onContact={setContactInf} />
              ))}
            </div>
          </>
        )}
      </FeatureGate>

      {contactInf && <ContactModal inf={contactInf} onClose={() => setContactInf(null)} />}
    </div>
  );
}
