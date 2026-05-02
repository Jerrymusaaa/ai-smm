'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AuthInput } from '@/components/auth/AuthInput';
import { Mail, Lock, User, Building2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const ACCOUNT_CATEGORIES = [
  {
    id: 'individual',
    label: 'Individual',
    desc: 'Personal brand or solo creator',
    icon: '🎨',
    plans: [
      { id: 'individual_pro', label: 'Individual Pro', price: 'KES 1,999/mo', desc: 'Unlimited AI content, 10 platforms' },
      { id: 'creator', label: 'Creator', price: 'KES 4,999/mo', desc: 'Browse influencer marketplace, A/B testing' },
      { id: 'power_user', label: 'Power User', price: 'KES 9,999/mo', desc: 'Full marketplace access, API, 3 team seats' },
      { id: 'free', label: 'Free Plan', price: 'KES 0', desc: '3 platforms, 3 AI posts/month' },
    ],
  },
  {
    id: 'influencer',
    label: 'Influencer',
    desc: 'Content creator monetizing through brand deals',
    icon: '⭐',
    plans: [
      { id: 'influencer_free', label: 'Free Influencer', price: 'KES 0', desc: '25% commission, 3 platforms, 5 posts/mo' },
      { id: 'influencer_starter', label: 'Starter', price: 'KES 1,999/mo', desc: '20% commission, standard marketplace priority' },
      { id: 'influencer_pro', label: 'Influencer Pro', price: 'KES 4,999/mo', desc: '15% commission, high priority listing' },
      { id: 'creator_mode', label: 'Creator Mode', price: 'KES 9,999/mo', desc: '10% commission, top priority, instant payouts' },
    ],
  },
  {
    id: 'business',
    label: 'Business / SME',
    desc: 'Small business or growing company',
    icon: '🚀',
    plans: [
      { id: 'sme', label: 'SME Plan', price: 'KES 9,999/mo', desc: '5 seats, full marketplace access' },
      { id: 'growing', label: 'Growing Business', price: 'KES 29,000–49,000/mo', desc: '10–25 seats, custom AI, IRM tools' },
    ],
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    desc: 'Large company or marketing agency',
    icon: '🏢',
    plans: [
      { id: 'enterprise', label: 'Enterprise', price: 'KES 80,000–300,000/mo', desc: 'Unlimited seats, dedicated infrastructure, white-label' },
    ],
  },
];

const STEPS = ['Account type', 'Choose plan', 'Your details', 'Set password'];

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [plan, setPlan] = useState('');
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [done, setDone] = useState(false);

  const selectedCategory = ACCOUNT_CATEGORIES.find(c => c.id === category);
  const update = (field: string, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0 && !category) e.category = 'Please select an account type';
    if (step === 1 && !plan) e.plan = 'Please select a plan';
    if (step === 2) {
      if (!form.name.trim()) e.name = 'Full name is required';
      if (!form.email) e.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    }
    if (step === 3) {
      if (!form.password) e.password = 'Password is required';
      else if (form.password.length < 8) e.password = 'At least 8 characters required';
      if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (step < 3) { setStep(s => s + 1); return; }
    setApiError('');
    try {
      await register({ email: form.email, password: form.password, name: form.name, accountType: category });
      setDone(true);
    } catch (error: any) {
      setApiError(error.message || 'Registration failed. Please try again.');
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-[#E8C96A]/20 border border-[#E8C96A]/30 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[#E8C96A]" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-white mb-3">Check your email</h2>
        <p className="text-white/50 text-sm mb-2">We sent a verification link to</p>
        <p className="text-white font-medium text-sm mb-6">{form.email}</p>
        <p className="text-white/30 text-xs mb-8 max-w-xs mx-auto">Click the link to activate your account. Check your spam folder if you don't see it.</p>
        <Button variant="outline" size="md" onClick={() => router.push('/login')} className="rounded-xl">Go to login</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white mb-2">Create your account</h1>
        <p className="text-white/40 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-[#C9A84C] hover:text-[#3385FF] font-medium">Sign in</Link>
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              i < step ? 'bg-[#E8C96A] text-white' : i === step ? 'bg-[#C9A84C] text-white' : 'bg-white/10 text-white/30'
            }`}>
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-white' : 'text-white/30'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-white/10 ml-1" />}
          </div>
        ))}
      </div>

      {/* Step 0 — Account Category */}
      {step === 0 && (
        <div className="space-y-3">
          <p className="text-xs text-white/40 mb-4">What best describes you?</p>
          {ACCOUNT_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { setCategory(cat.id); setErrors({}); }}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                category === cat.id ? 'border-[#C9A84C]/60 bg-[#C9A84C]/10' : 'border-white/10 bg-white/[0.04] hover:border-white/20'
              }`}>
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <div className={`text-sm font-semibold ${category === cat.id ? 'text-[#C9A84C]' : 'text-white'}`}>{cat.label}</div>
                <div className="text-xs text-white/40 mt-0.5">{cat.desc}</div>
              </div>
              {category === cat.id && <Check className="w-4 h-4 text-[#C9A84C] ml-auto flex-shrink-0" />}
            </button>
          ))}
          {errors.category && <p className="text-xs text-red-400">{errors.category}</p>}
        </div>
      )}

      {/* Step 1 — Plan Selection */}
      {step === 1 && selectedCategory && (
        <div className="space-y-3">
          <p className="text-xs text-white/40 mb-4">Choose your {selectedCategory.label} plan — upgrade anytime</p>
          {selectedCategory.plans.map(p => (
            <button key={p.id} onClick={() => { setPlan(p.id); setErrors({}); }}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                plan === p.id ? 'border-[#C9A84C]/60 bg-[#C9A84C]/10' : 'border-white/10 bg-white/[0.04] hover:border-white/20'
              }`}>
              <div className="flex items-center justify-between">
                <div className={`text-sm font-semibold ${plan === p.id ? 'text-[#C9A84C]' : 'text-white'}`}>{p.label}</div>
                <div className="text-xs font-bold text-[#E8C96A]">{p.price}</div>
              </div>
              <div className="text-xs text-white/40 mt-1">{p.desc}</div>
            </button>
          ))}
          <div className="pt-2">
            <p className="text-xs text-white/30 text-center">7-day free trial available on all paid plans • No credit card required</p>
          </div>
          {errors.plan && <p className="text-xs text-red-400">{errors.plan}</p>}
        </div>
      )}

      {/* Step 2 — Details */}
      {step === 2 && (
        <div className="space-y-4">
          <AuthInput label="Full name" type="text" placeholder="Jane Smith"
            value={form.name} onChange={e => update('name', e.target.value)}
            error={errors.name} icon={<User className="w-4 h-4" />} autoComplete="name" />
          <AuthInput label="Email address" type="email" placeholder="jane@company.com"
            value={form.email} onChange={e => update('email', e.target.value)}
            error={errors.email} icon={<Mail className="w-4 h-4" />} autoComplete="email" />
          {(category === 'business' || category === 'enterprise') && (
            <AuthInput label="Company name" type="text" placeholder="Acme Ltd."
              value={form.company} onChange={e => update('company', e.target.value)}
              error={errors.company} icon={<Building2 className="w-4 h-4" />} />
          )}
        </div>
      )}

      {/* Step 3 — Password */}
      {step === 3 && (
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
                      ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-yellow-500' : i <= 3 ? 'bg-[#C9A84C]' : 'bg-[#E8C96A]'
                      : 'bg-white/10'
                  }`} />
                ))}
              </div>
              <p className="text-xs text-white/30">
                {form.password.length < 4 ? 'Too short' : form.password.length < 7 ? 'Weak' : form.password.length < 10 ? 'Good' : 'Strong'}
              </p>
            </div>
          )}
          {apiError && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{apiError}</div>
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
        <Button size="lg" loading={isLoading} onClick={handleNext}
          className={`rounded-xl gap-2 ${step === 0 ? 'w-full' : 'flex-1'}`}>
          {!isLoading && <>{step === 3 ? 'Create account' : 'Continue'}<ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </div>
  );
}
