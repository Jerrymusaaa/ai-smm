'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { AuthInput } from '@/components/auth/AuthInput';
import { Mail, Lock, User, Building2, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const ACCOUNT_TYPES = [
  { id: 'individual', label: 'Individual / Creator', desc: 'Personal brand, solo creator', icon: '🎨' },
  { id: 'startup', label: 'Startup', desc: 'Early-stage team or small business', icon: '🚀' },
  { id: 'corporate', label: 'Corporate', desc: 'Established company or enterprise', icon: '🏢' },
  { id: 'agency', label: 'Agency', desc: 'Managing multiple clients', icon: '🏆' },
];

const STEPS = ['Account type', 'Your details', 'Set password'];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState('');
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState('');

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 0 && !accountType) newErrors.accountType = 'Please select an account type';
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = 'Full name is required';
      if (!form.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    }
    if (step === 2) {
      if (!form.password) newErrors.password = 'Password is required';
      else if (form.password.length < 8) newErrors.password = 'At least 8 characters required';
      if (form.password !== form.confirm) newErrors.confirm = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (step < 2) { setStep(s => s + 1); return; }

    setLoading(true);
    setApiError('');

    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || 'Failed to send verification email. Please try again.');
        setLoading(false);
        return;
      }

      setDone(true);
    } catch {
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-[#00D4AA]/20 border border-[#00D4AA]/30 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[#00D4AA]" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-white mb-3">
          Check your email
        </h2>
        <p className="text-white/50 text-sm mb-2 max-w-xs mx-auto">
          We sent a verification link to
        </p>
        <p className="text-white font-medium text-sm mb-6">{form.email}</p>
        <p className="text-white/30 text-xs mb-8 max-w-xs mx-auto">
          Click the link in the email to activate your account. Check your spam folder if you don&apos;t see it.
        </p>
        <Button variant="outline" size="md" onClick={() => { setDone(false); setStep(0); }} className="rounded-xl">
          Back to sign up
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white mb-2">
          Create your account
        </h1>
        <p className="text-white/40 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0066FF] hover:text-[#3385FF] transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              i < step ? 'bg-[#00D4AA] text-white'
              : i === step ? 'bg-[#0066FF] text-white'
              : 'bg-white/10 text-white/30'
            }`}>
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-white' : 'text-white/30'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-white/10 ml-1" />}
          </div>
        ))}
      </div>

      {/* Step 0: Account type */}
      {step === 0 && (
        <div className="space-y-4">
          <SocialAuthButtons mode="signup" />
          <div className="grid grid-cols-2 gap-3">
            {ACCOUNT_TYPES.map(type => (
              <button key={type.id}
                onClick={() => { setAccountType(type.id); setErrors({}); }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  accountType === type.id
                    ? 'border-[#0066FF]/60 bg-[#0066FF]/10 shadow-lg shadow-blue-500/10'
                    : 'border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]'
                }`}>
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium text-white mb-0.5">{type.label}</div>
                <div className="text-xs text-white/40">{type.desc}</div>
                {accountType === type.id && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-[#0066FF] font-medium">
                    <Check className="w-3 h-3" /> Selected
                  </div>
                )}
              </button>
            ))}
          </div>
          {errors.accountType && <p className="text-xs text-red-400">{errors.accountType}</p>}
        </div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="space-y-4">
          <AuthInput label="Full name" type="text" placeholder="Jane Smith"
            value={form.name} onChange={e => update('name', e.target.value)}
            error={errors.name} icon={<User className="w-4 h-4" />} autoComplete="name" />
          <AuthInput label="Work email" type="email" placeholder="jane@company.com"
            value={form.email} onChange={e => update('email', e.target.value)}
            error={errors.email} icon={<Mail className="w-4 h-4" />} autoComplete="email" />
          {(accountType === 'corporate' || accountType === 'agency' || accountType === 'startup') && (
            <AuthInput label="Company name" type="text" placeholder="Acme Inc."
              value={form.company} onChange={e => update('company', e.target.value)}
              error={errors.company} icon={<Building2 className="w-4 h-4" />} />
          )}
        </div>
      )}

      {/* Step 2: Password */}
      {step === 2 && (
        <div className="space-y-4">
          <AuthInput label="Create password" type="password" placeholder="Min. 8 characters"
            value={form.password} onChange={e => update('password', e.target.value)}
            error={errors.password} icon={<Lock className="w-4 h-4" />} autoComplete="new-password" />
          <AuthInput label="Confirm password" type="password" placeholder="Repeat your password"
            value={form.confirm} onChange={e => update('confirm', e.target.value)}
            error={errors.confirm} icon={<Lock className="w-4 h-4" />} autoComplete="new-password" />

          {form.password && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition-all ${
                    form.password.length >= i * 3
                      ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-yellow-500' : i <= 3 ? 'bg-blue-500' : 'bg-[#00D4AA]'
                      : 'bg-white/10'
                  }`} />
                ))}
              </div>
              <p className="text-xs text-white/30">
                {form.password.length < 4 ? 'Too short' : form.password.length < 7 ? 'Weak' : form.password.length < 10 ? 'Good' : 'Strong'}
              </p>
            </div>
          )}

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 accent-[#0066FF]" />
            <span className="text-xs text-white/40 leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-white/60 underline underline-offset-2 hover:text-white">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-white/60 underline underline-offset-2 hover:text-white">Privacy Policy</Link>
            </span>
          </label>

          {/* API error */}
          {apiError && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {apiError}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className={`flex gap-3 mt-6 ${step > 0 ? 'justify-between' : ''}`}>
        {step > 0 && (
          <Button variant="outline" size="lg" onClick={() => setStep(s => s - 1)} className="rounded-xl gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        )}
        <Button size="lg" loading={loading} onClick={handleNext}
          className={`rounded-xl gap-2 ${step === 0 ? 'w-full' : 'flex-1'}`}>
          {!loading && (
            <>
              {step === 2 ? 'Create account' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
