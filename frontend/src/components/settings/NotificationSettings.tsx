'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const NOTIFICATION_GROUPS = [
  {
    label: 'Posts & scheduling',
    items: [
      { id: 'post_published', label: 'Post published successfully', email: true, push: true, sms: false },
      { id: 'post_failed', label: 'Post failed to publish', email: true, push: true, sms: true },
      { id: 'post_scheduled', label: 'Post scheduled', email: false, push: true, sms: false },
      { id: 'schedule_reminder', label: 'Upcoming post reminder (1hr)', email: false, push: true, sms: false },
    ],
  },
  {
    label: 'Campaigns',
    items: [
      { id: 'campaign_started', label: 'Campaign launched', email: true, push: true, sms: false },
      { id: 'campaign_ended', label: 'Campaign completed', email: true, push: true, sms: false },
      { id: 'campaign_milestone', label: 'Campaign milestone reached', email: true, push: true, sms: false },
      { id: 'budget_alert', label: 'Budget 80% used', email: true, push: true, sms: true },
    ],
  },
  {
    label: 'Analytics & insights',
    items: [
      { id: 'weekly_report', label: 'Weekly performance report', email: true, push: false, sms: false },
      { id: 'viral_post', label: 'Post going viral alert', email: true, push: true, sms: false },
      { id: 'follower_milestone', label: 'Follower milestone reached', email: true, push: true, sms: false },
      { id: 'engagement_drop', label: 'Engagement drop detected', email: true, push: true, sms: false },
    ],
  },
  {
    label: 'Billing',
    items: [
      { id: 'payment_success', label: 'Payment successful', email: true, push: false, sms: false },
      { id: 'payment_failed', label: 'Payment failed', email: true, push: true, sms: true },
      { id: 'plan_renewal', label: 'Plan renewal reminder', email: true, push: true, sms: false },
    ],
  },
];

type NotifState = Record<string, { email: boolean; push: boolean; sms: boolean }>;

export function NotificationSettings() {
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState<NotifState>(
    Object.fromEntries(
      NOTIFICATION_GROUPS.flatMap(g => g.items).map(item => [
        item.id, { email: item.email, push: item.push, sms: item.sms }
      ])
    )
  );

  const toggle = (id: string, channel: 'email' | 'push' | 'sms') =>
    setNotifs(prev => ({ ...prev, [id]: { ...prev[id], [channel]: !prev[id][channel] } }));

  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button onClick={onClick}
      className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0 ${active ? 'bg-[#0066FF]' : 'bg-white/10'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${active ? 'left-4' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Channel headers */}
      <div className="glass rounded-2xl border border-white/[0.06] p-5">
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white mb-4">
          Notification channels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Email notifications', desc: 'jerry@example.com', active: true, color: '#0066FF' },
            { label: 'Push notifications', desc: 'Browser & mobile app', active: true, color: '#00D4AA' },
            { label: 'SMS notifications', desc: '+1 (555) 000-0000', active: false, color: '#A855F7' },
          ].map(channel => (
            <div key={channel.label}
              className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div>
                <p className="text-sm font-medium text-white/80">{channel.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{channel.desc}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${channel.active ? 'bg-[#00D4AA]' : 'bg-white/20'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Notification preferences */}
      {NOTIFICATION_GROUPS.map(group => (
        <div key={group.label} className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">{group.label}</h3>
            <div className="hidden sm:flex items-center gap-8 text-xs text-white/30 mr-1">
              <span>Email</span>
              <span>Push</span>
              <span>SMS</span>
            </div>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {group.items.map(item => (
              <div key={item.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <p className="text-sm text-white/60">{item.label}</p>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <Toggle active={notifs[item.id]?.email} onClick={() => toggle(item.id, 'email')} />
                  <Toggle active={notifs[item.id]?.push} onClick={() => toggle(item.id, 'push')} />
                  <Toggle active={notifs[item.id]?.sms} onClick={() => toggle(item.id, 'sms')} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button size="md" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
          className="rounded-xl gap-2 min-w-[140px]">
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save preferences'}
        </Button>
      </div>
    </div>
  );
}
