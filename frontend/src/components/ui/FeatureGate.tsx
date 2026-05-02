'use client';

import { Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FeatureGateProps {
  locked: boolean;
  message: string;
  requiredPlan?: string;
  children: React.ReactNode;
  blurred?: boolean;
}

export function FeatureGate({ locked, message, requiredPlan, children, blurred = true }: FeatureGateProps) {
  const router = useRouter();

  if (!locked) return <>{children}</>;

  return (
    <div className="relative">
      {blurred && <div className="pointer-events-none select-none" style={{ filter: 'blur(4px)', opacity: 0.4 }}>{children}</div>}
      <div className={`${blurred ? 'absolute inset-0' : ''} flex items-center justify-center`}>
        <div className="glass rounded-2xl border border-[#C9A84C]/20 p-6 text-center max-w-xs mx-auto shadow-xl"
          style={{ background: 'rgba(0,102,255,0.08)' }}>
          <div className="w-10 h-10 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/25 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <p className="text-sm font-semibold text-white mb-1">Feature locked</p>
          <p className="text-xs text-white/50 mb-4 leading-relaxed">{message}</p>
          {requiredPlan && (
            <button
              onClick={() => router.push('/dashboard/billing')}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-medium bg-[#C9A84C] text-white hover:opacity-90 transition-all">
              Upgrade to unlock <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LockedBadge({ message }: { message: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08]">
      <Lock className="w-3 h-3 text-white/30" />
      <span className="text-[10px] text-white/30">{message}</span>
    </div>
  );
}
