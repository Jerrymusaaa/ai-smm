'use client';

import Image from 'next/image';
import { BarChart3, Brain, CalendarDays, Megaphone, Users2, TrendingUp } from 'lucide-react';

const FEATURES = [
  {
    id: 'analytics',
    icon: <BarChart3 className="w-6 h-6" />,
    color: '#C9A84C',
    title: 'Social Media Analytics',
    subtitle: 'Unified cross-platform intelligence',
    description: 'Real-time dashboards tracking engagement, follower growth, reach, and ROI across all connected platforms in one place.',
    image: '/images/Analytics1.jpg',
    imageAlt: 'Social Media Analytics Dashboard',
    stats: [{ label: 'Platforms tracked', value: '23+' }, { label: 'Data points/day', value: '2M+' }, { label: 'Report types', value: '40+' }],
  },
  {
    id: 'content',
    icon: <Brain className="w-6 h-6" />,
    color: '#E8C96A',
    title: 'AI Content Studio',
    subtitle: 'Platform-native content at scale',
    description: 'Generate captions, hashtags, and post variations optimized for each platform\'s unique algorithm and audience behavior.',
    image: '/images/AIcontent3.avif',
    imageAlt: 'AI Content Creation Workspace',
    stats: [{ label: 'Content variations', value: '10x' }, { label: 'Languages', value: '50+' }, { label: 'Avg time saved', value: '14hrs/wk' }],
  },
  {
    id: 'campaigns',
    icon: <Megaphone className="w-6 h-6" />,
    color: '#FF6B35',
    title: 'Campaign Manager',
    subtitle: 'Multi-platform campaign execution',
    description: 'Plan, launch, and monitor campaigns across every platform with AI-driven strategy suggestions and automated scheduling.',
    image: '/images/SMcampaign1.png',
    imageAlt: 'Social Media Campaign Planning',
    stats: [{ label: 'Campaign ROI lift', value: '+280%' }, { label: 'Setup time', value: '-85%' }, { label: 'Platforms', value: 'All' }],
  },
  {
    id: 'influencers',
    icon: <Users2 className="w-6 h-6" />,
    color: '#A855F7',
    title: 'Influencer Marketplace',
    subtitle: 'Find, manage & track collaborations',
    description: 'Discover influencers by niche, audience demographics, and engagement rate. Manage campaigns and track performance automatically.',
    image: '/images/IMP1.webp',
    imageAlt: 'Influencer Marketing Platform',
    stats: [{ label: 'Verified influencers', value: '500K+' }, { label: 'Avg. campaign ROI', value: '6.2x' }, { label: 'Niches covered', value: '200+' }],
  },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
      {/* Text Content */}
      <div className={!isEven ? 'lg:col-start-2' : ''}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-sm font-medium"
          style={{ background: `${feature.color}15`, color: feature.color, border: `1px solid ${feature.color}25` }}>
          <div style={{ color: feature.color }}>{feature.icon}</div>
          {feature.subtitle}
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)' }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {feature.title}
        </h2>

        <p className="text-white/50 text-lg leading-relaxed mb-8">
          {feature.description}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {feature.stats.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 border border-white/[0.06]">
              <div style={{ fontFamily: 'var(--font-display)', color: feature.color }}
                className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>

        <button
          className="text-sm font-medium transition-all duration-200 hover:gap-3 flex items-center gap-2"
          style={{ color: feature.color }}
        >
          Explore {feature.title} →
        </button>
      </div>

      {/* Image Content */}
      <div className={`relative ${!isEven ? 'lg:col-start-1' : ''}`}>
        <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
          style={{ background: `radial-gradient(circle, ${feature.color}, transparent)` }} />
        <div className="relative glass rounded-2xl overflow-hidden border border-white/10 shadow-xl">
          <div className="relative h-64 sm:h-80 lg:h-96">
            <Image
              src={feature.image}
              alt={feature.imageAlt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#C9A84C]/20 mb-6">
            <TrendingUp className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-sm text-white/60">Everything you need</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)' }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Built for modern<br />
            <span className="text-gradient">social media teams</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            From solo creators to enterprise marketing teams — all the tools you need in a single AI-powered platform.
          </p>
        </div>

        {/* Feature blocks */}
        <div className="flex flex-col gap-28 lg:gap-36">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}