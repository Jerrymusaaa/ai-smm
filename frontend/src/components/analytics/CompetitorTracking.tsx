'use client';

import { useEffect, useState, useCallback } from 'react';
import { Eye, RefreshCw, Trash2, Plus, Loader2, Sparkles, X } from 'lucide-react';
import { api } from '@/lib/api';

const PLATFORMS = [
  { id: 'INSTAGRAM', label: 'Instagram' },
  { id: 'TIKTOK', label: 'TikTok' },
  { id: 'TWITTER', label: 'X / Twitter' },
  { id: 'YOUTUBE', label: 'YouTube' },
  { id: 'LINKEDIN', label: 'LinkedIn' },
];

interface Competitor {
  id: string;
  platform: string;
  handle: string;
  displayName: string | null;
  followers: number;
  postCount: number | null;
  lastSyncedAt: string | null;
  estimated?: boolean;
}

export function CompetitorTracking() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [platform, setPlatform] = useState('INSTAGRAM');
  const [handle, setHandle] = useState('');
  const [adding, setAdding] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [benchmark, setBenchmark] = useState<string>('');
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.instance.get('/api/social/competitors');
      setCompetitors(res.data?.data ?? []);
    } catch {
      // leave empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!handle.trim()) return;
    setAdding(true);
    setError('');
    try {
      await api.instance.post('/api/social/competitors', { platform, handle: handle.trim() });
      setHandle('');
      setShowAdd(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add competitor');
    } finally {
      setAdding(false);
    }
  };

  const sync = async (id: string) => {
    setSyncingId(id);
    try {
      await api.instance.post(`/api/social/competitors/${id}/sync`);
      load();
    } catch {
      setError('Sync failed');
    } finally {
      setSyncingId(null);
    }
  };

  const remove = async (id: string) => {
    try {
      await api.instance.delete(`/api/social/competitors/${id}`);
      setCompetitors(prev => prev.filter(c => c.id !== id));
    } catch {
      setError('Failed to remove');
    }
  };

  const runBenchmark = async () => {
    setBenchmarkLoading(true);
    setError('');
    try {
      const res = await api.instance.post('/api/social/competitors/benchmark');
      setBenchmark(res.data?.data?.summary || '');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Benchmark failed — AI credits may be low');
    } finally {
      setBenchmarkLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl border border-white/[0.06] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#C9A84C]" />
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Competitor Tracking
          </h3>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all"
          style={{ borderColor: 'rgba(201,168,76,0.25)', color: '#E8C96A' }}>
          {showAdd ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          {showAdd ? 'Cancel' : 'Add competitor'}
        </button>
      </div>

      {showAdd && (
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <select value={platform} onChange={e => setPlatform(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm outline-none border"
            style={{ background: '#0D0D0F', color: '#fff', borderColor: 'rgba(201,168,76,0.15)' }}>
            {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <input value={handle} onChange={e => setHandle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="@handle (public profile)"
            className="flex-1 px-3 py-2 rounded-xl text-sm text-white outline-none border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(201,168,76,0.15)' }} />
          <button onClick={add} disabled={adding || !handle.trim()}
            className="px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
            {adding ? 'Adding…' : 'Track'}
          </button>
        </div>
      )}

      {error && <p className="text-xs mb-3" style={{ color: '#EF4444' }}>{error}</p>}

      {loading ? (
        <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-[#C9A84C]" /></div>
      ) : competitors.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-white/60 font-medium mb-1">No competitors tracked yet</p>
          <p className="text-xs text-white/35 max-w-sm mx-auto">
            Add public profiles you compete with. Yoyzie pulls their public follower metrics, and the AI benchmarks your growth against theirs.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {competitors.map(c => (
            <div key={c.id} className="flex items-center gap-3 rounded-xl border px-3.5 py-3"
              style={{ borderColor: 'rgba(201,168,76,0.1)', background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0"
                style={{ background: 'rgba(201,168,76,0.12)', color: '#E8C96A' }}>{c.platform}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">@{c.handle}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {c.followers > 0 ? `${c.followers.toLocaleString()} followers` : 'metrics pending sync'}
                  {c.estimated && ' · estimated'}
                  {c.lastSyncedAt && ` · synced ${new Date(c.lastSyncedAt).toLocaleDateString()}`}
                </p>
              </div>
              <button onClick={() => sync(c.id)} disabled={syncingId === c.id}
                title="Refresh public metrics"
                className="p-1.5 rounded-lg border transition-all disabled:opacity-40"
                style={{ borderColor: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>
                <RefreshCw className={`w-3.5 h-3.5 ${syncingId === c.id ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => remove(c.id)} title="Remove"
                className="p-1.5 rounded-lg border transition-all"
                style={{ borderColor: 'rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.7)' }}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <button onClick={runBenchmark} disabled={benchmarkLoading}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50"
            style={{ borderColor: 'rgba(201,168,76,0.25)', background: 'rgba(201,168,76,0.06)', color: '#E8C96A' }}>
            {benchmarkLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Run AI benchmark against my accounts
          </button>

          {benchmark && (
            <div className="rounded-xl border p-4 mt-2"
              style={{ borderColor: 'rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.04)' }}>
              <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {benchmark}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
