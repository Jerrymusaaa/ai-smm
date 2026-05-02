'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Check, Zap, BarChart3, Calendar,
  Users, Brain, Globe, ChevronRight, Star, Shield,
  TrendingUp, Sparkles, Menu, X
} from 'lucide-react';

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'border-b' : ''
    }`} style={{
      background: scrolled ? 'rgba(7,10,15,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderColor: 'rgba(201,168,76,0.15)',
    }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
            style={{ border: '1px solid rgba(201,168,76,0.35)' }}>
            <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', color: '#E8C96A' }}
            className="text-xl font-bold tracking-tight">
            Yoyzie AI
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'Influencers', 'About'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-sm text-white/60 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"
            className="text-sm px-4 py-2 rounded-xl text-white/70 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link href="/signup"
            className="text-sm px-5 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0A0A0A' }}>
            Get started free
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white/60">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 space-y-3"
          style={{ background: 'rgba(7,10,15,0.98)', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          {['Features', 'Pricing', 'Influencers', 'About'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="block text-sm text-white/60 py-2" onClick={() => setMobileOpen(false)}>
              {item}
            </a>
          ))}
          <Link href="/signup"
            className="block text-center text-sm px-5 py-3 rounded-xl font-semibold mt-4"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0A0A0A' }}>
            Get started free
          </Link>
        </div>
      )}
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: 'linear-gradient(180deg, #070A0F 0%, #0A0F1A 50%, #070A0F 100%)' }}>

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #C9A84C, transparent 70%)' }} />
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full opacity-60 animate-pulse"
          style={{ background: '#C9A84C' }} />
        <div className="absolute top-40 right-20 w-1 h-1 rounded-full opacity-40 animate-pulse"
          style={{ background: '#E8C96A', animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 rounded-full opacity-50 animate-pulse"
          style={{ background: '#C9A84C', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 border"
          style={{ background: 'rgba(201,168,76,0.08)', borderColor: 'rgba(201,168,76,0.25)', color: '#E8C96A' }}>
          <Sparkles className="w-3.5 h-3.5" />
          Kenya&apos;s first AI social media platform
          <ChevronRight className="w-3.5 h-3.5" />
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl"
            style={{ border: '1px solid rgba(201,168,76,0.4)', boxShadow: '0 0 60px rgba(201,168,76,0.2)' }}>
            <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" width={96} height={96} className="object-cover w-full h-full" />
          </div>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--font-display)' }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Your AI Social Media{' '}
          <span style={{
            background: 'linear-gradient(135deg, #E8C96A, #C9A84C, #8B6914)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Command Center
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
          Schedule posts, generate AI content, find influencers, detect trending Kenyan hashtags,
          and grow your audience — all from one intelligent platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/signup"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0A0A0A', boxShadow: '0 8px 32px rgba(201,168,76,0.35)' }}>
            Start for free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-medium border transition-all hover:border-white/30 hover:bg-white/[0.04]"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>
            Sign in to dashboard
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/30">
          {['No credit card required', '7-day free trial', 'Cancel anytime', 'KES pricing'].map((item, i) => (
            <div key={item} className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI Content Studio',
      desc: 'Generate captions, hashtags, and post ideas optimized for each platform. Kenyan trends detected in real-time.',
      color: '#C9A84C',
    },
    {
      icon: TrendingUp,
      title: 'Kenyan Trend Detection',
      desc: 'Real-time trending hashtags and sounds on TikTok, Instagram, and X — in English, Swahili, and Sheng.',
      color: '#E8C96A',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduler',
      desc: 'AI recommends the best posting times for your Kenyan audience. Drag-and-drop calendar with bulk scheduling.',
      color: '#C9A84C',
    },
    {
      icon: BarChart3,
      title: 'Unified Analytics',
      desc: 'Track growth, engagement, and reach across all platforms. AI-generated weekly performance summaries.',
      color: '#E8C96A',
    },
    {
      icon: Users,
      title: 'Influencer Marketplace',
      desc: 'Discover and hire Kenyan influencers by niche. Bot detection scores and click-to-view ratios on every profile.',
      color: '#C9A84C',
    },
    {
      icon: Shield,
      title: 'Bot Detection',
      desc: 'Know if an influencer\'s audience is real before you pay. AI-powered authenticity scoring on every account.',
      color: '#E8C96A',
    },
  ];

  return (
    <section id="features" className="py-24" style={{ background: '#070A0F' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4 border"
            style={{ background: 'rgba(201,168,76,0.08)', borderColor: 'rgba(201,168,76,0.2)', color: '#E8C96A' }}>
            <Zap className="w-3 h-3" /> Powered by AI
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)' }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything you need to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #E8C96A, #C9A84C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              dominate social media
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Built specifically for Kenyan creators, businesses, and brands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title}
              className="group p-6 rounded-2xl border transition-all hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.1)',
                boxShadow: '0 0 0 rgba(201,168,76,0)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(201,168,76,0.3)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(201,168,76,0.1)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(201,168,76,0.1)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 rgba(201,168,76,0)';
              }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}25` }}>
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)' }}
                className="text-base font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Platforms ─────────────────────────────────────────────────────────────────
