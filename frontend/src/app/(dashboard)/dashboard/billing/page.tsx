'use client';

import { useState } from 'react';
import { usePlan } from '@/hooks/usePlan';
import { PLANS, PlanId } from '@/lib/planGating';
import { Check, Zap, AlertTriangle, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const INDIVIDUAL_PLANS: PlanId[] = ['FREE', 'INDIVIDUAL_PRO', 'CREATOR', 'POWER_USER'];
const INFLUENCER_PLANS: PlanId[] = ['INFLUENCER_FREE', 'INFLUENCER_STARTER', 'INFLUENCER_PRO', 'CREATOR_MODE'];
const BUSINESS_PLANS: PlanId[] = ['SME', 'GROWING', 'ENTERPRISE'];

const PLAN_FEATURES: Record<PlanId, string[]> = {
  FREE:               ['3 social platforms', '3 AI posts/month', 'Basic analytics (7 days)', '10 scheduled posts/month'],
  INDIVIDUAL_PRO:     ['10 platforms', 'Unlimited AI content', '90-day analytics', 'Kenyan trend detection', 'Priority support'],
  CREATOR:            ['Everything in Pro', 'Browse influencer marketplace', 'A/B post testing', 'Competitor analysis', '3 brand accounts'],
  POWER_USER:         ['Everything in Creator', 'Hire influencers', 'Post campaign briefs', '3 team seats', 'Full API access'],
  INFLUENCER_FREE:    ['3 platforms', '5 posts/month', 'Ad campaign marketplace', '25% commission', 'Basic wallet'],
  INFLUENCER_STARTER: ['5 platforms', '20 posts/month', 'Standard priority listing', '20% commission', 'Full wallet (M-Pesa, PayPal)'],
  INFLUENCER_PRO:     ['10 platforms', 'Unlimited posts', 'HIGH priority listing', '15% commission', 'Full bot detection', 'Verified badge'],
  CREATOR_MODE:       ['Everything in Pro', 'TOP priority listing', '10% commission', 'Instant payouts', 'Personal brand strategy'],
  SME:                ['All 23 platforms', '5 team seats', 'Full influencer marketplace', 'Campaign brief board', 'Priority support'],
  GROWING:            ['Everything in SME', '25 team seats', 'Custom AI training', 'Influencer CRM', 'Advanced analytics'],
  ENTERPRISE:         ['Unlimited everything', 'Dedicated infrastructure', 'Custom AI model', 'SSO/SAML', '99.9% SLA', 'White-label'],
};

function PlanCard({ planId, currentPlanId, onSelect }: { planId: PlanId; currentPlanId: string; onSelect: (id: PlanId) => void }) {
  const plan = PLANS[planId];
  const isCurrent = currentPlanId.toUpperCase().replace(/ /g,'_') === planId;
  const features = PLAN_FEATURES[planId] || [];

  return (
    <div className={`relative rounded-2xl p-5 border flex flex-col transition-all ${isCurrent ? 'border-[#C9A84C]/40' : 'border-white/[0.06] hover:border-white/15'}`}
      style={{ background: isCurrent ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)' }}>

      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
          Current plan
        </div>
      )}

      <div className="mb-4">
        <div className="text-xs font-semibold mb-1" style={{ color: plan.color }}>{plan.name}</div>
        <div style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-white">
          {plan.priceKES === 0 ? 'Free' : `KES ${plan.priceKES.toLocaleString()}`}
          {plan.priceKES > 0 && <span className="text-sm font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>/mo</span>}
        </div>
        {plan.commissionRate !== undefined && (
          <div className="text-xs mt-1" style={{ color: '#E8C96A' }}>
            {plan.commissionRate}% commission rate
          </div>
        )}
      </div>

      <ul className="space-y-2 mb-5 flex-1">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
            {f}
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <div className="w-full py-2.5 rounded-xl text-xs font-medium text-center border"
          style={{ borderColor: 'rgba(201,168,76,0.3)', color: '#C9A84C' }}>
          ✓ Your current plan
        </div>
      ) : planId === 'ENTERPRISE' ? (
        <a href="mailto:hello@yoyzie.ai"
          className="w-full py-2.5 rounded-xl text-xs font-medium text-center border transition-all hover:border-white/30"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
          Contact sales
        </a>
      ) : (
        <button onClick={() => onSelect(planId)}
          className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
          style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}35`, color: plan.color }}>
          Upgrade to {plan.name} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default function BillingPage() {
  const { user } = useAuthStore();
  const { plan, isInfluencer, isBusiness } = usePlan();
  const [showCancel, setShowCancel] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const planList = isInfluencer ? INFLUENCER_PLANS : isBusiness ? BUSINESS_PLANS : INDIVIDUAL_PLANS;
  const currentPlanId = user?.plan || 'FREE';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl sm:text-3xl font-bold text-white">
            Billing & Subscription
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Manage your plan, payments, and invoices
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all"
          style={{ borderColor: 'rgba(201,168,76,0.15)', color: 'rgba(255,255,255,0.5)' }}>
          <ExternalLink className="w-3.5 h-3.5" /> Customer portal
        </button>
      </div>

      {/* Current plan overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Current plan', value: plan.name, sub: plan.priceKES === 0 ? 'Free forever' : `KES ${plan.priceKES.toLocaleString()}/mo`, icon: Zap },
          { label: 'Next billing', value: 'Aug 1, 2026', sub: plan.priceKES > 0 ? `KES ${plan.priceKES.toLocaleString()} due` : 'N/A', icon: Sparkles },
          { label: 'Payment method', value: 'M-Pesa', sub: '+254 712 xxx xxx', icon: Check },
          { label: 'AI credits used', value: plan.aiPostsPerMonth === 'unlimited' ? '∞' : '12/3', sub: 'This month', icon: Zap },
        ].map(item => (
          <div key={item.label} className="glass rounded-2xl p-5 border" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <item.icon className="w-4 h-4" style={{ color: '#C9A84C' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)' }} className="text-lg font-bold text-white mb-0.5">{item.value}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Upsell banner */}
      {plan.priceKES === 0 && (
        <div className="rounded-2xl border p-4 flex items-center gap-4"
          style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.18)' }}>
          <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: '#C9A84C' }} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">You&apos;re on the Free plan</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Upgrade to unlock unlimited AI content, Kenyan trend detection, and more platforms.
            </p>
          </div>
          <span className="text-xs font-bold whitespace-nowrap" style={{ color: '#E8C96A' }}>
            From KES {isInfluencer ? '1,999' : '1,999'}/mo
          </span>
        </div>
      )}

      {/* Plan comparison */}
      <div className="glass rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            {isInfluencer ? 'Influencer plans' : isBusiness ? 'Business plans' : 'Individual plans'} — all in KES
          </h3>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Pay via M-Pesa, card or PayPal</span>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {planList.map(planId => (
            <PlanCard
              key={planId}
              planId={planId}
              currentPlanId={currentPlanId}
              onSelect={(id) => alert(`Upgrade to ${PLANS[id].name} — payment flow coming soon!`)}
            />
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
        <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: 'rgba(239,68,68,0.1)' }}>
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">Danger zone</h3>
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Cancel subscription</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Your plan stays active until the end of the billing period.
              </p>
            </div>
            {!showCancel ? (
              <button onClick={() => setShowCancel(true)}
                className="px-4 py-2 rounded-xl text-xs font-medium border transition-all"
                style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}>
                Cancel subscription
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowCancel(false)}
                  className="px-3 py-1.5 rounded-lg text-xs border transition-all"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                  Keep plan
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                  style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}>
                  Yes, cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
