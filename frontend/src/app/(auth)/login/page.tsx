'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { AuthInput } from '@/components/auth/AuthInput';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({});

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
    setErrors({});
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      setErrors({ api: error.message || 'Invalid email or password' });
    }
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
          <Link href="/signup" className="text-[#0066FF] hover:text-[#3385FF] transition-colors font-medium">
            Sign up free
          </Link>
        </p>
      </div>

      <SocialAuthButtons mode="login" />

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
              className="text-xs text-[#0066FF] hover:text-[#3385FF] transition-colors">
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
          <input type="checkbox" id="remember"
            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#0066FF] cursor-pointer" />
          <label htmlFor="remember" className="text-sm text-white/50 cursor-pointer select-none">
            Keep me signed in for 30 days
          </label>
        </div>

        <Button type="submit" size="lg" loading={isLoading} className="w-full rounded-xl mt-2">
          {!isLoading && <>Sign in <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </form>

      <p className="text-center text-xs text-white/25 mt-6">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="text-white/40 hover:text-white/60 underline underline-offset-2">Terms</Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-white/40 hover:text-white/60 underline underline-offset-2">Privacy Policy</Link>
      </p>
    </div>
  );
}
