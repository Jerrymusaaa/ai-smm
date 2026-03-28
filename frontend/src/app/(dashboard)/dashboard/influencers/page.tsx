'use client';

import { useState, useMemo } from 'react';
import { Search, Sparkles, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InfluencerCard, Influencer } from '@/components/influencers/InfluencerCard';
import { InfluencerFilters, FilterState } from '@/components/influencers/InfluencerFilters';
import { ContactModal } from '@/components/influencers/ContactModal';
import { MarketplaceStats } from '@/components/influencers/MarketplaceStats';

const INFLUENCERS: Influencer[] = [
  {
    id: '1', name: 'Aria Chen', handle: '@ariachen.creates', avatar: '👩‍💻',
    category: 'Tech & SaaS', tier: 'macro', verified: true,
    platforms: [
      { id: 'instagram', color: '#E1306C', initial: 'IG', followers: '284K' },
      { id: 'tiktok', color: '#FF0050', initial: 'TT', followers: '142K' },
      { id: 'youtube', color: '#FF0000', initial: 'YT', followers: '89K' },
    ],
    totalFollowers: '515K', engagementRate: 6.8, avgLikes: '18.4K', avgComments: '840',
    rating: 4.9, reviews: 127, pricePerPost: '$2,400', location: 'San Francisco, US',
    tags: ['saas', 'productivity', 'tech', 'startups', 'AI'],
    bio: 'Tech creator helping founders and marketers build better digital products. Known for deep-dive tool reviews and productivity workflows.',
    recentGrowth: '+8.2K', audienceMatch: 94, campaignsCompleted: 48,
  },
  {
    id: '2', name: 'Marcus Webb', handle: '@marcuswebb', avatar: '🧑‍🎨',
    category: 'Business', tier: 'micro', verified: true,
    platforms: [
      { id: 'linkedin', color: '#0A66C2', initial: 'IN', followers: '62K' },
      { id: 'twitter', color: '#1DA1F2', initial: 'X', followers: '28K' },
    ],
    totalFollowers: '90K', engagementRate: 8.4, avgLikes: '4.2K', avgComments: '380',
    rating: 4.8, reviews: 84, pricePerPost: '$890', location: 'London, UK',
    tags: ['marketing', 'growth', 'business', 'strategy', 'B2B'],
    bio: 'Growth strategist and B2B marketing advisor. I share actionable frameworks for scaling businesses from 0 to 7 figures.',
    recentGrowth: '+3.4K', audienceMatch: 91, campaignsCompleted: 32,
  },
  {
    id: '3', name: 'Priya Nair', handle: '@priya.digital', avatar: '👩‍💼',
    category: 'Finance', tier: 'micro', verified: false,
    platforms: [
      { id: 'instagram', color: '#E1306C', initial: 'IG', followers: '48K' },
      { id: 'tiktok', color: '#FF0050', initial: 'TT', followers: '91K' },
    ],
    totalFollowers: '139K', engagementRate: 9.2, avgLikes: '8.1K', avgComments: '640',
    rating: 4.7, reviews: 56, pricePerPost: '$720', location: 'Mumbai, India',
    tags: ['fintech', 'investing', 'personalfinance', 'startup'],
    bio: 'Making finance simple and accessible. I break down complex financial concepts into easy-to-understand content for millennials.',
    recentGrowth: '+12.1K', audienceMatch: 82, campaignsCompleted: 24,
  },
  {
    id: '4', name: 'Jake Torres', handle: '@jakecreates', avatar: '🧑‍🎬',
    category: 'Entertainment', tier: 'mega', verified: true,
    platforms: [
      { id: 'tiktok', color: '#FF0050', initial: 'TT', followers: '2.4M' },
      { id: 'instagram', color: '#E1306C', initial: 'IG', followers: '890K' },
      { id: 'youtube', color: '#FF0000', initial: 'YT', followers: '540K' },
    ],
    totalFollowers: '3.83M', engagementRate: 4.2, avgLikes: '84K', avgComments: '3.2K',
    rating: 4.6, reviews: 203, pricePerPost: '$12,500', location: 'Los Angeles, US',
    tags: ['viral', 'entertainment', 'lifestyle', 'comedy', 'trending'],
    bio: 'Full-time content creator making viral entertainment content. Featured in Forbes 30 Under 30. Known for creative storytelling.',
    recentGrowth: '+84K', audienceMatch: 68, campaignsCompleted: 124,
  },
  {
    id: '5', name: 'Sofia Martinez', handle: '@sofia.lifestyle', avatar: '👩‍🌾',
    category: 'Fitness & Health', tier: 'micro', verified: true,
    platforms: [
      { id: 'instagram', color: '#E1306C', initial: 'IG', followers: '74K' },
      { id: 'youtube', color: '#FF0000', initial: 'YT', followers: '32K' },
    ],
    totalFollowers: '106K', engagementRate: 7.6, avgLikes: '5.6K', avgComments: '420',
    rating: 4.9, reviews: 91, pricePerPost: '$1,100', location: 'Barcelona, Spain',
    tags: ['fitness', 'wellness', 'healthy', 'lifestyle', 'mindfulness'],
    bio: 'Certified personal trainer and wellness coach. I help busy professionals build sustainable healthy habits through practical, science-backed content.',
    recentGrowth: '+4.8K', audienceMatch: 78, campaignsCompleted: 41,
  },
  {
    id: '6', name: 'Alex Kim', handle: '@alexkim.dev', avatar: '🧑‍💻',
    category: 'Tech & SaaS', tier: 'nano', verified: false,
    platforms: [
      { id: 'twitter', color: '#1DA1F2', initial: 'X', followers: '18K' },
      { id: 'linkedin', color: '#0A66C2', initial: 'IN', followers: '8K' },
    ],
    totalFollowers: '26K', engagementRate: 11.2, avgLikes: '1.8K', avgComments: '240',
    rating: 4.8, reviews: 28, pricePerPost: '$320', location: 'Seoul, South Korea',
    tags: ['developer', 'webdev', 'javascript', 'buildinpublic', 'indie'],
    bio: 'Indie developer and tech writer. I document my journey building SaaS products and share developer tools, tips, and honest reviews.',
    recentGrowth: '+1.4K', audienceMatch: 88, campaignsCompleted: 12,
  },
  {
    id: '7', name: 'Zara Ahmed', handle: '@zaraahmed.style', avatar: '👩‍🎤',
    category: 'Fashion & Beauty', tier: 'macro', verified: true,
    platforms: [
      { id: 'instagram', color: '#E1306C', initial: 'IG', followers: '420K' },
      { id: 'tiktok', color: '#FF0050', initial: 'TT', followers: '280K' },
    ],
    totalFollowers: '700K', engagementRate: 5.4, avgLikes: '22K', avgComments: '1.1K',
    rating: 4.7, reviews: 168, pricePerPost: '$3,800', location: 'Dubai, UAE',
    tags: ['fashion', 'beauty', 'luxury', 'style', 'ootd'],
    bio: 'Fashion and beauty creator based in Dubai. I specialize in luxury lifestyle content and brand partnerships with premium aesthetics.',
    recentGrowth: '+18K', audienceMatch: 72, campaignsCompleted: 87,
  },
  {
    id: '8', name: 'Ryan Park', handle: '@ryanpark.food', avatar: '👨‍🍳',
    category: 'Food & Lifestyle', tier: 'micro', verified: false,
    platforms: [
      { id: 'instagram', color: '#E1306C', initial: 'IG', followers: '52K' },
      { id: 'tiktok', color: '#FF0050', initial: 'TT', followers: '38K' },
      { id: 'youtube', color: '#FF0000', initial: 'YT', followers: '24K' },
    ],
    totalFollowers: '114K', engagementRate: 8.8, avgLikes: '6.2K', avgComments: '520',
    rating: 4.6, reviews: 43, pricePerPost: '$680', location: 'New York, US',
    tags: ['foodie', 'recipes', 'cooking', 'restaurant', 'lifestyle'],
    bio: 'Food photographer and recipe developer. I create mouthwatering content that tells the story behind every dish.',
    recentGrowth: '+5.2K', audienceMatch: 65, campaignsCompleted: 19,
  },
];

