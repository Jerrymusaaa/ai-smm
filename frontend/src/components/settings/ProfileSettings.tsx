'use client';

import { useState } from 'react';
import { Camera, Check, Globe, Link, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ProfileSettings() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: 'Jerry', lastName: 'D.',
    email: 'jerry@example.com', phone: '+1 (555) 000-0000',
    company: 'My Company', role: 'Founder',
    bio: 'Building the future of AI-powered social media management.',
    website: 'https://mycompany.com',
    twitter: '@jerryD', linkedin: 'linkedin.com/in/jerryd',
    timezone: 'America/New_York', language: 'English',
  });

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="glass rounded-2xl border border-white/[0.06] p-6">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-5">
          Profile photo
        </h3>
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#00D4AA] flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
              JD
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <button className="px-4 py-2 rounded-xl text-sm border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all mb-2 block">
              Upload new photo
            </button>
            <p className="text-xs text-white/30">JPG, PNG or GIF · Max 5MB</p>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="glass rounded-2xl border border-white/[0.06] p-6">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-5">
          Personal information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'First name', key: 'firstName', placeholder: 'Jerry' },
            { label: 'Last name', key: 'lastName', placeholder: 'Smith' },
            { label: 'Email address', key: 'email', placeholder: 'jerry@example.com', type: 'email' },
            { label: 'Phone number', key: 'phone', placeholder: '+1 (555) 000-0000', type: 'tel' },
            { label: 'Company', key: 'company', placeholder: 'Acme Inc.' },
            { label: 'Job role', key: 'role', placeholder: 'Marketing Manager' },
          ].map(field => (
            <div key={field.key}>
              <label className="text-xs font-medium text-white/50 block mb-1.5">{field.label}</label>
              <input
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={e => update(field.key, e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 focus:bg-white/[0.07] transition-all"
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-white/50 block mb-1.5">Bio</label>
            <textarea
              placeholder="Tell us about yourself..."
              value={form.bio}
              onChange={e => update('bio', e.target.value)}
              rows={3}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="glass rounded-2xl border border-white/[0.06] p-6">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-5">
          Social links
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Website', key: 'website', icon: <Globe className="w-4 h-4" />, placeholder: 'https://yoursite.com' },
            { label: 'X / Twitter', key: 'twitter', icon: <ExternalLink className="w-4 h-4" />, placeholder: '@username' },
            { label: 'LinkedIn', key: 'linkedin', icon: <Link className="w-4 h-4" />, placeholder: 'linkedin.com/in/username' },
          ].map(field => (
            <div key={field.key}>
              <label className="text-xs font-medium text-white/50 block mb-1.5">{field.label}</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  {field.icon}
                </div>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => update(field.key, e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locale */}
      <div className="glass rounded-2xl border border-white/[0.06] p-6">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-5">
          Locale & language
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-white/50 block mb-1.5">Timezone</label>
            <select value={form.timezone} onChange={e => update('timezone', e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70 outline-none focus:border-[#0066FF]/40 transition-all">
              {['America/New_York','America/Los_Angeles','America/Chicago','Europe/London','Europe/Paris','Asia/Tokyo','Asia/Dubai','Australia/Sydney'].map(tz => (
                <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-white/50 block mb-1.5">Language</label>
            <select value={form.language} onChange={e => update('language', e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70 outline-none focus:border-[#0066FF]/40 transition-all">
              {['English','Spanish','French','German','Portuguese','Japanese','Arabic'].map(l => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="md" onClick={handleSave} className="rounded-xl gap-2 min-w-[140px]">
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
