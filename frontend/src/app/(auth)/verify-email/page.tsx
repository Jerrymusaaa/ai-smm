'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Mail, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="relative w-20 h-20 mx-auto mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0066FF]/20 to-[#00D4AA]/20 border border-white/10 flex items-center justify-center">
          <Mail className="w-9 h-9 text-white/80" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00D4AA] border-2 border-[#050A14] flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white mb-3">
        Verify your email
      </h1>
      <p className="text-white/50 text-sm leading-relaxed mb-2 max-w-xs mx-auto">
        We sent a verification link to your email address.
      </p>
      <p className="text-white/70 text-sm font-medium mb-8">Check your inbox and click the link to continue.</p>

      {/* Steps */}
      <div className="glass rounded-2xl p-5 border border-white/[0.06] mb-8 text-left space-y-4">
        {[
          { step: '1', text: 'Open the email from Yoyzie AI' },
          { step: '2', text: 'Click the "Verify my email" button' },
          { step: '3', text: 'You\'ll be redirected to your dashboard' },
        ].map(item => (
          <div key={item.step} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#0066FF]/20 border border-[#0066FF]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-[#0066FF]">{item.step}</span>
            </div>
            <span className="text-sm text-white/60">{item.text}</span>
          </div>
        ))}
      </div>

      {resent && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-sm text-[#00D4AA] text-center">
          ✓ Verification email resent successfully
        </div>
      )}

      <Button variant="outline" size="lg" loading={loading} onClick={handleResend} className="w-full rounded-xl mb-4 gap-2">
        {!loading && <><RefreshCw className="w-4 h-4" /> Resend verification email</>}
      </Button>

      <p className="text-xs text-white/25">
        Wrong email?{' '}
        <Link href="/signup" className="text-[#0066FF] hover:text-[#3385FF] transition-colors">
          Go back and change it
        </Link>
      </p>
    </div>
  );
}
