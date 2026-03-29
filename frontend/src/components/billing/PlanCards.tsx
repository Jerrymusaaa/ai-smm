'use client';

import { useState } from 'react';
import { Check, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const PLANS = [
  {
    id: 'free', name: 'Free', price: { monthly: 0, annual: 0 },
    description: 'For individuals getting started',
    color: '#888888', current: false,
    features: [
      '3 social platforms',
      '30 scheduled posts/month',
      'Basic analytics (7 days)',
      'AI captions (50/month)',
      'Email support',
    ],
    limits: { platforms: 3, posts: 30, aiCaptions: 50 },
  },
  {
    id: 'pro', name: 'Pro', price: { monthly: 49, annual: 39 },
    description: 'For creators & small teams',
    color: '#0066FF', current: true, popular: true,
    features: [
      '10 social platforms',
      'Unlimited scheduled posts',
      'Full analytics (90 days)',
      'AI captions (unlimited)',
      'Campaign manager',
      'Hashtag intelligence',
      'Priority support',
    ],
    limits: { platforms: 10, posts: -1, aiCaptions: -1 },
  },
  {
    id: 'business', name: 'Business', price: { monthly: 149, annual: 119 },
    description: 'For growing marketing teams',
    color: '#00D4AA', current: false,
    features: [
      'All 23 platforms',
      'Team collaboration (5 seats)',
      'Influencer marketplace',
      'Advanced AI agents',
      'Custom report builder',
      'Trend detection',
      'Social listening',
      'API access',
      'Dedicated success manager',
    ],
    limits: { platforms: 23, posts: -1, aiCaptions: -1 },
  },
  {
    id: 'enterprise', name: 'Enterprise', price: { monthly: null, annual: null },
    description: 'For large organizations',
    color: '#A855F7', current: false,
    features: [
      'Unlimited everything',
      'Custom integrations',
      'Unlimited team seats',
      'White-label option',
      'Custom AI training',
      'SLA guarantee',
      'SAML SSO',
      'Dedicated infrastructure',
    ],
    limits: { platforms: -1, posts: -1, aiCaptions: -1 },
  },
];

interface PlanCardsProps {
  onUpgrade: (planId: string) => void;
}

export function PlanCards({ onUpgrade }: PlanCardsProps) {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-white/[0.06]">
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Subscription plans
          </h3>
          <p className="text-xs text-white/40 mt-0.5">Upgrade or downgrade at any time</p>
        </div>
        {/* Billing toggle */}
        <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl border border-white/[0.06] p-1">
          <button onClick={() => setAnnual(false)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${!annual ? 'bg-white/10 text-white' : 'text-white/40'}`}>
            Monthly
          </button>
          <button onClick={() => setAnnual(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${annual ? 'bg-white/10 text-white' : 'text-white/40'}`}>
            Annual
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00D4AA]/20 text-[#00D4AA]">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLANS.map(plan => (
          <div key={plan.id}
            className={cn(
              'relative rounded-2xl p-5 border flex flex-col transition-all',
              plan.current
                ? 'border-[#0066FF]/40 shadow-lg shadow-blue-500/10'
                : 'border-white/[0.06] hover:border-white/15'
            )}
            style={{ background: plan.current ? 'rgba(0,102,255,0.05)' : 'rgba(255,255,255,0.02)' }}>

            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white bg-[#0066FF] shadow-lg shadow-blue-500/30">
                Current plan
              </div>
            )}

            <div className="mb-4">
              <div className="text-xs font-semibold mb-1" style={{ color: plan.color }}>{plan.name}</div>
              <div className="text-[11px] text-white/40 mb-3">{plan.description}</div>
              <div style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white">
                {plan.price.monthly === null ? (
                  <span className="text-xl">Custom</span>
                ) : plan.price.monthly === 0 ? 'Free' : (
                  <>
                    ${annual ? plan.price.annual : plan.price.monthly}
                    <span className="text-sm font-normal text-white/40">/mo</span>
                  </>
                )}
              </div>
              {annual && plan.price.monthly !== null && plan.price.monthly > 0 && (
                <div className="text-[10px] text-white/30 mt-0.5">
                  Billed ${(plan.price.annual! * 12).toLocaleString()}/year
                </div>
              )}
            </div>

            <ul className="space-y-2 mb-5 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-white/60">
                  <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                  {f}
                </li>
              ))}
            </ul>

            {plan.current ? (
              <div className="w-full py-2.5 rounded-xl text-xs font-medium text-center border border-[#0066FF]/30 text-[#0066FF]">
                ✓ Current plan
              </div>
            ) : plan.id === 'enterprise' ? (
              <button className="w-full py-2.5 rounded-xl text-xs font-medium border border-white/15 text-white/60 hover:border-white/30 hover:text-white transition-all">
                Contact sales
              </button>
            ) : (
              <button onClick={() => onUpgrade(plan.id)}
                className="w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                style={{ background: plan.color, color: 'white', boxShadow: `0 4px 20px ${plan.color}30` }}>
                Upgrade to {plan.name} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
