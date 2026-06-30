'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { AIChatPanel } from './AIChatPanel';

export function AIChatLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <AIChatPanel onClose={() => setOpen(false)} />}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg,#C9A84C,#E8C96A)',
            boxShadow: '0 8px 32px rgba(201,168,76,0.4)',
          }}>
          <Sparkles className="w-6 h-6 text-black" />
        </button>
      )}
    </>
  );
}