const SORT_OPTIONS = ['Best match', 'Highest engagement', 'Most followers', 'Best rated', 'Lowest price'];

const DEFAULT_FILTERS: FilterState = {
  tiers: [], platforms: [], categories: [],
  minEngagement: 0, maxPrice: 10000, minFollowers: 0,
  verifiedOnly: false, minMatch: 0,
};

export default function InfluencersPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Best match');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [contactInfluencer, setContactInfluencer] = useState<Influencer | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    let result = INFLUENCERS.filter(inf => {
      if (search && !inf.name.toLowerCase().includes(search.toLowerCase()) &&
          !inf.handle.toLowerCase().includes(search.toLowerCase()) &&
          !inf.category.toLowerCase().includes(search.toLowerCase()) &&
          !inf.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
      if (filters.tiers.length && !filters.tiers.includes(inf.tier)) return false;
      if (filters.platforms.length && !inf.platforms.some(p => filters.platforms.includes(p.id))) return false;
      if (filters.categories.length && !filters.categories.includes(inf.category)) return false;
      if (filters.verifiedOnly && !inf.verified) return false;
      if (inf.engagementRate < filters.minEngagement) return false;
      if (inf.audienceMatch < filters.minMatch) return false;
      const price = parseInt(inf.pricePerPost.replace(/[$,]/g, ''));
      if (price > filters.maxPrice) return false;
      return true;
    });

    switch (sort) {
      case 'Highest engagement': return result.sort((a, b) => b.engagementRate - a.engagementRate);
      case 'Most followers': return result.sort((a, b) =>
        parseInt(b.totalFollowers.replace(/[KM,]/g, '')) - parseInt(a.totalFollowers.replace(/[KM,]/g, '')));
      case 'Best rated': return result.sort((a, b) => b.rating - a.rating);
      case 'Lowest price': return result.sort((a, b) =>
        parseInt(a.pricePerPost.replace(/[$,]/g, '')) - parseInt(b.pricePerPost.replace(/[$,]/g, '')));
      default: return result.sort((a, b) => b.audienceMatch - a.audienceMatch);
    }
  }, [search, sort, filters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-bold text-white">
            Influencer Marketplace
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Discover and collaborate with {INFLUENCERS.length > 0 ? '500K+' : ''} verified creators
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[#0066FF]/20 text-xs text-[#0066FF] hover:bg-[#0066FF]/10 transition-all">
            <Sparkles className="w-3.5 h-3.5" /> AI match me
          </button>
          <Button size="sm" className="rounded-xl gap-2">
            My collaborations
          </Button>
        </div>
      </div>

      {/* Stats */}
      <MarketplaceStats />

      {/* AI recommendation banner */}
      <div className="rounded-2xl border border-[#0066FF]/20 p-4 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.08), rgba(0,212,170,0.04))' }}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00D4AA] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">AI found 3 perfect matches for your brand</p>
          <p className="text-xs text-white/50 mt-0.5">
            Based on your audience demographics and campaign history, Aria Chen, Marcus Webb, and Alex Kim have the highest audience overlap with your followers.
          </p>
        </div>
        <button className="text-xs text-[#0066FF] hover:text-[#3385FF] font-medium transition-colors flex-shrink-0">
          View matches →
        </button>
      </div>

      {/* Search + sort + view toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl glass border border-white/[0.06] flex-1">
          <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
          <input type="text" placeholder="Search by name, niche, or keyword..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none" />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 outline-none cursor-pointer">
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>

          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
              showFilters ? 'border-[#0066FF]/40 bg-[#0066FF]/15 text-[#0066FF]' : 'glass border-white/[0.06] text-white/50 hover:text-white'
            }`}>
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <div className="flex items-center bg-white/[0.04] rounded-xl border border-white/[0.06] p-1">
            <button onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex gap-6 ${showFilters ? 'items-start' : ''}`}>
        {/* Filters sidebar */}
        {showFilters && (
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <InfluencerFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>
        )}

        {/* Influencer grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-white/50">
              Showing <span className="text-white font-medium">{filtered.length}</span> creators
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="glass rounded-2xl border border-white/[0.06] p-16 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-white/50 text-sm mb-2">No influencers found</p>
              <p className="text-white/25 text-xs mb-5">Try adjusting your filters or search terms</p>
              <Button size="sm" variant="outline" onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(''); }}
                className="rounded-xl">
                Reset all filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
              : 'space-y-4'
            }>
              {filtered.map(inf => (
                <InfluencerCard
                  key={inf.id}
                  influencer={inf}
                  onContact={setContactInfluencer}
                  onView={inf => console.log('View:', inf.name)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact modal */}
      {contactInfluencer && (
        <ContactModal
          influencer={contactInfluencer}
          onClose={() => setContactInfluencer(null)}
        />
      )}
    </div>
  );
}
