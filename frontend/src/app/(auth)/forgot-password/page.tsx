'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { AuthInput } from '@/components/auth/AuthInput';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email'); return; }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
          <Check className="w-8 h-8" style={{ color: '#E8C96A' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)' }}
          className="text-2xl font-bold text-white mb-3">
          Check your inbox
        </h2>
        <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
          We sent a password reset link to
        </p>
        <p className="text-white font-semibold mb-6">{email}</p>
        <p className="text-xs mb-8 max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>
          The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
        </p>
        <div className="space-y-3">
          <Button size="md" onClick={() => setSent(false)}
            className="w-full rounded-xl"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#E8C96A' }}>
            Try a different email
          </Button>
          <Link href="/login"
            className="block text-center text-sm transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)' }}
          className="text-3xl font-bold text-white mb-2">
          Forgot password?
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email address"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          autoComplete="email"
        />

        <Button type="submit" size="lg" loading={loading} className="w-full rounded-xl gap-2"
          style={!loading ? {
            background: 'linear-gradient(135deg,#C9A84C,#E8C96A)',
            color: '#0A0A0A',
            border: 'none',
          } : {}}>
          {!loading && <>Send reset link <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </form>

      <Link href="/login"
        className="flex items-center justify-center gap-1.5 mt-6 text-sm transition-colors hover:text-white"
        style={{ color: 'rgba(255,255,255,0.4)' }}>
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </Link>
    </div>
  );
}