function Platforms() {
  const platforms = [
    'Instagram', 'TikTok', 'LinkedIn', 'X / Twitter', 'Facebook', 'YouTube',
    'Pinterest', 'Threads', 'Snapchat', 'Reddit', 'Discord', 'Telegram',
    'WhatsApp', 'Bluesky', 'Mastodon', 'Tumblr', 'WordPress', 'Nextdoor',
    'Slack', 'Google Business', 'Blogger', 'Stocktwits', 'RSS',
  ];

  return (
    <section className="py-20 overflow-hidden" style={{ background: '#0A0F1A' }}>
      <div className="max-w-7xl mx-auto px-6 text-center mb-12">
        <h2 style={{ fontFamily: 'var(--font-display)' }}
          className="text-3xl font-bold text-white mb-3">
          One platform. <span style={{ color: '#E8C96A' }}>23+ networks.</span>
        </h2>
        <p className="text-white/40 text-sm">Connect all your social accounts and manage everything from one dashboard.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto px-6">
        {platforms.map((p) => (
          <div key={p}
            className="px-4 py-2 rounded-xl text-sm text-white/60 border transition-all hover:text-white/80"
            style={{ background: 'rgba(201,168,76,0.04)', borderColor: 'rgba(201,168,76,0.12)' }}>
            {p}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Pricing ────────────────────────────────────────────────────────────────────
function Pricing() {
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly');
  const [view, setView] = useState<'individual' | 'influencer' | 'business'>('individual');

  const PLANS = {
    individual: [
      {
        name: 'Free', price: { monthly: 0, annual: 0 }, color: '#888888',
        desc: 'Try Yoyzie AI',
        features: ['3 social platforms', '3 AI posts/month', 'Basic analytics (7 days)', '10 scheduled posts/month'],
        cta: 'Get started free', highlight: false,
      },
      {
        name: 'Individual Pro', price: { monthly: 1999, annual: 1499 }, color: '#C9A84C',
        desc: 'For solo creators',
        features: ['10 platforms', 'Unlimited AI content', '90-day analytics', 'Kenyan trend detection', 'Priority support'],
        cta: 'Start 7-day trial', highlight: false,
      },
      {
        name: 'Creator', price: { monthly: 4999, annual: 3749 }, color: '#E8C96A',
        desc: 'For serious creators',
        features: ['Everything in Pro', 'Browse influencer marketplace', 'A/B post testing', 'Competitor analysis', '3 brand accounts'],
        cta: 'Start 7-day trial', highlight: true,
      },
      {
        name: 'Power User', price: { monthly: 9999, annual: 7499 }, color: '#C9A84C',
        desc: 'Run full campaigns',
        features: ['Everything in Creator', 'Hire influencers', 'Post campaign briefs', '3 team seats', 'Full API access'],
        cta: 'Start 7-day trial', highlight: false,
      },
    ],
    influencer: [
      {
        name: 'Free', price: { monthly: 0, annual: 0 }, color: '#888888',
        desc: '25% commission rate',
        features: ['3 platforms', '5 posts/month', 'Low marketplace priority', 'Low-paying jobs only', 'M-Pesa wallet'],
        cta: 'Join free', highlight: false,
      },
      {
        name: 'Starter', price: { monthly: 1999, annual: 1499 }, color: '#C9A84C',
        desc: '20% commission rate',
        features: ['5 platforms', '20 posts/month', 'Standard marketplace priority', 'Mid-tier campaigns', 'Full wallet (M-Pesa, PayPal, bank)'],
        cta: 'Start 7-day trial', highlight: false,
      },
      {
        name: 'Influencer Pro', price: { monthly: 4999, annual: 3749 }, color: '#E8C96A',
        desc: '15% commission rate',
        features: ['10 platforms', 'Unlimited posts', 'HIGH marketplace priority', 'All campaign tiers', 'Full bot detection', 'Verified badge'],
        cta: 'Start 7-day trial', highlight: true,
      },
      {
        name: 'Creator Mode', price: { monthly: 9999, annual: 7499 }, color: '#C9A84C',
        desc: '10% commission rate',
        features: ['Everything in Pro', 'TOP marketplace priority', 'Premium campaigns first', 'Instant payouts', 'Personal brand strategy'],
        cta: 'Start 7-day trial', highlight: false,
      },
    ],
    business: [
      {
        name: 'SME', price: { monthly: 9999, annual: 7499 }, color: '#C9A84C',
        desc: 'Small businesses',
        features: ['All 23 platforms', '5 team seats', '5 brand profiles', 'Full influencer marketplace', 'Campaign brief board', 'Priority support'],
        cta: 'Start 10-day trial', highlight: false,
      },
      {
        name: 'Growing Business', price: { monthly: 29000, annual: 21750 }, color: '#E8C96A',
        desc: 'Up to 10 team members',
        features: ['Everything in SME', '10 team seats', '10 brand profiles', 'Custom AI training', 'Influencer CRM', 'CRM integrations'],
        cta: 'Start 10-day trial', highlight: true,
      },
      {
        name: 'Scale', price: { monthly: 49000, annual: 36750 }, color: '#C9A84C',
        desc: 'Up to 25 team members',
        features: ['Everything in Growing', '25 team seats', '20 brand profiles', 'Custom KPI dashboards', 'Quarterly strategy sessions'],
        cta: 'Start 10-day trial', highlight: false,
      },
      {
        name: 'Enterprise', price: { monthly: 80000, annual: 60000 }, color: '#888888',
        desc: 'Unlimited everything',
        features: ['Unlimited team seats', 'Dedicated infrastructure', 'Custom AI training', 'SSO/SAML', '99.9% SLA', '24/7 dedicated support'],
        cta: 'Contact sales', highlight: false,
      },
    ],
  };

  const currentPlans = PLANS[view];
  const saving = cycle === 'annual' ? 25 : 0;

  return (
    <section id="pricing" className="py-24" style={{ background: '#070A0F' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4 border"
            style={{ background: 'rgba(201,168,76,0.08)', borderColor: 'rgba(201,168,76,0.2)', color: '#E8C96A' }}>
            <Star className="w-3 h-3" /> Kenya-first pricing in KES
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)' }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #E8C96A, #C9A84C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              transparent pricing
            </span>
          </h2>
          <p className="text-white/50 mb-8">No hidden fees. All prices in Kenyan Shillings. Pay via M-Pesa, card, or PayPal.</p>

          {/* View toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-1 p-1 rounded-xl border"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(201,168,76,0.15)' }}>
              {(['individual', 'influencer', 'business'] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className="px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                  style={{
                    background: view === v ? 'rgba(201,168,76,0.15)' : 'transparent',
                    color: view === v ? '#E8C96A' : 'rgba(255,255,255,0.4)',
                    border: view === v ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
                  }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Billing cycle toggle */}
          <div className="flex justify-center">
            <div className="flex gap-1 p-1 rounded-xl border"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(201,168,76,0.15)' }}>
              <button onClick={() => setCycle('monthly')}
                className="px-4 py-1.5 rounded-lg text-sm transition-all"
                style={{
                  background: cycle === 'monthly' ? 'rgba(201,168,76,0.12)' : 'transparent',
                  color: cycle === 'monthly' ? '#E8C96A' : 'rgba(255,255,255,0.4)',
                }}>
                Monthly
              </button>
              <button onClick={() => setCycle('annual')}
                className="px-4 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2"
                style={{
                  background: cycle === 'annual' ? 'rgba(201,168,76,0.12)' : 'transparent',
                  color: cycle === 'annual' ? '#E8C96A' : 'rgba(255,255,255,0.4)',
                }}>
                Annual
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(0,212,170,0.2)', color: '#E8C96A' }}>
                  Save 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {currentPlans.map((plan) => (
            <div key={plan.name}
              className="relative rounded-2xl p-6 flex flex-col transition-all"
              style={{
                background: plan.highlight ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
                border: plan.highlight ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: plan.highlight ? '0 0 40px rgba(201,168,76,0.1)' : 'none',
              }}>

              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0A0A0A' }}>
                  Most popular
                </div>
              )}

              <div className="mb-5">
                <div className="text-xs font-semibold mb-1" style={{ color: plan.color }}>{plan.name}</div>
                <div className="text-[11px] text-white/40 mb-4">{plan.desc}</div>
                <div style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white">
                  {plan.price.monthly === 0 ? (
                    <span>Free</span>
                  ) : (
                    <>
                      KES {(cycle === 'annual' ? plan.price.annual : plan.price.monthly).toLocaleString()}
                      <span className="text-sm font-normal text-white/40">/mo</span>
                    </>
                  )}
                </div>
                {cycle === 'annual' && plan.price.monthly > 0 && (
                  <div className="text-[11px] mt-1" style={{ color: '#E8C96A' }}>
                    Save KES {(plan.price.monthly - plan.price.annual).toLocaleString()}/month
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/60">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.cta === 'Contact sales' ? 'mailto:hello@yoyzie.ai' : '/signup'}
                className="w-full py-3 rounded-xl text-xs font-semibold text-center transition-all block hover:opacity-90"
                style={plan.highlight ? {
                  background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
                  color: '#0A0A0A',
                } : {
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  color: '#E8C96A',
                }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Payment methods note */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-xs text-white/30">
          {['M-Pesa', 'Visa / Mastercard', 'PayPal', 'Bank Transfer'].map(method => (
            <div key={method} className="flex items-center gap-1.5">
              <Check className="w-3 h-3" style={{ color: '#C9A84C' }} />
              {method}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ────────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#0A0F1A' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(ellipse, #C9A84C, transparent 70%)' }} />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(201,168,76,0.4)', boxShadow: '0 0 40px rgba(201,168,76,0.2)' }}>
            <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" width={64} height={64} className="object-cover w-full h-full" />
          </div>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)' }}
          className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Ready to grow with{' '}
          <span style={{
            background: 'linear-gradient(135deg, #E8C96A, #C9A84C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Yoyzie AI?
          </span>
        </h2>
        <p className="text-white/50 text-lg mb-10">
          Join Kenyan creators, businesses, and agencies already using Yoyzie AI to dominate social media.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0A0A0A', boxShadow: '0 8px 32px rgba(201,168,76,0.3)' }}>
            Start for free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-medium border transition-all hover:border-white/30"
            style={{ borderColor: 'rgba(201,168,76,0.2)', color: 'rgba(255,255,255,0.6)' }}>
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t py-12" style={{ background: '#070A0F', borderColor: 'rgba(201,168,76,0.1)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.3)' }}>
              <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" width={32} height={32} className="object-cover w-full h-full" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', color: '#E8C96A' }} className="font-bold">Yoyzie AI</span>
          </div>
          <p className="text-xs text-white/30 text-center">
            © {new Date().getFullYear()} Yoyzie AI. Kenya&apos;s first AI-powered social media management platform.
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <a href="mailto:hello@yoyzie.ai" className="hover:text-white/60 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Platforms />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
