'use client';

import { useState } from 'react';
import { X, Sparkles, Target, DollarSign, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CAMPAIGN_TYPES = [
  { id: 'awareness', label: 'Brand Awareness', icon: '📢', desc: 'Maximize reach and visibility' },
  { id: 'engagement', label: 'Engagement', icon: '💬', desc: 'Drive likes, comments & shares' },
  { id: 'traffic', label: 'Website Traffic', icon: '🔗', desc: 'Send users to your website' },
  { id: 'leads', label: 'Lead Generation', icon: '🎯', desc: 'Capture potential customers' },
  { id: 'sales', label: 'Sales & Conversions', icon: '💰', desc: 'Drive purchases and signups' },
  { id: 'retention', label: 'Retention', icon: '🔄', desc: 'Re-engage existing audience' },
];

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C', initial: 'IG' },
  { id: 'tiktok', label: 'TikTok', color: '#FF0050', initial: 'TT' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', initial: 'IN' },
  { id: 'twitter', label: 'X / Twitter', color: '#1DA1F2', initial: 'X' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', initial: 'FB' },
  { id: 'youtube', label: 'YouTube', color: '#FF0000', initial: 'YT' },
];

interface CreateCampaignModalProps {
  onClose: () => void;
  onCreate: (campaign: any) => void;
}

export function CreateCampaignModal({ onClose, onCreate }: CreateCampaignModalProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: '',
    platforms: [] as string[],
    goal: '',
    budget: '',
    startDate: '',
    endDate: '',
    description: '',
    aiAssist: true,
  });

  const update = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const togglePlatform = (id: string) =>
    update('platforms', form.platforms.includes(id)
      ? form.platforms.filter(p => p !== id)
      : [...form.platforms, id]);

  const STEPS = ['Campaign type', 'Targeting', 'Budget & Schedule'];

  const handleCreate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const selectedType = CAMPAIGN_TYPES.find(t => t.id === form.type);
    const selectedPlatforms = PLATFORMS.filter(p => form.platforms.includes(p.id));
    onCreate({
      id: Math.random().toString(36).slice(2),
      name: form.name || `${selectedType?.label} Campaign`,
      status: 'scheduled',
      type: selectedType?.label || 'Custom',
      platforms: selectedPlatforms,
      startDate: form.startDate || 'Apr 20',
      endDate: form.endDate || 'May 20',
      budget: Number(form.budget) || 1000,
      spent: 0,
      reach: 0,
      clicks: 0,
      engagement: 0,
      conversions: 0,
      goal: form.goal || form.type,
      progress: 0,
      color: '#C9A84C',
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background: '#0D0D0D' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-lg font-bold text-white">
              New Campaign
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex h-1">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 transition-all"
              style={{ background: i <= step ? '#C9A84C' : 'rgba(255,255,255,0.06)' }} />
          ))}
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">

          {/* Step 0: Type */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">Campaign name</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Product Launch"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#C9A84C]/40 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/70 block mb-3">Campaign objective</label>
                <div className="grid grid-cols-2 gap-2">
                  {CAMPAIGN_TYPES.map(type => (
                    <button key={type.id}
                      onClick={() => update('type', type.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                        form.type === type.id
                          ? 'border-[#C9A84C]/50 bg-[#C9A84C]/10'
                          : 'border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}>
                      <span className="text-xl">{type.icon}</span>
                      <div>
                        <div className={`text-xs font-medium ${form.type === type.id ? 'text-[#C9A84C]' : 'text-white/70'}`}>
                          {type.label}
                        </div>
                        <div className="text-[10px] text-white/30 mt-0.5">{type.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI assist toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#C9A84C]/08 border border-[#C9A84C]/20">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                  <div>
                    <div className="text-sm font-medium text-white">AI campaign assistant</div>
                    <div className="text-xs text-white/40">Let AI suggest strategy and content</div>
                  </div>
                </div>
                <button
                  onClick={() => update('aiAssist', !form.aiAssist)}
                  className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0 ${form.aiAssist ? 'bg-[#C9A84C]' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.aiAssist ? 'left-5' : 'left-1'}`} />
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Targeting */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-white/70 block mb-3">
                  Target platforms
                  <span className="text-white/30 ml-2 font-normal">({form.platforms.length} selected)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map(p => {
                    const active = form.platforms.includes(p.id);
                    return (
                      <button key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                          active
                            ? 'border-transparent text-white'
                            : 'border-white/[0.06] text-white/40 hover:border-white/20'
                        }`}
                        style={active ? {
                          background: `${p.color}18`,
                          borderColor: `${p.color}35`,
                        } : {}}>
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                          style={{ background: active ? `${p.color}30` : 'rgba(255,255,255,0.08)' }}>
                          {p.initial}
                        </div>
                        <span className="text-xs font-medium"
                          style={active ? { color: p.color } : {}}>
                          {p.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" /> Campaign goal / KPI
                  </div>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Get 500 new email subscribers"
                  value={form.goal}
                  onChange={e => update('goal', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#C9A84C]/40 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">Description / brief</label>
                <textarea
                  placeholder="Describe your campaign, target audience, key message..."
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  rows={3}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#C9A84C]/40 transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Budget & Schedule */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Total budget (USD)
                  </div>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="1000"
                    value={form.budget}
                    onChange={e => update('budget', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#C9A84C]/40 transition-all"
                  />
                </div>
                {/* Quick budget chips */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['500', '1000', '2500', '5000', '10000'].map(b => (
                    <button key={b}
                      onClick={() => update('budget', b)}
                      className={`px-3 py-1 rounded-full text-xs border transition-all ${
                        form.budget === b
                          ? 'border-[#C9A84C]/40 bg-[#C9A84C]/15 text-[#C9A84C]'
                          : 'border-white/[0.08] text-white/40 hover:border-white/20'
                      }`}>
                      ${Number(b).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white/70 block mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Start date
                    </div>
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => update('startDate', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/40 transition-all [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70 block mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> End date
                    </div>
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => update('endDate', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/40 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* AI summary */}
              {form.aiAssist && (
                <div className="rounded-xl border border-[#C9A84C]/20 p-4"
                  style={{ background: 'rgba(0,102,255,0.06)' }}>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-white/70 mb-1">AI campaign preview</p>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Based on your settings, AI will generate{' '}
                        <span className="text-white/60">{form.platforms.length * 3} posts</span>,
                        suggest optimal posting times, and monitor performance daily.
                        Estimated reach:{' '}
                        <span className="text-white/60">
                          {form.budget ? `${Math.floor(Number(form.budget) * 2.4).toLocaleString()}–${Math.floor(Number(form.budget) * 4.8).toLocaleString()}` : '50K–200K'}
                        </span> people.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
          <button
            onClick={step === 0 ? onClose : () => setStep(s => s - 1)}
            className="text-sm text-white/40 hover:text-white transition-colors">
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          <Button
            size="md"
            loading={loading}
            onClick={step < STEPS.length - 1 ? () => setStep(s => s + 1) : handleCreate}
            className="rounded-xl gap-2 min-w-[120px]">
            {!loading && (step < STEPS.length - 1 ? 'Continue →' : '🚀 Launch campaign')}
          </Button>
        </div>
      </div>
    </div>
  );
}
