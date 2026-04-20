'use client';

import { useState } from 'react';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const BILLING_CYCLES = [
  { id: 'monthly', label: 'Monthly', discount: 0 },
  { id: '3month', label: '3 months', discount: 10 },
  { id: '6month', label: '6 months', discount: 15 },
  { id: 'annual', label: 'Annual', discount: 25 },
];

const INDIVIDUAL_PLANS = [
  {
    id: 'free', name: 'Free', monthlyPrice: 0, color: '#888888',
    desc: 'Try Yoyzie AI',
    features: ['3 social platforms', '3 AI posts/month', 'Basic analytics (7 days)', '10 scheduled posts/month', 'Email support'],
    cta: 'Get started free',
  },
  {
    id: 'individual_pro', name: 'Individual Pro', monthlyPrice: 1999, color: '#0066FF',
    desc: 'For solo creators & bloggers', popular: true,
    features: ['10 social platforms', 'Unlimited AI captions', '90-day analytics', 'Unlimited scheduled posts', 'Kenyan trend detection', 'Priority support'],
    cta: 'Start 7-day trial',
  },
  {
    id: 'creator', name: 'Creator', monthlyPrice: 4999, color: '#00D4AA',
    desc: 'For serious content creators',
    features: ['Everything in Pro', 'Browse influencer marketplace', 'Competitor analysis', 'A/B post testing', 'Custom PDF reports', '3 brand accounts'],
    cta: 'Start 7-day trial',
  },
  {
    id: 'power_user', name: 'Power User', monthlyPrice: 9999, color: '#A855F7',
    desc: 'Run full campaigns',
    features: ['Everything in Creator', 'HIRE influencers', 'Post campaign briefs', '3 team seats', 'Full API access', 'Social listening', 'Dedicated manager'],
    cta: 'Start 7-day trial',
  },
];

const INFLUENCER_PLANS = [
  {
    id: 'influencer_free', name: 'Free', monthlyPrice: 0, color: '#888888',
    desc: 'Get started as an influencer', commission: 25,
    features: ['3 platforms', '5 posts/month', 'Low marketplace priority', 'Low-paying jobs only', 'Basic wallet (M-Pesa)'],
    cta: 'Join free',
  },
  {
    id: 'influencer_starter', name: 'Starter', monthlyPrice: 1999, color: '#0066FF',
    desc: 'Start earning from campaigns', commission: 20,
    features: ['5 platforms', '20 posts/month', 'Standard marketplace priority', 'Mid-tier campaign access', 'Full wallet (M-Pesa, PayPal, bank)'],
    cta: 'Start 7-day trial',
  },
  {
    id: 'influencer_pro', name: 'Influencer Pro', monthlyPrice: 4999, color: '#00D4AA',
    desc: 'High-priority placement', commission: 15, popular: true,
    features: ['10 platforms', 'Unlimited posts', 'HIGH marketplace priority', 'All campaign tiers', 'Full bot detection report', 'Click-to-view analytics', 'Verified badge eligibility'],
    cta: 'Start 7-day trial',
  },
  {
    id: 'creator_mode', name: 'Creator Mode', monthlyPrice: 9999, color: '#A855F7',
    desc: 'Maximum earnings & exposure', commission: 10,
    features: ['Everything in Pro', 'TOP marketplace priority', 'Premium campaign first access', 'Instant payouts', 'Custom portfolio page', 'AI rate card assistant', 'Dedicated success manager'],
    cta: 'Start 7-day trial',
  },
];

const BUSINESS_PLANS = [
  {
    id: 'sme', name: 'SME', monthlyPrice: 9999, color: '#0066FF',
    desc: 'For small businesses in Kenya',
    features: ['All 23 platforms', '5 team seats', '5 brand profiles', 'Full influencer marketplace', 'Post campaign briefs', 'Business ROI analytics', 'Priority support (4hr SLA)'],
    cta: 'Start 10-day trial',
  },
  {
    id: 'growing_base', name: 'Growing (10 users)', monthlyPrice: 29000, color: '#00D4AA',
    desc: 'Scale your marketing team',
    features: ['Everything in SME', '10 team seats', '10 brand profiles', 'Custom AI training', 'Influencer CRM', 'Advanced campaign automation', 'CRM integrations (HubSpot)'],
    cta: 'Start 10-day trial',
  },
  {
    id: 'growing_max', name: 'Growing (25 users)', monthlyPrice: 49000, color: '#A855F7',
    desc: 'For mid-size marketing teams',
    features: ['Everything in Growing Base', '25 team seats', '20 brand profiles', 'Custom KPI dashboards', 'Quarterly strategy sessions', 'Advanced social listening'],
    cta: 'Start 10-day trial',
  },
  {
    id: 'enterprise', name: 'Enterprise', monthlyPrice: 80000, color: '#FF6B35',
    desc: 'For large corps & agencies',
    features: ['Unlimited team seats', 'Unlimited brand profiles', 'Dedicated infrastructure', 'Custom AI model training', 'SSO/SAML', '99.9% SLA', '24/7 dedicated support', 'White-label option'],
    cta: 'Contact sales',
  },
];

