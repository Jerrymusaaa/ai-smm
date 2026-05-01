import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#070A0F' }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #111827 50%, #0A0F1A 100%)' }}>

        {/* Gold circuit decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #E8C96A, transparent)' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border"
              style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
              <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" width={40} height={40} className="object-cover" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', color: '#E8C96A' }}
              className="text-xl font-bold">
              Yoyzie AI
            </span>
          </Link>
        </div>

        {/* Center logo large */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-48 h-48 rounded-3xl overflow-hidden mb-8 gold-glow"
            style={{ border: '1px solid rgba(201,168,76,0.3)' }}>
            <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" width={192} height={192} className="object-cover" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)' }}
            className="text-3xl font-bold mb-3 gold-text">
            Kenya&apos;s First AI Social Media Management Platform
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Grow your audience, monetize your influence, and run world-class marketing campaigns — all powered by AI.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '23+', label: 'Platforms' },
            { value: 'AI', label: 'Powered' },
            { value: 'KES', label: 'Local pricing' },
          ].map(stat => (
            <div key={stat.label} className="text-center p-3 rounded-xl"
              style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <div style={{ fontFamily: 'var(--font-display)', color: '#E8C96A' }}
                className="text-lg font-bold">{stat.value}</div>
              <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl overflow-hidden border"
              style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
              <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" width={36} height={36} className="object-cover" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', color: '#E8C96A' }}
              className="text-lg font-bold">
              Yoyzie AI
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
