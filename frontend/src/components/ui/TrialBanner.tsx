'use client';

import { useState } from 'react';
import { Zap, X, ArrowRight } from 'lucide-react';
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
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border mb-6"
      style={{
        background: urgent ? 'rgba(239,68,68,0.06)' : 'rgba(201,168,76,0.05)',
        borderColor: urgent ? 'rgba(239,68,68,0.2)' : 'rgba(201,168,76,0.18)',
      }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: urgent ? 'rgba(239,68,68,0.12)' : 'rgba(201,168,76,0.1)',
          border: `1px solid ${urgent ? 'rgba(239,68,68,0.25)' : 'rgba(201,168,76,0.2)'}`,
        }}>
        <Zap className="w-4 h-4" style={{ color: urgent ? '#EF4444' : '#C9A84C' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">
          {urgent
            ? `⚠️ ${planName} trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}!`
            : `🎉 ${daysLeft} days left on your ${planName} free trial`}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {urgent
            ? 'Upgrade now to keep your data, settings, and features.'
            : 'Enjoying Yoyzie AI? Lock in your plan before the trial ends.'}
        </p>
      </div>
      <button
        onClick={() => router.push('/dashboard/billing')}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
        Upgrade <ArrowRight className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => setDismissed(true)} className="p-1 flex-shrink-0"
        style={{ color: 'rgba(255,255,255,0.3)' }}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
