'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Check, ArrowRight } from 'lucide-react';
import { AuthInput } from '@/components/auth/AuthInput';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState('');

  const strength = password.length < 4 ? 0 : password.length < 7 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['#EF4444', '#F59E0B', '#C9A84C', '#E8C96A'];
  const strengthLabels = ['Too short', 'Weak', 'Good', 'Strong'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) { setError('Invalid reset link. Please request a new one.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password }),
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
          <Check className="w-8 h-8" style={{ color: '#E8C96A' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)' }}
          className="text-2xl font-bold text-white mb-3">
          Password reset!
        </h2>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Your password has been updated successfully.
        </p>
        <Button size="lg" onClick={() => router.push('/login')} className="rounded-xl gap-2"
          style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A', border: 'none' }}>
          Sign in now <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)' }}
          className="text-3xl font-bold text-white mb-2">
          Set new password
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Choose a strong password for your account.
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
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
        />

        {password && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[0,1,2,3].map(i => (
                <div key={i} className="flex-1 h-1 rounded-full transition-all"
                  style={{ background: i < strength ? strengthColors[strength - 1] : 'rgba(255,255,255,0.08)' }} />
              ))}
            </div>
            <p className="text-xs" style={{ color: strengthColors[strength - 1] || 'rgba(255,255,255,0.3)' }}>
              {password ? strengthLabels[strength - 1] || 'Too short' : ''}
            </p>
          </div>
        )}

        <AuthInput
          label="Confirm new password"
          type="password"
          placeholder="Repeat your password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
        />

        <Button type="submit" size="lg" loading={loading} className="w-full rounded-xl gap-2 mt-2"
          style={!loading ? {
            background: 'linear-gradient(135deg,#C9A84C,#E8C96A)',
            color: '#0A0A0A',
            border: 'none',
          } : {}}>
          {!loading && <>Reset password <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </form>
    </div>
  );
}
