import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--brand-dark)' }}>
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #0D1525 0%, #050A14 100%)' }}>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-60" />
        
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-20"
          style={{ background: 'radial-gradient(circle, #0066FF, transparent)' }} />

        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00D4AA] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)' }} className="text-white font-bold text-xl">
              Yoyzie AI<span className="text-[#0066FF]">.</span>
            </span>
          </Link>

          {/* Middle content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-10">
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
                Your AI-powered<br />
                <span className="text-gradient">social media team</span>
              </h2>
              <p className="text-white/50 text-base leading-relaxed max-w-sm">
                One platform to create content, schedule posts, run campaigns, and analyze performance across 23+ networks.
              </p>
            </div>

            {/* Social proof stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { value: '18K+', label: 'Active users' },
                { value: '23+', label: 'Platforms' },
                { value: '+340%', label: 'Avg. engagement' },
              ].map(s => (
                <div key={s.label} className="glass rounded-xl p-4 border border-white/[0.06]">
                  <div style={{ fontFamily: 'var(--font-display)', color: '#0066FF' }}
                    className="text-xl font-bold mb-1">{s.value}</div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="glass rounded-2xl p-5 border border-white/[0.06]">
              <p className="text-white/60 text-sm leading-relaxed mb-4 italic">
                &ldquo;Yoyzie AI cut our content creation time by 80%. Our engagement tripled in the first month.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00D4AA] flex items-center justify-center text-xs font-bold text-white">
                  SC
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Sarah Chen</div>
                  <div className="text-xs text-white/40">Head of Growth, TechCorp</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <p className="text-white/20 text-xs">© 2025 Yoyzie AI. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066FF] to-[#00D4AA] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)' }} className="text-white font-bold text-lg">
              Yoyzie AI<span className="text-[#0066FF]">.</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
