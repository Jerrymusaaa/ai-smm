'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2, Download, UserX } from 'lucide-react';

export function DangerZone() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const DANGER_ACTIONS = [
    {
      id: 'export', title: 'Export your data', icon: Download, color: '#C9A84C',
      desc: 'Download a full export of all your account data including posts, analytics, campaigns, and settings.',
      action: 'Export data', actionStyle: 'border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10',
      onClick: () => alert('Preparing data export... You will receive an email when ready.'),
    },
    {
      id: 'deactivate', title: 'Deactivate account', icon: UserX, color: '#F59E0B',
      desc: 'Temporarily disable your account. Your data will be preserved and you can reactivate at any time.',
      action: 'Deactivate', actionStyle: 'border border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/10',
      onClick: () => alert('Account deactivation initiated.'),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Warning banner */}
      <div className="rounded-2xl border border-red-500/25 p-4 flex items-start gap-3"
        style={{ background: 'rgba(239,68,68,0.05)' }}>
        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-400">Danger zone</p>
          <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
            Actions in this section are irreversible. Please read carefully before proceeding.
            We recommend exporting your data before making any permanent changes.
          </p>
        </div>
      </div>

      {DANGER_ACTIONS.map(action => (
        <div key={action.id} className="glass rounded-2xl border border-white/[0.06] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${action.color}15`, border: `1px solid ${action.color}25` }}>
                <action.icon className="w-4 h-4" style={{ color: action.color }} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{action.title}</p>
                <p className="text-xs text-white/40 mt-1 leading-relaxed max-w-md">{action.desc}</p>
              </div>
            </div>
            <button onClick={action.onClick}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${action.actionStyle}`}>
              {action.action}
            </button>
          </div>
        </div>
      ))}

      {/* Delete account */}
      <div className="glass rounded-2xl border border-red-500/30 p-5"
        style={{ background: 'rgba(239,68,68,0.03)' }}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-400">Delete account permanently</p>
              <p className="text-xs text-white/40 mt-1 leading-relaxed max-w-md">
                This will immediately delete your account, all connected social accounts, campaigns, analytics data, and cancel your subscription. This action cannot be undone.
              </p>
            </div>
          </div>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium border border-red-500/40 text-red-400 hover:bg-red-500/15 transition-all">
              Delete account
            </button>
          ) : (
            <div className="flex-shrink-0 space-y-3 min-w-[240px]">
              <p className="text-xs text-white/60">
                Type <span className="text-red-400 font-mono font-bold">DELETE MY ACCOUNT</span> to confirm:
              </p>
              <input type="text" value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                className="w-full bg-white/[0.05] border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-red-500/60 transition-all" />
              <div className="flex gap-2">
                <button onClick={() => { setConfirmDelete(false); setConfirmText(''); }}
                  className="flex-1 py-2 rounded-xl text-xs border border-white/15 text-white/50 hover:text-white transition-all">
                  Cancel
                </button>
                <button
                  disabled={confirmText !== 'DELETE MY ACCOUNT'}
                  className="flex-1 py-2 rounded-xl text-xs font-medium bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  Confirm delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
