'use client';

import { useState } from 'react';
import { X, Check, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PLAN_DETAILS: Record<string, { name: string; price: number; color: string; features: string[] }> = {
  business: {
    name: 'Business', price: 119, color: '#E8C96A',
    features: ['All 23 platforms', 'Team collaboration (5 seats)', 'Influencer marketplace', 'Advanced AI agents', 'Custom report builder', 'API access'],
  },
  enterprise: {
    name: 'Enterprise', price: 0, color: '#A855F7',
    features: ['Everything in Business', 'Unlimited team seats', 'White-label option', 'Custom AI training', 'SLA guarantee', 'SAML SSO'],
  },
};

interface UpgradeModalProps {
  planId: string;
  onClose: () => void;
}

export function UpgradeModal({ planId, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const plan = PLAN_DETAILS[planId];
  if (!plan) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
        <div className="w-full max-w-md rounded-2xl border border-white/10 p-8 text-center shadow-2xl"
          style={{ background: '#0D0D0D' }}>
          <div className="w-16 h-16 rounded-full bg-[#E8C96A]/20 border border-[#E8C96A]/30 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-[#E8C96A]" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold text-white mb-2">
            Upgraded to {plan.name}!
          </h3>
          <p className="text-white/50 text-sm mb-6">
            Your plan has been upgraded. All new features are now available in your dashboard.
          </p>
          <Button size="md" onClick={onClose} className="rounded-xl w-full">
            Get started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background: '#0D0D0D' }}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-lg font-bold text-white">
            Upgrade to {plan.name}
          </h2>
          <button onClick={onClose}
            className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Price summary */}
          <div className="rounded-2xl p-4 border"
            style={{ background: `${plan.color}08`, borderColor: `${plan.color}25` }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-white/70">{plan.name} Plan · Annual billing</span>
              <div style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold text-white">
                ${plan.price}<span className="text-sm font-normal text-white/40">/mo</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-white/40">
              <span>Billed ${plan.price * 12}/year</span>
              <span className="text-[#E8C96A]">Save 20% vs monthly</span>
            </div>
          </div>

          {/* What you get */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Everything in your plan, plus:
            </p>
            <div className="space-y-2">
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Payment summary */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            {[
              { label: 'Current plan (Pro)', value: '-$39.00/mo' },
              { label: `${plan.name} plan`, value: `$${plan.price}.00/mo` },
              { label: 'Due today (prorated)', value: `$${Math.floor(plan.price * 0.7)}.00` },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-white/50">{row.label}</span>
                <span className="text-white font-medium">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Shield className="w-3.5 h-3.5 text-[#E8C96A]" />
            Secured by Stripe · Cancel anytime · Prorated billing
          </div>

          <Button size="lg" loading={loading} onClick={handleUpgrade}
            className="w-full rounded-xl gap-2">
            {!loading && (
              <><Zap className="w-4 h-4" /> Confirm upgrade to {plan.name}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
