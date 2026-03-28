'use client';

import { X, SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  tiers: string[];
  platforms: string[];
  categories: string[];
  minEngagement: number;
  maxPrice: number;
  minFollowers: number;
  verifiedOnly: boolean;
  minMatch: number;
}

const TIERS = [
  { id: 'nano', label: 'Nano', range: '1K–10K', color: '#00D4AA' },
  { id: 'micro', label: 'Micro', range: '10K–100K', color: '#0066FF' },
  { id: 'macro', label: 'Macro', range: '100K–1M', color: '#A855F7' },
  { id: 'mega', label: 'Mega', range: '1M+', color: '#FF6B35' },
];

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C', initial: 'IG' },
  { id: 'tiktok', label: 'TikTok', color: '#FF0050', initial: 'TT' },
  { id: 'youtube', label: 'YouTube', color: '#FF0000', initial: 'YT' },
  { id: 'twitter', label: 'X / Twitter', color: '#1DA1F2', initial: 'X' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', initial: 'IN' },
];

const CATEGORIES = [
  'Tech & SaaS', 'Fashion & Beauty', 'Fitness & Health', 'Food & Lifestyle',
  'Gaming', 'Finance', 'Travel', 'Education', 'Entertainment', 'Business',
];

interface InfluencerFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function InfluencerFilters({ filters, onChange, onReset }: InfluencerFiltersProps) {
  const update = (key: keyof FilterState, value: any) =>
    onChange({ ...filters, [key]: value });

  const toggleArr = (key: 'tiers' | 'platforms' | 'categories', val: string) => {
    const arr = filters[key] as string[];
    update(key, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const activeCount = filters.tiers.length + filters.platforms.length +
    filters.categories.length + (filters.verifiedOnly ? 1 : 0) +
    (filters.minEngagement > 0 ? 1 : 0) + (filters.maxPrice < 10000 ? 1 : 0);

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-white/50" />
          <span className="text-sm font-medium text-white">Filters</span>
          {activeCount > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#0066FF] text-white font-medium">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1">
            <X className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div className="p-4 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Verified only */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Verified only</span>
          <button onClick={() => update('verifiedOnly', !filters.verifiedOnly)}
            className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0 ${filters.verifiedOnly ? 'bg-[#0066FF]' : 'bg-white/10'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${filters.verifiedOnly ? 'left-5' : 'left-1'}`} />
          </button>
        </div>

        {/* Tiers */}
        <div>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2.5">Influencer tier</p>
          <div className="space-y-1.5">
            {TIERS.map(t => (
              <button key={t.id} onClick={() => toggleArr('tiers', t.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all border ${
                  filters.tiers.includes(t.id)
                    ? 'border-transparent'
                    : 'border-white/[0.06] hover:border-white/15'
                }`}
                style={filters.tiers.includes(t.id) ? { background: `${t.color}15`, borderColor: `${t.color}30` } : {}}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                  <span style={filters.tiers.includes(t.id) ? { color: t.color } : { color: 'rgba(255,255,255,0.6)' }}>
                    {t.label}
                  </span>
                </div>
                <span className="text-white/30">{t.range}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2.5">Platform</p>
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => toggleArr('platforms', p.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs border transition-all"
                style={filters.platforms.includes(p.id)
                  ? { background: `${p.color}18`, borderColor: `${p.color}35`, color: p.color }
                  : { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                <div className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold text-white"
                  style={{ background: filters.platforms.includes(p.id) ? p.color : 'rgba(255,255,255,0.1)' }}>
                  {p.initial}
                </div>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2.5">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => toggleArr('categories', c)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                  filters.categories.includes(c)
                    ? 'border-[#0066FF]/40 bg-[#0066FF]/15 text-[#0066FF]'
                    : 'border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Min engagement */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">Min. engagement</p>
            <span className="text-xs text-[#0066FF] font-medium">{filters.minEngagement}%</span>
          </div>
          <input type="range" min={0} max={15} step={0.5} value={filters.minEngagement}
            onChange={e => update('minEngagement', Number(e.target.value))}
            className="w-full accent-[#0066FF]" />
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>0%</span><span>15%</span>
          </div>
        </div>

        {/* Max price */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">Max price / post</p>
            <span className="text-xs text-[#0066FF] font-medium">
              {filters.maxPrice >= 10000 ? 'Any' : `$${filters.maxPrice.toLocaleString()}`}
            </span>
          </div>
          <input type="range" min={100} max={10000} step={100} value={filters.maxPrice}
            onChange={e => update('maxPrice', Number(e.target.value))}
            className="w-full accent-[#0066FF]" />
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>$100</span><span>Any</span>
          </div>
        </div>

        {/* Audience match */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">Min. audience match</p>
            <span className="text-xs text-[#0066FF] font-medium">{filters.minMatch}%</span>
          </div>
          <input type="range" min={0} max={100} step={5} value={filters.minMatch}
            onChange={e => update('minMatch', Number(e.target.value))}
            className="w-full accent-[#0066FF]" />
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>0%</span><span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
