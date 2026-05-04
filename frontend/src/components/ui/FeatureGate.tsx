'use client';

import { Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FeatureGateProps {
  locked: boolean;
  message: string;
  neededPlan?: string;
  children: React.ReactNode;
  blurred?: boolean;
}

export function FeatureGate({ locked, message, neededPlan, children, blurred = true }: FeatureGateProps) {
  const router = useRouter();
  if (!locked) return <>{children}</>;

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {blurred && (
        <div className="pointer-events-none select-none" style={{ filter: 'blur(3px)', opacity: 0.35 }}>
          {children}
        </div>
      )}
      <div className={`${blurred ? 'absolute inset-0' : ''} flex items-center justify-center p-6`}>
        <div className="text-center max-w-xs p-6 rounded-2xl border shadow-2xl"
          style={{ background: 'rgba(13,13,15,0.95)', borderColor: 'rgba(201,168,76,0.25)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
            <Lock className="w-5 h-5" style={{ color: '#C9A84C' }} />
          </div>
          <p className="text-sm font-semibold text-white mb-1">Feature locked</p>
          <p className="text-xs mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {message}
          </p>
          {neededPlan && (
            <button onClick={() => router.push('/dashboard/billing')}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0A0A0A' }}>
              Upgrade to {neededPlan} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LockedBadge({ message }: { message: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border"
      style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.15)' }}>
      <Lock className="w-3 h-3" style={{ color: 'rgba(201,168,76,0.5)' }} />
      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{message}</span>
    </div>
  );
}
