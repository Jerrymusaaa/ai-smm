'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AuthInput } from '@/components/auth/AuthInput';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});
    try {
      await login(email, password);
      // Get redirect param or default to dashboard
      const redirect = searchParams.get('redirect') || '/dashboard';
      // Use window.location for a hard redirect so the cookie is picked up by middleware
      window.location.href = redirect;
    } catch (error: any) {
      setErrors({ api: error.message || 'Invalid email or password' });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)' }}
          className="text-3xl font-bold text-white mb-2">
          Welcome back
        </h1>
        <p className="text-white/40 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium transition-colors"
            style={{ color: 'var(--gold-mid)' }}>
            Sign up free
          </Link>
        </p>
      </div>

      {/* Google only */}
      <button onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/20 transition-all mb-6 text-sm font-medium text-white/80">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.06]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 text-white/30" style={{ background: '#0D1525' }}>
            or sign in with email
          </span>
        </div>
      </div>

      {errors.api && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email address"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={errors.email}
          icon={<Mail className="w-4 h-4" />}
          autoComplete="email"
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white/70">Password</label>
            <Link href="/forgot-password"
              className="text-xs transition-colors hover:text-white"
              style={{ color: 'var(--gold-mid)' }}>
              Forgot password?
            </Link>
          </div>
          <AuthInput
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
            icon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" size="lg" loading={isLoading} className="w-full rounded-xl mt-2"
          style={!isLoading ? {
            background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
            color: '#0A0A0A',
            border: 'none',
          } : {}}>
          {!isLoading && <>Sign in <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </form>

      <p className="text-center text-xs text-white/25 mt-6">
        By signing in you agree to our{' '}
        <Link href="/terms" className="text-white/40 hover:text-white/60 underline underline-offset-2">Terms</Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-white/40 hover:text-white/60 underline underline-offset-2">Privacy Policy</Link>
      </p>
    </div>
  );
}
