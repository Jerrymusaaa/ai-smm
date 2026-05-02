'use client';

import { useState } from 'react';
import { AlertTriangle, Sparkles, ExternalLink } from 'lucide-react';
import { BillingOverview } from '@/components/billing/BillingOverview';
import { PlanCards } from '@/components/billing/PlanCards';
import { UsageOverview } from '@/components/billing/UsageOverview';
import { PaymentMethod } from '@/components/billing/PaymentMethod';
import { InvoiceHistory } from '@/components/billing/InvoiceHistory';
import { UpgradeModal } from '@/components/billing/UpgradeModal';
import { Button } from '@/components/ui/Button';

export default function BillingPage() {
  const [upgradePlan, setUpgradePlan] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-bold text-white">
            Billing & Subscription
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage your plan, payment methods and invoices
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/[0.06] text-xs text-white/50 hover:text-white transition-all">
            <ExternalLink className="w-3.5 h-3.5" /> Customer portal
          </button>
          <Button size="sm" onClick={() => setUpgradePlan('business')} className="rounded-xl gap-2">
            <Sparkles className="w-4 h-4" /> Upgrade plan
          </Button>
        </div>
      </div>

      {/* Overview cards */}
      <BillingOverview />

      {/* AI upsell banner */}
      <div className="rounded-2xl border border-[#E8C96A]/20 p-4 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(0,102,255,0.05))' }}>
        <div className="w-9 h-9 rounded-xl bg-[#E8C96A]/20 border border-[#E8C96A]/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-[#E8C96A]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">
            You're getting great value from Pro
          </p>
          <p className="text-xs text-white/50 mt-0.5">
            You've generated <span className="text-white font-medium">2,840 AI captions</span> and
            scheduled <span className="text-white font-medium">847 posts</span> this month.
            Upgrade to Business to unlock the Influencer Marketplace and team collaboration.
          </p>
        </div>
        <button onClick={() => setUpgradePlan('business')}
          className="flex-shrink-0 text-xs font-medium text-[#E8C96A] hover:text-white transition-colors whitespace-nowrap">
          Upgrade →
        </button>
      </div>

      {/* Plans */}
      <PlanCards onUpgrade={setUpgradePlan} />

      {/* Usage + Payment side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <UsageOverview />
        <PaymentMethod />
      </div>

      {/* Invoice history */}
      <InvoiceHistory />

      {/* Danger zone */}
      <div className="glass rounded-2xl border border-red-500/20 overflow-hidden">
        <div className="px-5 py-4 border-b border-red-500/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
              Danger zone
            </h3>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/80">Cancel subscription</p>
              <p className="text-xs text-white/40 mt-0.5">
                Your plan will remain active until May 1, 2025. After that you'll be downgraded to Free.
              </p>
            </div>
            {!showCancelConfirm ? (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                Cancel subscription
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-shrink-0">
                <p className="text-xs text-white/50">Are you sure?</p>
                <button onClick={() => setShowCancelConfirm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs border border-white/15 text-white/60 hover:text-white transition-all">
                  Keep plan
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all">
                  Yes, cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade modal */}
      {upgradePlan && (
        <UpgradeModal
          planId={upgradePlan}
          onClose={() => setUpgradePlan(null)}
        />
      )}
    </div>
  );
}
