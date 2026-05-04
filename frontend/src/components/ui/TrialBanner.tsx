'use client';

import { Zap, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TrialBannerProps {
  daysLeft: number;
  planName: string;
}

export function TrialBanner({ daysLeft, planName }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();
  if (dismissed) return null;

  const urgent = daysLeft <= 2;

  return (
    <div className="rounded-2xl p-4 flex items-center gap-4 mb-6 border"
      style={{
        background: urgent ? 'rgba(239,68,68,0.08)' : 'rgba(201,168,76,0.06)',
        borderColor: urgent ? 'rgba(239,68,68,0.25)' : 'rgba(201,168,76,0.2)',
      }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: urgent ? 'rgba(239,68,68,0.15)' : 'rgba(201,168,76,0.12)',
          border: `1px solid ${urgent ? 'rgba(239,68,68,0.3)' : 'rgba(201,168,76,0.25)'}`,
        }}>
        <Zap className="w-4 h-4" style={{ color: urgent ? '#EF4444' : '#C9A84C' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">
          {urgent
            ? `⚠️ Your ${planName} trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}!`
            : `🎉 ${daysLeft} days left on your ${planName} free trial`}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {urgent
            ? 'Upgrade now to keep all your data, settings, and features.'
            : 'Enjoying Yoyzie AI? Lock in your plan before the trial ends.'}
        </p>
      </div>
      <button onClick={() => router.push('/dashboard/billing')}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all"
        style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0A0A0A' }}>
        Upgrade <ArrowRight className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => setDismissed(true)} className="p-1 flex-shrink-0 transition-colors"
        style={{ color: 'rgba(255,255,255,0.3)' }}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
