'use client';

import { useState } from 'react';
import { Plus, Copy, Trash2, Eye, EyeOff, Check, Key } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const INITIAL_KEYS = [
  { id: '1', name: 'Production API Key', key: 'sai_prod_xK9mN2pQ8rT5vW3yZ1aB4cD6eF0gH', created: 'Jan 15, 2025', lastUsed: '2 hours ago', permissions: ['read', 'write'] },
  { id: '2', name: 'Development Key', key: 'sai_dev_aB3cD5eF7gH9iJ1kL2mN4oP6qR8s', created: 'Feb 1, 2025', lastUsed: 'Yesterday', permissions: ['read'] },
];

export function ApiKeysSettings() {
  const [keys, setKeys] = useState(INITIAL_KEYS);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState(['read']);
  const [newKeyCreated, setNewKeyCreated] = useState<string | null>(null);

  const toggleVisible = (id: string) =>
    setVisibleKeys(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const copy = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteKey = (id: string) => setKeys(prev => prev.filter(k => k.id !== id));

  const createKey = () => {
    if (!newKeyName) return;
    const generated = `sai_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    setNewKeyCreated(generated);
    setKeys(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      name: newKeyName,
      key: generated,
      created: 'Today',
      lastUsed: 'Never',
      permissions: newKeyPermissions,
    }]);
    setNewKeyName('');
    setCreating(false);
  };

  const maskKey = (key: string) => `${key.slice(0, 12)}${'•'.repeat(24)}${key.slice(-4)}`;

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="glass rounded-2xl border border-white/[0.06] p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#A855F7]/15 border border-[#A855F7]/25 flex items-center justify-center flex-shrink-0">
            <Key className="w-5 h-5 text-[#A855F7]" />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
              API Keys
            </h3>
            <p className="text-xs text-white/40 mt-1 leading-relaxed max-w-lg">
              Use API keys to authenticate requests to the Yoyzie AI API. Keep your keys secure — treat them like passwords and never expose them in client-side code.
            </p>
          </div>
        </div>
      </div>

      {/* New key created notice */}
      {newKeyCreated && (
        <div className="rounded-2xl border border-[#E8C96A]/30 p-4 bg-[#E8C96A]/08">
          <p className="text-sm font-medium text-[#E8C96A] mb-2">✓ New API key created — save it now!</p>
          <p className="text-xs text-white/50 mb-3">This is the only time you'll see the full key. Store it somewhere safe.</p>
          <div className="flex items-center gap-2 bg-black/30 rounded-xl px-4 py-3">
            <code className="flex-1 text-xs text-white/80 font-mono break-all">{newKeyCreated}</code>
            <button onClick={() => copy('new', newKeyCreated)}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-all text-white/50 hover:text-white">
              {copiedId === 'new' ? <Check className="w-4 h-4 text-[#E8C96A]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <button onClick={() => setNewKeyCreated(null)} className="text-xs text-white/30 hover:text-white mt-2 transition-colors">
            I've saved my key — dismiss
          </button>
        </div>
      )}

      {/* Existing keys */}
      <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">Your API keys</h3>
          <button onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all">
            <Plus className="w-3.5 h-3.5" /> Create new key
          </button>
        </div>

        {/* Create form */}
        {creating && (
          <div className="p-5 border-b border-white/[0.06] bg-white/[0.02] space-y-4">
            <div>
              <label className="text-xs font-medium text-white/50 block mb-1.5">Key name</label>
              <input type="text" placeholder="e.g. My App Production"
                value={newKeyName} onChange={e => setNewKeyName(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#C9A84C]/40 transition-all" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 block mb-2">Permissions</label>
              <div className="flex gap-2">
                {['read', 'write', 'delete'].map(perm => (
                  <button key={perm} onClick={() =>
                    setNewKeyPermissions(prev =>
                      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
                    )}
                    className={`px-3 py-1.5 rounded-xl text-xs border capitalize transition-all ${
                      newKeyPermissions.includes(perm)
                        ? 'border-[#C9A84C]/40 bg-[#C9A84C]/15 text-[#C9A84C]'
                        : 'border-white/[0.08] text-white/40 hover:border-white/20'
                    }`}>
                    {perm}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCreating(false)}
                className="px-4 py-2 rounded-xl text-xs border border-white/10 text-white/50 hover:text-white transition-all">
                Cancel
              </button>
              <Button size="sm" onClick={createKey} className="rounded-xl gap-1.5">
                <Key className="w-3.5 h-3.5" /> Generate key
              </Button>
            </div>
          </div>
        )}

        <div className="divide-y divide-white/[0.04]">
          {keys.map(k => (
            <div key={k.id} className="p-5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-white">{k.name}</p>
                  <p className="text-xs text-white/35 mt-0.5">Created {k.created} · Last used {k.lastUsed}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {k.permissions.map(p => (
                    <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 capitalize">{p}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 py-2.5">
                <code className="flex-1 text-xs text-white/60 font-mono truncate">
                  {visibleKeys.has(k.id) ? k.key : maskKey(k.key)}
                </code>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleVisible(k.id)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-all text-white/30 hover:text-white/60">
                    {visibleKeys.has(k.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => copy(k.id, k.key)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-all text-white/30 hover:text-white/60">
                    {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-[#E8C96A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => deleteKey(k.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-all text-white/20 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
