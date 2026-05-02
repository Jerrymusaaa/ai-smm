'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Menu, X, Zap } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '/docs' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled ? 'bg-[#050A14]/90 backdrop-blur-xl border-b border-white/[0.06] py-3' : 'py-5'
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] flex items-center justify-center shadow-lg shadow-yellow-600/30 group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)' }} className="text-white font-700 text-lg tracking-tight">
            Yoyzie AI<span className="text-[#C9A84C]">.</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-150 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors font-medium px-4 py-2">
            Sign in
          </Link>
          <Button size="sm" className="rounded-xl">
            Start free →
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#050A14]/98 backdrop-blur-xl border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-3 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2 mt-2">
              <Link href="/login" className="px-4 py-3 text-sm text-white/70 hover:text-white text-center">Sign in</Link>
              <Button size="md" className="w-full">Start free →</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}