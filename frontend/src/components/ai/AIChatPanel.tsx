'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Loader2, Bot, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  'Write me an Instagram caption for my new product launch',
  'What are trending hashtags in Kenya right now?',
  'Best time to post on TikTok for a Kenyan audience?',
  'Help me write a campaign brief for a food brand',
  'Generate a 1-week content calendar for my business',
];

export function AIChatPanel({ onClose }: { onClose?: () => void }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Habari ${user?.name?.split(' ')[0] || ''}! 👋 I'm your Yoyzie AI assistant. I know the Kenyan social media scene inside out — ask me to write captions, find trending hashtags, build content calendars, or anything else social media related!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMessage: Message = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            messages: apiMessages,
            userContext: {
              name: user?.name,
              accountType: user?.accountType,
              plan: user?.plan,
            },
          }),
        }
      );

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.data?.reply || 'Sorry, I could not process that. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Connection error. Please check your internet and try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border overflow-hidden"
      style={{ background: '#0A0A0A', borderColor: 'rgba(201,168,76,0.15)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(201,168,76,0.1)', background: 'rgba(201,168,76,0.04)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)' }}>
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)' }}
              className="text-sm font-bold text-white">Yoyzie AI</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Kenya social media expert
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.3)' }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={msg.role === 'assistant'
                ? { background: 'linear-gradient(135deg,#C9A84C,#E8C96A)' }
                : { background: 'rgba(255,255,255,0.1)' }}>
              {msg.role === 'assistant'
                ? <Bot className="w-3.5 h-3.5 text-black" />
                : <User className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
            }`}
              style={msg.role === 'assistant'
                ? { background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', color: 'rgba(255,255,255,0.85)' }
                : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className="text-[10px] mt-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {msg.timestamp.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)' }}>
              <Bot className="w-3.5 h-3.5 text-black" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm border"
              style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.15)' }}>
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#C9A84C' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts (show only at start) */}
      {messages.length === 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map(p => (
            <button key={p} onClick={() => sendMessage(p)}
              className="text-[11px] px-3 py-1.5 rounded-full border transition-all"
              style={{
                borderColor: 'rgba(201,168,76,0.2)',
                background: 'rgba(201,168,76,0.06)',
                color: 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)';
                (e.currentTarget as HTMLElement).style.color = '#E8C96A';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
              }}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t flex-shrink-0"
        style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask me anything about social media..."
            rows={1}
            className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm text-white outline-none border transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderColor: 'rgba(201,168,76,0.15)',
              maxHeight: '120px',
            }}
            onInput={e => {
              const el = e.target as HTMLTextAreaElement;
              el.style.height = 'auto';
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)' }}>
            <Send className="w-4 h-4 text-black" />
          </button>
        </div>
        <p className="text-[10px] mt-2 text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Powered by Claude · Kenyan social media expert
        </p>
      </div>
    </div>
  );
}
