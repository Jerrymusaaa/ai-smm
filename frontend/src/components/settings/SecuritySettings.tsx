'use client';

import { useState } from 'react';
import { Shield, Smartphone, LogOut, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const SESSIONS = [
  { id: '1', device: 'Chrome on Windows', location: 'Nairobi, Kenya', ip: '41.90.xx.xx', time: 'Now', current: true },
  { id: '2', device: 'Safari on iPhone 15', location: 'Nairobi, Kenya', ip: '41.90.xx.xx', time: '2 hours ago', current: false },
  { id: '3', device: 'Firefox on macOS', location: 'London, UK', ip: '82.x.xx.xxx', time: '3 days ago', current: false },
];

export function SecuritySettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);

  const strength = passwords.newPass.length < 4 ? 0
    : passwords.newPass.length < 7 ? 1
    : passwords.newPass.length < 10 ? 2
    : 3;

  const strengthColors = ['#EF4444', '#F59E0B', '#C9A84C', '#E8C96A'];
  const strengthLabels = ['Too short', 'Weak', 'Good', 'Strong'];

  return (
    <div className="space-y-5">
      {/* Password */}
      <div className="glass rounded-2xl border border-white/[0.06] p-6">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-5">
          Change password
        </h3>
        <div className="space-y-4 max-w-md">
          {[
            { label: 'Current password', key: 'current', show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
            { label: 'New password', key: 'newPass', show: showNew, toggle: () => setShowNew(!showNew) },
            { label: 'Confirm new password', key: 'confirm', show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
          ].map(field => (
            <div key={field.key}>
              <label className="text-xs font-medium text-white/50 block mb-1.5">{field.label}</label>
              <div className="relative">
                <input
                  type={field.show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={passwords[field.key as keyof typeof passwords]}
                  onChange={e => setPasswords(p => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder-white/25 outline-none focus:border-[#C9A84C]/40 transition-all"
                />
                <button onClick={field.toggle}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          {passwords.newPass && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[0,1,2,3].map(i => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all"
                    style={{ background: i <= strength - 1 ? strengthColors[strength - 1] : 'rgba(255,255,255,0.08)' }} />
                ))}
              </div>
              <p className="text-xs" style={{ color: strengthColors[strength - 1] || 'rgba(255,255,255,0.3)' }}>
                {passwords.newPass ? strengthLabels[strength - 1] || 'Too short' : ''}
              </p>
            </div>
          )}

          <Button size="md" onClick={() => { setPwSaved(true); setTimeout(() => setPwSaved(false), 3000); }}
            className="rounded-xl gap-2">
            {pwSaved ? <><Check className="w-4 h-4" /> Password updated!</> : 'Update password'}
          </Button>
        </div>
      </div>

      {/* Two-factor auth */}
      <div className="glass rounded-2xl border border-white/[0.06] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#E8C96A]/15 border border-[#E8C96A]/25 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-[#E8C96A]" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
                Two-factor authentication
              </h3>
              <p className="text-xs text-white/40 mt-1 leading-relaxed max-w-sm">
                Add an extra layer of security. Use an authenticator app to generate one-time codes when signing in.
              </p>
              {twoFAEnabled && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-[#E8C96A]">
                  <Shield className="w-3.5 h-3.5" /> 2FA is enabled and protecting your account
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setTwoFAEnabled(!twoFAEnabled)}
            className={`w-12 h-7 rounded-full transition-all relative flex-shrink-0 mt-1 ${twoFAEnabled ? 'bg-[#E8C96A]' : 'bg-white/10'}`}>
            <div className={`absolute top-1.5 w-4 h-4 rounded-full bg-white shadow transition-all ${twoFAEnabled ? 'left-7' : 'left-1.5'}`} />
          </button>
        </div>
      </div>

      {/* Active sessions */}
      <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
              Active sessions
            </h3>
            <p className="text-xs text-white/40 mt-0.5">Devices currently signed into your account</p>
          </div>
          <button className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium">
            Sign out all
          </button>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {SESSIONS.map(session => (
            <div key={session.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${session.current ? 'bg-[#C9A84C]/20 border border-[#C9A84C]/30' : 'bg-white/[0.06] border border-white/10'}`}>
                <Smartphone className={`w-4 h-4 ${session.current ? 'text-[#C9A84C]' : 'text-white/40'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white/80">{session.device}</span>
                  {session.current && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] font-medium">
                      This device
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/40 mt-0.5">
                  {session.location} · {session.ip} · {session.time}
                </p>
              </div>
              {!session.current && (
                <button className="flex items-center gap-1.5 text-xs text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security checklist */}
      <div className="glass rounded-2xl border border-white/[0.06] p-5">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-4">
          Security checklist
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Strong password set', done: true },
            { label: 'Email address verified', done: true },
            { label: 'Two-factor authentication', done: twoFAEnabled },
            { label: 'Recovery codes saved', done: false },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-[#E8C96A]/20 border border-[#E8C96A]/40' : 'bg-white/[0.06] border border-white/15'}`}>
                {item.done
                  ? <Check className="w-3 h-3 text-[#E8C96A]" />
                  : <AlertTriangle className="w-3 h-3 text-white/30" />}
              </div>
              <span className={`text-sm ${item.done ? 'text-white/70' : 'text-white/40'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
