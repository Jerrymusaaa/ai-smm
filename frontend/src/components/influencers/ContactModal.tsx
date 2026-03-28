'use client';

import { useState } from 'react';
import { X, Sparkles, Send, DollarSign, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Influencer } from './InfluencerCard';

const COLLAB_TYPES = [
  { id: 'sponsored', label: 'Sponsored post', icon: '📢' },
  { id: 'review', label: 'Product review', icon: '⭐' },
  { id: 'ambassador', label: 'Brand ambassador', icon: '🤝' },
  { id: 'giveaway', label: 'Giveaway collab', icon: '🎁' },
  { id: 'takeover', label: 'Account takeover', icon: '🎥' },
  { id: 'affiliate', label: 'Affiliate partner', icon: '💰' },
];

interface ContactModalProps {
  influencer: Influencer;
  onClose: () => void;
}

export function ContactModal({ influencer, onClose }: ContactModalProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [aiWriting, setAiWriting] = useState(false);
  const [form, setForm] = useState({
    collabType: 'sponsored',
    budget: '',
    startDate: '',
    message: '',
    productDesc: '',
    platforms: [] as string[],
  });

  const update = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const aiWrite = async () => {
    setAiWriting(true);
    await new Promise(r => setTimeout(r, 1500));
    update('message',
      `Hi ${influencer.name}! 👋\n\nI'm reaching out because your content in the ${influencer.category} space aligns perfectly with our brand values. We've been following your work and are genuinely impressed by your ${influencer.engagementRate}% engagement rate and authentic connection with your audience.\n\nWe'd love to explore a ${COLLAB_TYPES.find(c => c.id === form.collabType)?.label.toLowerCase()} collaboration. Our product ${form.productDesc || '[product description]'} would be a great fit for your audience.\n\nWould you be open to a quick chat to discuss the details?\n\nLooking forward to creating something amazing together! 🚀`
    );
    setAiWriting(false);
  };

  const handleSend = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
        <div className="w-full max-w-md rounded-2xl border border-white/10 p-8 text-center shadow-2xl"
          style={{ background: '#0D1525' }}>
          <div className="w-16 h-16 rounded-full bg-[#00D4AA]/20 border border-[#00D4AA]/30 flex items-center justify-center mx-auto mb-5">
            <Send className="w-8 h-8 text-[#00D4AA]" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold text-white mb-2">
            Proposal sent!
          </h3>
          <p className="text-white/50 text-sm mb-6">
            Your collaboration proposal has been sent to <span className="text-white font-medium">{influencer.name}</span>.
            You'll receive a notification when they respond.
          </p>
          <Button size="md" onClick={onClose} className="rounded-xl w-full">Back to marketplace</Button>
        </div>
      </div>
    );
  }

  const STEPS = ['Collaboration type', 'Proposal details'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: '#0D1525' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'rgba(0,102,255,0.15)', border: '1px solid rgba(0,102,255,0.25)' }}>
              {influencer.avatar}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
                Contact {influencer.name}
              </h2>
              <p className="text-xs text-white/40">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex h-0.5">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 transition-all"
              style={{ background: i <= step ? '#0066FF' : 'rgba(255,255,255,0.06)' }} />
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {step === 0 && (
            <>
              <div>
                <label className="text-sm font-medium text-white/70 block mb-3">
                  What type of collaboration?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COLLAB_TYPES.map(type => (
                    <button key={type.id}
                      onClick={() => update('collabType', type.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                        form.collabType === type.id
                          ? 'border-[#0066FF]/50 bg-[#0066FF]/10'
                          : 'border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}>
                      <span className="text-xl">{type.icon}</span>
                      <span className={`text-xs font-medium ${form.collabType === type.id ? 'text-[#0066FF]' : 'text-white/70'}`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">
                  <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Your budget</div>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                  <input type="number" placeholder={influencer.pricePerPost.replace('$', '').replace(',', '')}
                    value={form.budget} onChange={e => update('budget', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 transition-all" />
                </div>
                <p className="text-xs text-white/30 mt-1.5">
                  {influencer.name} typically charges {influencer.pricePerPost} per post
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Desired start date</div>
                </label>
                <input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#0066FF]/40 transition-all [color-scheme:dark]" />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Brief product description
                  </div>
                </label>
                <input type="text" placeholder="What product or service are you promoting?"
                  value={form.productDesc} onChange={e => update('productDesc', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 transition-all" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white/70">Outreach message</label>
                  <button onClick={aiWrite} disabled={aiWriting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0066FF]/15 text-[#0066FF] border border-[#0066FF]/25 hover:bg-[#0066FF]/25 transition-all disabled:opacity-40">
                    {aiWriting
                      ? <><Sparkles className="w-3.5 h-3.5 animate-pulse" /> Writing...</>
                      : <><Sparkles className="w-3.5 h-3.5" /> AI write</>}
                  </button>
                </div>
                <textarea
                  placeholder={`Write a personalized message to ${influencer.name}...`}
                  value={form.message} onChange={e => update('message', e.target.value)}
                  rows={8}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 transition-all resize-none leading-relaxed"
                />
                <p className="text-[11px] text-white/25 mt-1.5 text-right">{form.message.length} chars</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] flex-shrink-0">
          <button onClick={step === 0 ? onClose : () => setStep(0)}
            className="text-sm text-white/40 hover:text-white transition-colors">
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          <Button size="md" loading={loading}
            onClick={step === 0 ? () => setStep(1) : handleSend}
            className="rounded-xl min-w-[130px] gap-2">
            {!loading && (step === 0
              ? 'Continue →'
              : <><Send className="w-4 h-4" /> Send proposal</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
