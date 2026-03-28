'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { AuthInput } from '@/components/auth/AuthInput';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-3xl font-bold text-white mb-2"
        >
          Welcome back
        </h1>
        <p className="text-white/40 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#0066FF] hover:text-[#3385FF] transition-colors font-medium">
            Sign up free
          </Link>
        </p>
      </div>

      <SocialAuthButtons mode="login" />

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
            <Link
              href="/forgot-password"
              className="text-xs text-[#0066FF] hover:text-[#3385FF] transition-colors"
            >
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

        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#0066FF] cursor-pointer"
          />
          <label htmlFor="remember" className="text-sm text-white/50 cursor-pointer select-none">
            Keep me signed in for 30 days
          </label>
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full rounded-xl mt-2">
          {!loading && (
            <>
              Sign in <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-white/25 mt-6">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="text-white/40 hover:text-white/60 underline underline-offset-2">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-white/40 hover:text-white/60 underline underline-offset-2">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
