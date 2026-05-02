'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const DEMO_MESSAGES = [
  { role: 'user', text: 'Create a campaign for our new product launch targeting Gen Z on TikTok and Instagram.' },
  { role: 'ai', text: 'I\'ll set up a 2-week campaign with 14 posts across TikTok and Instagram. Here\'s the strategy:\n\n• **Awareness phase (Days 1-7)**: 3 TikTok Reels/day + 2 Instagram Stories\n• **Conversion phase (Days 8-14)**: Retargeting posts with clear CTAs\n\nShall I generate the first batch of captions?' },
  { role: 'user', text: 'Yes, generate 5 TikTok captions. Keep them trendy and under 150 chars.' },
  { role: 'ai', text: '✅ Generated 5 TikTok captions with trending hashtags. Ready to schedule?\n\n**Best times to post**: 6pm, 8pm, 10pm EST based on your audience analytics.' },
];

const QUICK_PROMPTS = [
  'Analyze my best performing posts',
  'Schedule posts for next week',
  'Find trending hashtags in my niche',
  'Generate Instagram captions',
];

export function AIAssistantSection() {
  const [input, setInput] = useState('');

  return (
    <section id="ai-assistant" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[80px] opacity-10 rounded-full"
        style={{ background: 'radial-gradient(circle, #E8C96A, transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#E8C96A]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#E8C96A]" />
              <span className="text-sm text-white/60">Conversational AI</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)' }}
              className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Just tell your AI<br />
              <span style={{ color: '#E8C96A' }}>what to do</span>
            </h2>
            <p className="text-white/50 text-lg mb-8 leading-relaxed">
              No complex dashboards to learn. Just describe what you want — campaigns, content, scheduling, analytics — in plain language. Your AI social media manager handles the rest.
            </p>
            
            {/* Content Studio image */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 h-48 mb-8">
              <Image
                src="/images/AIcontent3.avif"
                alt="AI Content Creation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-end p-4">
                <div>
                  <div className="text-xs text-white/50 mb-1">AI Content Studio</div>
                  <div className="text-white font-medium text-sm">Generate, edit & schedule in one flow</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p)}
                  className="px-3 py-1.5 rounded-full text-xs glass border border-white/10 text-white/50 hover:text-white hover:border-[#E8C96A]/30 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Chat UI */}
          <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Yoyzie AI Assistant</div>
                <div className="flex items-center gap-1.5 text-xs text-[#E8C96A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8C96A] pulse-dot inline-block" />
                  Active — analyzing your accounts
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-5 space-y-4 h-72 overflow-y-auto">
              {DEMO_MESSAGES.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#C9A84C] text-white rounded-br-sm'
                      : 'bg-white/[0.06] text-white/80 rounded-bl-sm border border-white/[0.06]'
                  }`}>
                    {msg.text.split('\n').map((line, j) => (
                      <p key={j} className={j > 0 ? 'mt-1' : ''}
                        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 bg-white/[0.05] rounded-xl border border-white/10 px-4 py-3">
                <input
                  type="text"
                  placeholder="Tell your AI what to do..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                />
                <button className="w-8 h-8 rounded-lg bg-[#C9A84C] flex items-center justify-center hover:bg-[#0052CC] transition-colors flex-shrink-0">
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}