'use client';

import { cn } from '@/lib/utils';
import {
  User, Bell, Shield, Palette, Globe, Key, Users,
  Plug, Smartphone, Trash2
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'workspace', label: 'Workspace', icon: Globe },
  { id: 'team', label: 'Team & Access', icon: Users },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'devices', label: 'Devices', icon: Smartphone },
  { id: 'danger', label: 'Danger zone', icon: Trash2, danger: true },
];

interface SettingsNavProps {
  active: string;
  onChange: (id: string) => void;
}

export function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <nav className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">Settings</p>
      </div>
      <div className="p-2">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              active === item.id
                ? item.danger
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-[#0066FF]/15 text-white border border-[#0066FF]/20'
                : item.danger
                ? 'text-red-400/60 hover:bg-red-500/10 hover:text-red-400'
                : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
            )}
          >
            <item.icon className={cn('w-4 h-4 flex-shrink-0',
              active === item.id && !item.danger ? 'text-[#0066FF]' : ''
            )} />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
