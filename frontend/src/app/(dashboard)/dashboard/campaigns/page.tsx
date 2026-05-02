'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CampaignStats } from '@/components/campaigns/CampaignStats';
import { CampaignCard, Campaign } from '@/components/campaigns/CampaignCard';
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal';
import { CampaignChart } from '@/components/campaigns/CampaignChart';

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: '1', name: 'Summer Product Launch', status: 'active',
    type: 'Brand Awareness', goal: 'Reach 500K new users',
    platforms: [
      { id: 'instagram', color: '#E1306C', initial: 'IG' },
      { id: 'tiktok', color: '#FF0050', initial: 'TT' },
      { id: 'facebook', color: '#1877F2', initial: 'FB' },
    ],
    startDate: 'Apr 1', endDate: 'Apr 30',
    budget: 5000, spent: 3240,
    reach: 284000, clicks: 18400, engagement: 7.2, conversions: 1240,
    progress: 65, color: '#C9A84C',
  },
  {
    id: '2', name: 'Q2 Lead Generation', status: 'active',
    type: 'Lead Generation', goal: 'Get 2,000 qualified leads',
    platforms: [
      { id: 'linkedin', color: '#0A66C2', initial: 'IN' },
      { id: 'twitter', color: '#1DA1F2', initial: 'X' },
    ],
    startDate: 'Apr 10', endDate: 'May 10',
    budget: 3000, spent: 980,
    reach: 92000, clicks: 7800, engagement: 4.8, conversions: 420,
    progress: 33, color: '#E8C96A',
  },
  {
    id: '3', name: 'Creator Collab Series', status: 'paused',
    type: 'Engagement', goal: 'Drive 100K engagements',
    platforms: [
      { id: 'instagram', color: '#E1306C', initial: 'IG' },
      { id: 'tiktok', color: '#FF0050', initial: 'TT' },
    ],
    startDate: 'Mar 15', endDate: 'Apr 15',
    budget: 2000, spent: 1850,
    reach: 410000, clicks: 31200, engagement: 9.4, conversions: 890,
    progress: 92, color: '#A855F7',
  },
  {
    id: '4', name: 'Brand Awareness Push', status: 'completed',
    type: 'Brand Awareness', goal: 'Reach 1M impressions',
    platforms: [
      { id: 'instagram', color: '#E1306C', initial: 'IG' },
      { id: 'facebook', color: '#1877F2', initial: 'FB' },
      { id: 'twitter', color: '#1DA1F2', initial: 'X' },
    ],
    startDate: 'Mar 1', endDate: 'Mar 31',
    budget: 4000, spent: 3980,
    reach: 1240000, clicks: 84200, engagement: 6.8, conversions: 3200,
    progress: 100, color: '#FF6B35',
  },
  {
    id: '5', name: 'Product Demo Campaign', status: 'draft',
    type: 'Sales', goal: 'Drive 500 trial signups',
    platforms: [
      { id: 'linkedin', color: '#0A66C2', initial: 'IN' },
      { id: 'twitter', color: '#1DA1F2', initial: 'X' },
      { id: 'youtube', color: '#FF0000', initial: 'YT' },
    ],
    startDate: 'May 1', endDate: 'May 31',
    budget: 6000, spent: 0,
    reach: 0, clicks: 0, engagement: 0, conversions: 0,
    progress: 0, color: '#F59E0B',
  },
  {
    id: '6', name: 'Influencer Mega Launch', status: 'scheduled',
    type: 'Brand Awareness', goal: 'Reach 2M people',
    platforms: [
      { id: 'instagram', color: '#E1306C', initial: 'IG' },
      { id: 'tiktok', color: '#FF0050', initial: 'TT' },
      { id: 'youtube', color: '#FF0000', initial: 'YT' },
    ],
    startDate: 'May 15', endDate: 'Jun 15',
    budget: 12000, spent: 0,
    reach: 0, clicks: 0, engagement: 0, conversions: 0,
    progress: 0, color: '#EC4899',
  },
];

const STATUS_FILTERS = ['All', 'Active', 'Paused', 'Scheduled', 'Draft', 'Completed'];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = campaigns.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const handleCreate = (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
  };

  const handleDelete = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleToggle = (id: string) => {
    setCampaigns(prev => prev.map(c =>
      c.id === id
        ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
        : c
    ));
  };

  const handleEdit = (campaign: Campaign) => {
    console.log('Edit campaign:', campaign.id);
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-bold text-white">
            Campaign Manager
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {activeCampaigns} active campaign{activeCampaigns !== 1 ? 's' : ''} running across {campaigns.reduce((acc, c) => acc + c.platforms.length, 0)} platform slots
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[#C9A84C]/20 text-xs text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all">
            <Sparkles className="w-3.5 h-3.5" />
            AI Strategy
          </button>
          <Button size="sm" onClick={() => setShowCreate(true)} className="rounded-xl gap-2">
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <CampaignStats />

      {/* Chart */}
      <CampaignChart />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl glass border border-white/[0.06] flex-1 max-w-xs">
          <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === f
                  ? 'bg-[#C9A84C] text-white shadow-lg shadow-yellow-600/20'
                  : 'glass border border-white/[0.06] text-white/50 hover:text-white'
              }`}>
              {f}
              {f !== 'All' && (
                <span className="ml-1.5 opacity-60">
                  {campaigns.filter(c => c.status === f.toLowerCase()).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/[0.06] text-xs text-white/50 hover:text-white transition-all ml-auto">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Sort
        </button>
      </div>

      {/* Campaign grid */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl border border-white/[0.06] p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mx-auto mb-4">
            <Filter className="w-7 h-7 text-[#C9A84C]" />
          </div>
          <p className="text-white/50 text-sm mb-2">No campaigns found</p>
          <p className="text-white/25 text-xs mb-6">
            {search ? `No campaigns match "${search}"` : `No ${statusFilter.toLowerCase()} campaigns yet`}
          </p>
          <Button size="sm" onClick={() => setShowCreate(true)} className="rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Create your first campaign
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateCampaignModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
