'use client';

import { Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FeatureGateProps {
  locked: boolean;
  message: string;
  neededPlan?: string;
  children: React.ReactNode;
  blurred?: boolean;
  compact?: boolean;
}

export function FeatureGate({
  locked, message, neededPlan, children, blurred = true, compact = false
}: FeatureGateProps) {
  const router = useRouter();
  if (!locked) return <>{children}</>;

  const overlay = (
    <div className={`${blurred ? 'absolute inset-0' : ''} flex items-center justify-center p-4`}>
      <div className={`text-center rounded-2xl border shadow-xl ${compact ? 'p-4 max-w-[240px]' : 'p-6 max-w-xs'}`}
        style={{ background: 'rgba(10,10,10,0.96)', borderColor: 'rgba(201,168,76,0.25)' }}>
        <div className={`rounded-full flex items-center justify-center mx-auto mb-3 ${compact ? 'w-8 h-8' : 'w-10 h-10'}`}
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
          <Lock className={compact ? 'w-4 h-4' : 'w-5 h-5'} style={{ color: '#C9A84C' }} />
        </div>
        <p className={`font-semibold text-white mb-1 ${compact ? 'text-xs' : 'text-sm'}`}>
          Feature locked
        </p>
        <p className={`leading-relaxed mb-4 ${compact ? 'text-[10px]' : 'text-xs'}`}
          style={{ color: 'rgba(255,255,255,0.5)' }}>
          {message}
        </p>
        {neededPlan && (
          <button
            onClick={() => router.push('/dashboard/billing')}
            className={`flex items-center justify-center gap-1.5 w-full rounded-xl font-semibold transition-all hover:opacity-90 ${compact ? 'py-2 text-[10px]' : 'py-2.5 text-xs'}`}
            style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
            Upgrade to {neededPlan} <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );

  if (!blurred) return overlay;

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="pointer-events-none select-none" style={{ filter: 'blur(3px)', opacity: 0.3 }}>
        {children}
      </div>
      {overlay}
    </div>
  );
}

// Inline lock badge for nav items and small features
export function LockedBadge({ label = 'Upgrade' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold"
      style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}>
      <Lock className="w-2.5 h-2.5" /> {label}
    </span>
  );
}

// Upgrade prompt banner (inline, not a gate)
export function UpgradePrompt({ message, neededPlan }: { message: string; neededPlan: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
      style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.15)' }}>
      <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: '#C9A84C' }} />
      <p className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{message}</p>
      <button
        onClick={() => router.push('/dashboard/billing')}
        className="flex items-center gap-1 text-xs font-semibold whitespace-nowrap transition-colors hover:text-white"
        style={{ color: '#E8C96A' }}>
        {neededPlan} <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
