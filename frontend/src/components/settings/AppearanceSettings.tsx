'use client';

import { useState } from 'react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ACCENT_COLORS = [
  { id: 'blue', label: 'Ocean blue', color: '#0066FF' },
  { id: 'teal', label: 'Teal', color: '#00D4AA' },
  { id: 'purple', label: 'Purple', color: '#A855F7' },
  { id: 'orange', label: 'Sunset', color: '#FF6B35' },
  { id: 'pink', label: 'Rose', color: '#EC4899' },
  { id: 'green', label: 'Emerald', color: '#10B981' },
];

const FONT_SIZES = ['Small', 'Default', 'Large', 'Extra large'];
const SIDEBAR_STYLES = ['Expanded', 'Collapsed', 'Auto'];

export function AppearanceSettings() {
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState('blue');
  const [fontSize, setFontSize] = useState('Default');
  const [sidebarStyle, setSidebarStyle] = useState('Expanded');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-5">
      {/* Theme */}
      <div className="glass rounded-2xl border border-white/[0.06] p-6">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-5">
          Theme
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun, preview: 'bg-white' },
            { id: 'dark', label: 'Dark', icon: Moon, preview: 'bg-[#050A14]' },
            { id: 'system', label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-white to-[#050A14]' },
          ].map(t => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`relative p-4 rounded-2xl border transition-all text-center ${
                theme === t.id ? 'border-[#0066FF]/50 bg-[#0066FF]/08' : 'border-white/[0.06] hover:border-white/20'
              }`}>
              {/* Preview box */}
              <div className={`w-full h-16 rounded-xl mb-3 border border-white/10 ${t.preview} flex items-center justify-center`}>
                <t.icon className={`w-6 h-6 ${t.id === 'light' ? 'text-gray-600' : 'text-white/60'}`} />
              </div>
              <span className={`text-xs font-medium ${theme === t.id ? 'text-[#0066FF]' : 'text-white/60'}`}>
                {t.label}
              </span>
              {theme === t.id && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0066FF] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div className="glass rounded-2xl border border-white/[0.06] p-6">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-5">
          Accent color
        </h3>
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map(c => (
            <button key={c.id} onClick={() => setAccent(c.id)}
              className="flex flex-col items-center gap-2 group">
              <div className={`w-10 h-10 rounded-xl transition-all relative ${accent === c.id ? 'scale-110 ring-2 ring-offset-2 ring-offset-[#0D1525]' : 'hover:scale-105'}`}
                style={{ background: c.color, ...(accent === c.id ? { boxShadow: `0 0 20px ${c.color}60`, ringColor: c.color } : {}) }}>
                {accent === c.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-white/40">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layout preferences */}
      <div className="glass rounded-2xl border border-white/[0.06] p-6">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-5">
          Layout & display
        </h3>
        <div className="space-y-5">
          <div>
            <label className="text-sm text-white/60 block mb-2">Font size</label>
            <div className="flex gap-2 flex-wrap">
              {FONT_SIZES.map(size => (
                <button key={size} onClick={() => setFontSize(size)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                    fontSize === size
                      ? 'border-[#0066FF]/40 bg-[#0066FF]/15 text-[#0066FF]'
                      : 'border-white/[0.08] text-white/40 hover:border-white/20'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60 block mb-2">Sidebar style</label>
            <div className="flex gap-2 flex-wrap">
              {SIDEBAR_STYLES.map(style => (
                <button key={style} onClick={() => setSidebarStyle(style)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                    sidebarStyle === style
                      ? 'border-[#0066FF]/40 bg-[#0066FF]/15 text-[#0066FF]'
                      : 'border-white/[0.08] text-white/40 hover:border-white/20'
                  }`}>
                  {style}
                </button>
              ))}
            </div>
          </div>

          {[
            { label: 'Compact mode', desc: 'Reduce spacing and padding throughout the UI', value: compactMode, toggle: () => setCompactMode(!compactMode) },
            { label: 'Animations', desc: 'Enable UI transitions and micro-animations', value: animations, toggle: () => setAnimations(!animations) },
          ].map(pref => (
            <div key={pref.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">{pref.label}</p>
                <p className="text-xs text-white/35 mt-0.5">{pref.desc}</p>
              </div>
              <button onClick={pref.toggle}
                className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${pref.value ? 'bg-[#0066FF]' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${pref.value ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="md" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
          className="rounded-xl gap-2 min-w-[140px]">
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save preferences'}
        </Button>
      </div>
    </div>
  );
}
