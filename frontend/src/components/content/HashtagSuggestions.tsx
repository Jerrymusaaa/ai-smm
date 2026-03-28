'use client';

import { useState } from 'react';
import { TrendingUp, Plus, X } from 'lucide-react';

interface HashtagGroup {
  label: string;
  color: string;
  tags: { tag: string; volume: string; trending: boolean }[];
}

interface HashtagSuggestionsProps {
  selected: string[];
  onChange: (tags: string[]) => void;
  groups: HashtagGroup[];
}

export function HashtagSuggestions({ selected, onChange, groups }: HashtagSuggestionsProps) {
  const [customInput, setCustomInput] = useState('');

  const toggle = (tag: string) => {
    onChange(selected.includes(tag)
      ? selected.filter(t => t !== tag)
      : [...selected, tag]
    );
  };

  const addCustom = () => {
    const tag = customInput.startsWith('#') ? customInput : `#${customInput}`;
    if (tag.length > 1 && !selected.includes(tag)) {
      onChange([...selected, tag]);
      setCustomInput('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-white/70">
          Hashtags <span className="text-white/30">({selected.length} selected)</span>
        </label>
        <button onClick={() => onChange([])} className="text-xs text-white/30 hover:text-white/60 transition-colors">
          Clear all
        </button>
      </div>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          {selected.map(tag => (
            <span key={tag}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#0066FF]/15 border border-[#0066FF]/25 text-[#0066FF]">
              {tag}
              <button onClick={() => toggle(tag)} className="ml-0.5 hover:text-white transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggested groups */}
      <div className="space-y-3">
        {groups.map(group => (
          <div key={group.label}>
            <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider mb-2">{group.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.tags.map(({ tag, volume, trending }) => {
                const active = selected.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggle(tag)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition-all border ${
                      active
                        ? 'border-[#0066FF]/40 bg-[#0066FF]/15 text-[#0066FF]'
                        : 'border-white/[0.08] bg-transparent text-white/50 hover:text-white/80 hover:border-white/20'
                    }`}
                  >
                    {trending && <TrendingUp className="w-3 h-3 text-[#FF6B35]" />}
                    {tag}
                    <span className="text-[10px] opacity-60">{volume}</span>
                    {active
                      ? <X className="w-3 h-3 ml-0.5" />
                      : <Plus className="w-3 h-3 ml-0.5 opacity-50" />
                    }
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom hashtag input */}
      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1 flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-[#0066FF]/40 transition-colors">
          <span className="text-white/30 text-sm">#</span>
          <input
            type="text"
            placeholder="Add custom hashtag..."
            value={customInput.replace('#', '')}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
          />
        </div>
        <button
          onClick={addCustom}
          className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-xs text-white/60 hover:text-white hover:bg-white/[0.1] transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
}
