'use client';

import { useState } from 'react';
import { CreditCard, Plus, Trash2, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CARDS = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '04/27', isDefault: true, color: '#1A1F71' },
  { id: '2', brand: 'Mastercard', last4: '5555', expiry: '09/26', isDefault: false, color: '#EB001B' },
];

const BRAND_ICONS: Record<string, string> = {
  Visa: '💳',
  Mastercard: '💳',
  Amex: '💳',
};

export function PaymentMethod() {
  const [cards, setCards] = useState(CARDS);
  const [adding, setAdding] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const setDefault = (id: string) =>
    setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));

  const removeCard = (id: string) =>
    setCards(prev => prev.filter(c => c.id !== id));

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Payment methods
          </h3>
          <p className="text-xs text-white/40 mt-0.5">Manage your saved cards</p>
        </div>
        <button onClick={() => setAdding(!adding)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all">
          <Plus className="w-3.5 h-3.5" /> Add card
        </button>
      </div>

      <div className="p-5 space-y-3">
        {/* Existing cards */}
        {cards.map(card => (
          <div key={card.id}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              card.isDefault
                ? 'border-[#0066FF]/30 bg-[#0066FF]/05'
                : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15'
            }`}>
            {/* Card visual */}
            <div className="w-12 h-8 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {BRAND_ICONS[card.brand] || '💳'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{card.brand}</span>
                <span className="text-sm text-white/50">•••• {card.last4}</span>
                {card.isDefault && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0066FF]/20 text-[#0066FF] font-medium">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-white/30 mt-0.5">Expires {card.expiry}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {!card.isDefault && (
                <button onClick={() => setDefault(card.id)}
                  className="text-xs text-white/40 hover:text-[#0066FF] transition-colors px-2 py-1 rounded-lg hover:bg-[#0066FF]/10">
                  Set default
                </button>
              )}
              {!card.isDefault && (
                <button onClick={() => removeCard(card.id)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add new card form */}
        {adding && (
          <div className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-3">
            <p className="text-xs font-medium text-white/60 mb-3">New card details</p>

            <div>
              <label className="text-xs text-white/50 block mb-1.5">Cardholder name</label>
              <input type="text" placeholder="Jane Smith"
                value={newCard.name}
                onChange={e => setNewCard(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 transition-all" />
            </div>

            <div>
              <label className="text-xs text-white/50 block mb-1.5">Card number</label>
              <div className="relative">
                <input type="text" placeholder="1234 5678 9012 3456"
                  value={newCard.number}
                  onChange={e => setNewCard(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 transition-all" />
                <CreditCard className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/50 block mb-1.5">Expiry date</label>
                <input type="text" placeholder="MM/YY"
                  value={newCard.expiry}
                  onChange={e => setNewCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 transition-all" />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1.5">CVC</label>
                <input type="text" placeholder="123"
                  value={newCard.cvc}
                  onChange={e => setNewCard(p => ({ ...p, cvc: e.target.value.replace(/\D/g,'').slice(0,4) }))}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 transition-all" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/30 mb-2">
              <Shield className="w-3.5 h-3.5 text-[#00D4AA]" />
              Secured by Stripe · 256-bit SSL encryption
            </div>

            <div className="flex gap-2">
              <button onClick={() => setAdding(false)}
                className="flex-1 py-2.5 rounded-xl text-xs border border-white/10 text-white/50 hover:text-white transition-all">
                Cancel
              </button>
              <Button size="sm" onClick={() => setAdding(false)} className="flex-1 rounded-xl gap-1.5">
                <Check className="w-3.5 h-3.5" /> Save card
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 text-xs text-white/25">
          <Shield className="w-3.5 h-3.5 text-[#00D4AA]" />
          Your payment info is encrypted and never stored on our servers
        </div>
      </div>
    </div>
  );
}