interface PlanCardsProps {
  onUpgrade: (planId: string) => void;
  view?: 'individual' | 'influencer' | 'business';
}

export function PlanCards({ onUpgrade, view = 'individual' }: PlanCardsProps) {
  const [cycle, setCycle] = useState('monthly');
  const [activeView, setActiveView] = useState(view);

  const plans = activeView === 'individual' ? INDIVIDUAL_PLANS : activeView === 'influencer' ? INFLUENCER_PLANS : BUSINESS_PLANS;
  const selectedCycle = BILLING_CYCLES.find(c => c.id === cycle)!;

  const getPrice = (monthly: number) => {
    if (monthly === 0) return 0;
    return Math.round(monthly * (1 - selectedCycle.discount / 100));
  };

  const formatPrice = (p: number) => p === 0 ? 'Free' : `KES ${p.toLocaleString()}`;

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-white/[0.06]">
        <div className="flex bg-white/[0.04] rounded-xl border border-white/[0.06] p-1 gap-1">
          {[{ id: 'individual', label: 'Individual' }, { id: 'influencer', label: 'Influencer' }, { id: 'business', label: 'Business' }].map(v => (
            <button key={v.id} onClick={() => setActiveView(v.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeView === v.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
              {v.label}
            </button>
          ))}
        </div>
        {/* Billing cycle */}
        <div className="flex bg-white/[0.04] rounded-xl border border-white/[0.06] p-1 gap-1">
          {BILLING_CYCLES.map(c => (
            <button key={c.id} onClick={() => setCycle(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${cycle === c.id ? 'bg-white/10 text-white' : 'text-white/40'}`}>
              {c.label}
              {c.discount > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00D4AA]/20 text-[#00D4AA]">-{c.discount}%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map((plan: any) => (
          <div key={plan.id}
            className={cn('relative rounded-2xl p-5 border flex flex-col transition-all', plan.popular ? 'border-[#0066FF]/40 shadow-lg shadow-blue-500/10' : 'border-white/[0.06] hover:border-white/15')}
            style={{ background: plan.popular ? 'rgba(0,102,255,0.05)' : 'rgba(255,255,255,0.02)' }}>

            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white bg-[#0066FF] shadow-lg shadow-blue-500/30 whitespace-nowrap">
                Most popular
              </div>
            )}

            <div className="mb-4">
              <div className="text-xs font-semibold mb-1" style={{ color: plan.color }}>{plan.name}</div>
              <div className="text-[11px] text-white/40 mb-3">{plan.desc}</div>

              {/* Commission badge for influencer plans */}
              {plan.commission !== undefined && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.06] border border-white/[0.06] mb-3">
                  <Zap className="w-3 h-3 text-[#FF6B35]" />
                  <span className="text-[10px] text-white/60">{plan.commission}% commission</span>
                </div>
              )}

              <div style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white">
                {plan.monthlyPrice === 0 ? 'Free' : (
                  <>
                    {formatPrice(getPrice(plan.monthlyPrice))}
                    <span className="text-sm font-normal text-white/40">/mo</span>
                  </>
                )}
              </div>
              {cycle !== 'monthly' && plan.monthlyPrice > 0 && (
                <div className="text-[10px] text-[#00D4AA] mt-0.5">
                  Save KES {(plan.monthlyPrice * selectedCycle.discount / 100).toLocaleString()}/month
                </div>
              )}
            </div>

            <ul className="space-y-2 mb-5 flex-1">
              {plan.features.map((f: string) => (
                <li key={f} className="flex items-start gap-2 text-xs text-white/60">
                  <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                  {f}
                </li>
              ))}
            </ul>

            {plan.id === 'enterprise' ? (
              <button className="w-full py-2.5 rounded-xl text-xs font-medium border border-white/15 text-white/60 hover:border-white/30 hover:text-white transition-all">
                Contact sales →
              </button>
            ) : (
              <button onClick={() => onUpgrade(plan.id)}
                className="w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                style={{ background: plan.color, color: 'white', boxShadow: `0 4px 20px ${plan.color}30` }}>
                {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
