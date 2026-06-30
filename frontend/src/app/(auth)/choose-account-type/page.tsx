'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const ACCOUNT_TYPES = [
  {
    id: 'individual', label: 'Individual', icon: '🎨',
    desc: 'I create content for myself or my personal brand',
    examples: 'Bloggers, vloggers, personal brands',
  },
  {
    id: 'influencer', label: 'Influencer', icon: '⭐',
    desc: 'I want to monetize my following through brand campaigns',
    examples: 'Content creators, social media personalities',
  },
  {
    id: 'business', label: 'Small Business / SME', icon: '🚀',
    desc: 'I run a small business and need social media management',
    examples: 'SMEs, startups, local businesses',
  },
  {
    id: 'enterprise', label: 'Corporate / Agency', icon: '🏢',
    desc: 'I manage social media for a large company or multiple clients',
    examples: 'Enterprises, marketing agencies, large teams',
  },
];

const NICHES = [
  'Fashion & Beauty', 'Food & Lifestyle', 'Tech & Gadgets', 'Finance & Business',
  'Travel & Adventure', 'Health & Fitness', 'Entertainment', 'Education',
  'Gaming', 'Parenting & Family', 'Sports', 'Art & Design',
];

export default function ChooseAccountTypePage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [selected, setSelected] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const needsBusinessName = selected === 'business' || selected === 'enterprise';
  const needsNiche = selected === 'influencer' || selected === 'business' || selected === 'enterprise';

  const handleContinue = async () => {
    if (!selected) { setError('Please select an account type'); return; }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/complete-onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ accountType: selected, businessName, niche }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      updateUser({ accountType: selected.toUpperCase() });
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #070A0F 0%, #0A0A0A 50%, #0A0F1A 100%)' }}>

      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4"
            style={{ border: '1px solid rgba(201,168,76,0.4)', boxShadow: '0 0 40px rgba(201,168,76,0.15)' }}>
            <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" width={64} height={64} className="object-cover w-full h-full" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-white mb-1">
            Welcome to Yoyzie AI{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Tell us how you&apos;ll be using the platform
          </p>
        </div>

        {/* Account type cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {ACCOUNT_TYPES.map(type => (
            <button key={type.id} onClick={() => { setSelected(type.id); setError(''); }}
              className="p-5 rounded-2xl border text-left transition-all relative"
              style={{
                borderColor: selected === type.id ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)',
                background: selected === type.id ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
              }}>
              {selected === type.id && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)' }}>
                  <Check className="w-3 h-3 text-black" />
                </div>
              )}
              <div className="text-3xl mb-3">{type.icon}</div>
              <p className="text-base font-semibold mb-1"
                style={{ color: selected === type.id ? '#E8C96A' : 'white' }}>
                {type.label}
              </p>
              <p className="text-xs mb-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {type.desc}
              </p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {type.examples}
              </p>
            </button>
          ))}
        </div>

        {/* Conditional fields */}
        {needsBusinessName && (
          <div className="mb-4">
            <label className="text-xs block mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {selected === 'enterprise' ? 'Company / Agency name' : 'Business name'}
            </label>
            <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)}
              placeholder="e.g. Acme Kenya Ltd"
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none border transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.2)' }} />
          </div>
        )}

        {needsNiche && (
          <div className="mb-6">
            <label className="text-xs block mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {selected === 'influencer' ? 'What niche best describes your content?' : 'What industry are you in?'}
            </label>
            <div className="flex flex-wrap gap-2">
              {NICHES.map(n => (
                <button key={n} onClick={() => setNiche(n)}
                  className="px-3 py-1.5 rounded-xl text-xs border transition-all"
                  style={{
                    borderColor: niche === n ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)',
                    background: niche === n ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.02)',
                    color: niche === n ? '#E8C96A' : 'rgba(255,255,255,0.5)',
                  }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
            {error}
          </div>
        )}

        <button onClick={handleContinue} disabled={loading || !selected}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold transition-all disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue to dashboard <ArrowRight className="w-5 h-5" /></>}
        </button>
      </div>
    </div>
  );
}
