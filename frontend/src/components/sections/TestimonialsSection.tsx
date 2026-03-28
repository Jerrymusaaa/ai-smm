'use client';

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Head of Growth, Fintech Startup',
    avatar: 'SC',
    color: '#0066FF',
    quote: 'SocialAI saved our 3-person marketing team 40 hours a week. The AI campaign manager is like having a senior strategist on call 24/7.',
    metric: '340% engagement increase',
  },
  {
    name: 'Marcus Thompson',
    role: 'Founder & Content Creator',
    avatar: 'MT',
    color: '#00D4AA',
    quote: 'I went from spending 3 hours a day on social media to 20 minutes. The AI generates better captions than I do, and it knows exactly when to post.',
    metric: '2.1M new followers in 6 months',
  },
  {
    name: 'Priya Sharma',
    role: 'Digital Marketing Director, Agency',
    avatar: 'PS',
    color: '#FF6B35',
    quote: 'Managing 47 client accounts used to require a full team. Now our 8 people handle it all through SocialAI. The multi-account campaign manager is exceptional.',
    metric: '5x client retention rate',
  },
  {
    name: 'Alex Rivera',
    role: 'E-commerce Brand Owner',
    avatar: 'AR',
    color: '#A855F7',
    quote: 'The influencer marketplace alone paid for our entire annual subscription in the first campaign. The ROI tracking makes it easy to see what\'s actually working.',
    metric: '6.8x ROAS on influencer campaigns',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 style={{ fontFamily: 'var(--font-display)' }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Loved by marketers<br />
            <span className="text-gradient">everywhere</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="glass rounded-2xl p-7 border border-white/[0.06] feature-card"
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `${t.color}20`, border: `1px solid ${t.color}30` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role}</div>
                </div>
              </div>

              <p className="text-white/60 text-sm leading-relaxed mb-5 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg w-fit"
                style={{ background: `${t.color}10`, color: t.color, border: `1px solid ${t.color}20` }}>
                ↑ {t.metric}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}