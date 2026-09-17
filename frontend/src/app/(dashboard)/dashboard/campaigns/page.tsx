'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Filter, Sparkles, SlidersHorizontal, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CampaignCard, Campaign } from '@/components/campaigns/CampaignCard';
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal';
import api from '@/lib/api';

const STATUS_FILTERS = ['All', 'Active', 'Paused', 'Scheduled', 'Draft', 'Completed'];

const PLATFORM_META: Record<string, { color: string; initial: string }> = {
  INSTAGRAM: { color: '#E1306C', initial: 'IG' },
  TIKTOK: { color: '#FF0050', initial: 'TT' },
  LINKEDIN: { color: '#0A66C2', initial: 'IN' },
  TWITTER: { color: '#1DA1F2', initial: 'X' },
  FACEBOOK: { color: '#1877F2', initial: 'FB' },
  YOUTUBE: { color: '#FF0000', initial: 'YT' },
  PINTEREST: { color: '#E60023', initial: 'PI' },
  THREADS: { color: '#6364FF', initial: 'TH' },
};

const CARD_COLORS = ['#C9A84C', '#E8C96A', '#A855F7', '#FF6B35', '#F59E0B', '#EC4899', '#00D4AA'];

/** Map a DB campaign row to the shape CampaignCard expects. */
function toCardCampaign(db: any): Campaign {
  return {
    id: db.id,
    name: db.name,
    status: (db.status || 'draft').toLowerCase() as Campaign['status'],
    type: db.type || 'General',
    platforms: (db.platforms || []).map((p: string) => ({
      id: p.toLowerCase(),
      ...(PLATFORM_META[p.toUpperCase()] || { color: '#C9A84C', initial: p.slice(0, 2).toUpperCase() }),
    })),
    startDate: db.startDate ? new Date(db.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—',
    endDate: db.endDate ? new Date(db.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—',
    budget: db.budget ?? 0,
    spent: db.spent ?? 0,
    reach: db.reach ?? 0,
    clicks: db.clicks ?? 0,
    engagement: db.engagement ?? 0,
    conversions: db.conversions ?? 0,
    goal: db.goal || '',
    progress: db.progress ?? 0,
    color: CARD_COLORS[Math.abs(db.name?.length || 0) % CARD_COLORS.length],
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.instance.get('/api/campaigns');
      const rows = res.data?.data ?? [];
      setCampaigns(rows.map(toCardCampaign));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = campaigns.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const handleCreate = async (campaign: Campaign) => {
    try {
      await api.instance.post('/api/campaigns', {
        name: campaign.name,
        type: campaign.type,
        goal: campaign.goal,
        status: campaign.status?.toUpperCase() || 'DRAFT',
        platforms: campaign.platforms.map(p => p.id.toUpperCase()),
        budget: Number(campaign.budget) || 0,
        startDate: campaign.startDate ? new Date(campaign.startDate) : undefined,
        endDate: campaign.endDate ? new Date(campaign.endDate) : undefined,
      });
      setShowCreate(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create campaign');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.instance.delete(`/api/campaigns/${id}`);
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete campaign');
    }
  };

  const handleToggle = async (id: string) => {
    const current = campaigns.find(c => c.id === id);
    if (!current) return;
    const next = current.status === 'active' ? 'PAUSED' : 'ACTIVE';
    try {
      await api.instance.patch(`/api/campaigns/${id}/status`, { status: next });
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: next.toLowerCase() as Campaign['status'] } : c));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update campaign');
    }
  };

  const activeCount = campaigns.filter(c => c.status === 'active').length;
  const totals = campaigns.reduce(
    (acc, c) => ({
      budget: acc.budget + c.budget,
      spent: acc.spent + c.spent,
      reach: acc.reach + c.reach,
    }),
    { budget: 0, spent: 0, reach: 0 }
  );

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
            {campaigns.length === 0
              ? 'Your real campaigns will appear here once you create them'
              : `${activeCount} active · ${campaigns.length} total · ${totals.reach.toLocaleString()} total reach`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => setShowCreate(true)} className="rounded-xl gap-2">
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
          {error}
        </div>
      )}

      {/* Real totals (hidden until campaigns exist — no fake numbers) */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total budget', value: `KES ${totals.budget.toLocaleString()}` },
            { label: 'Total spent', value: `KES ${totals.spent.toLocaleString()}` },
            { label: 'Total reach', value: totals.reach.toLocaleString() },
            { label: 'Active campaigns', value: String(activeCount) },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl border border-white/[0.06] p-5">
              <p className="text-xs text-white/40">{s.label}</p>
              <p className="text-xl font-bold text-white mt-1" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
            </button>
          ))}
        </div>
      </div>

      {/* Campaign grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl border border-white/[0.06] p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-7 h-7 text-[#C9A84C]" />
          </div>
          <p className="text-white/50 text-sm mb-2">
            {campaigns.length === 0 ? 'No campaigns yet' : 'No campaigns match this filter'}
          </p>
          <p className="text-white/25 text-xs mb-6">
            Campaign metrics (reach, clicks, conversions) update automatically as their posts perform.
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
              onEdit={() => {}}
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
