'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/hooks/useTheme';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: the persisted store only differs from the
  // default after mount.
  useEffect(() => setMounted(true), []);

  const options = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Monitor },
  ] as const;

  if (compact) {
    const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
    return (
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
        title={`Theme: ${mounted ? theme : 'dark'} (click to change)`}
        className="p-2 rounded-xl border transition-all"
        style={{ borderColor: 'rgba(201,168,76,0.25)', background: 'rgba(201,168,76,0.08)', color: '#E8C96A' }}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div
      className="flex items-center gap-0.5 p-1 rounded-xl border"
      style={{ borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.06)' }}
      role="radiogroup"
      aria-label="Theme"
    >
      {options.map(({ key, label, icon: Icon }) => {
        const active = mounted && theme === key;
        return (
          <button
            key={key}
            onClick={() => setTheme(key)}
            role="radio"
            aria-checked={active}
            title={`${label} theme`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={active
              ? { background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0A0A0A' }
              : { color: 'rgba(255,255,255,0.5)' }}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
