'use client';

import { useState } from 'react';
import { FileText, Download, Mail, Calendar, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const REPORT_TYPES = [
  { id: 'weekly', label: 'Weekly summary', desc: 'Key metrics from the last 7 days', icon: '📊' },
  { id: 'monthly', label: 'Monthly report', desc: 'Full performance breakdown', icon: '📈' },
  { id: 'campaign', label: 'Campaign report', desc: 'ROI and campaign metrics', icon: '🎯' },
  { id: 'audience', label: 'Audience insights', desc: 'Demographics and behavior', icon: '👥' },
];

export function ReportGenerator() {
  const [selected, setSelected] = useState('weekly');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated(true);
    setTimeout(() => setGenerated(false), 4000);
  };

  return (
    <div className="glass rounded-2xl border border-white/[0.06] p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Generate report
          </h3>
          <p className="text-xs text-white/40">AI-powered analytics reports</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {REPORT_TYPES.map(type => (
          <button key={type.id} onClick={() => setSelected(type.id)}
            className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
              selected === type.id
                ? 'border-[#C9A84C]/40 bg-[#C9A84C]/10'
                : 'border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04]'
            }`}>
            <span className="text-lg">{type.icon}</span>
            <div>
              <div className={`text-xs font-medium ${selected === type.id ? 'text-[#C9A84C]' : 'text-white/70'}`}>
                {type.label}
              </div>
              <div className="text-[10px] text-white/30 mt-0.5 leading-relaxed">{type.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Date range */}
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="w-4 h-4 text-white/30 flex-shrink-0" />
        <select className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white/60 outline-none">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>Custom range</option>
        </select>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button size="md" loading={generating} onClick={generate} className="w-full rounded-xl gap-2">
          {!generating && (
            generated
              ? <><Check className="w-4 h-4" /> Report ready!</>
              : <><Sparkles className="w-4 h-4" /> Generate with AI</>
          )}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 transition-all">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 transition-all">
            <Mail className="w-3.5 h-3.5" /> Email report
          </button>
        </div>
      </div>
    </div>
  );
}
