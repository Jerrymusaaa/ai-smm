'use client';

import { useState } from 'react';
import { SettingsNav } from '@/components/settings/SettingsNav';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { ApiKeysSettings } from '@/components/settings/ApiKeysSettings';
import { DangerZone } from '@/components/settings/DangerZone';

const SECTION_TITLES: Record<string, { title: string; desc: string }> = {
  profile: { title: 'Profile', desc: 'Manage your personal information and public profile' },
  notifications: { title: 'Notifications', desc: 'Control how and when you receive notifications' },
  security: { title: 'Security', desc: 'Manage your password, 2FA, and active sessions' },
  appearance: { title: 'Appearance', desc: 'Customize how the app looks and feels' },
  workspace: { title: 'Workspace', desc: 'Configure your workspace settings' },
  team: { title: 'Team & Access', desc: 'Manage team members and permissions' },
  integrations: { title: 'Integrations', desc: 'Connect third-party apps and services' },
  api: { title: 'API Keys', desc: 'Manage API keys for programmatic access' },
  devices: { title: 'Devices', desc: 'Manage trusted devices and sessions' },
  danger: { title: 'Danger zone', desc: 'Irreversible account actions' },
};

function PlaceholderSection({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl border border-white/[0.06] p-12 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center mx-auto mb-4">
        <span className="text-xl">🔧</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-lg font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-white/40 text-sm max-w-xs mx-auto">{desc}</p>
      <p className="text-white/25 text-xs mt-3">Coming soon — will be built during backend integration phase</p>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const section = SECTION_TITLES[activeSection];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'security': return <SecuritySettings />;
      case 'appearance': return <AppearanceSettings />;
      case 'api': return <ApiKeysSettings />;
      case 'danger': return <DangerZone />;
      default: return <PlaceholderSection title={section.title} desc={section.desc} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}
          className="text-2xl sm:text-3xl font-bold text-white">
          Settings
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Manage your account preferences and configurations
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar nav */}
        <div className="w-full lg:w-56 flex-shrink-0">
          <SettingsNav active={activeSection} onChange={setActiveSection} />
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Section header */}
          <div className="mb-5">
            <h2 style={{ fontFamily: 'var(--font-display)' }}
              className="text-xl font-bold text-white">{section.title}</h2>
            <p className="text-sm text-white/40 mt-0.5">{section.desc}</p>
          </div>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
