'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AuthInput } from '@/components/auth/AuthInput';
import { Mail, ArrowLeft, Check } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-[#0066FF]/20 border border-[#0066FF]/30 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[#0066FF]" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-white mb-3">
          Reset link sent
        </h2>
        <p className="text-white/50 text-sm mb-2 max-w-xs mx-auto">
          We sent a password reset link to
        </p>
        <p className="text-white font-medium text-sm mb-6">{email}</p>
        <p className="text-white/30 text-xs mb-8 max-w-xs mx-auto">
          Didn&apos;t receive it? Check your spam folder or{' '}
          <button onClick={() => setSent(false)} className="text-[#0066FF] hover:underline">
            try another email
          </button>
        </p>
        <Link href="/login">
          <Button variant="outline" size="md" className="rounded-xl gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/login"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white mb-2">
          Reset your password
        </h1>
        <p className="text-white/40 text-sm leading-relaxed">
          Enter the email address associated with your account and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email address"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          error={error}
          icon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          autoFocus
        />

        <Button type="submit" size="lg" loading={loading} className="w-full rounded-xl">
          {!loading && 'Send reset link'}
        </Button>
      </form>

      <p className="text-center text-xs text-white/25 mt-6">
        Remember your password?{' '}
        <Link href="/login" className="text-[#0066FF] hover:text-[#3385FF] transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
