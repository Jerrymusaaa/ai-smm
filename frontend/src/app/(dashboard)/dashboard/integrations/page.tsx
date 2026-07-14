'use client';

import { useState, useEffect } from 'react';
import { Check, Link, Unlink, RefreshCw, ExternalLink, Shield, AlertCircle, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';

const PLATFORMS = [
  {
    id: 'instagram', name: 'Instagram', color: '#E1306C', initial: 'IG',
    desc: 'Share photos, reels, and stories. Access audience analytics.',
    permissions: ['Publish posts & reels', 'Read analytics', 'Manage stories'],
    available: true,
  },
  {
    id: 'tiktok', name: 'TikTok', color: '#FF0050', initial: 'TT',
    desc: 'Publish videos and access performance metrics.',
    permissions: ['Upload videos', 'Read analytics', 'View comments'],
    available: true,
  },
  {
    id: 'twitter', name: 'X / Twitter', color: '#1DA1F2', initial: 'X',
    desc: 'Post tweets and threads. Monitor mentions and analytics.',
    permissions: ['Post tweets & threads', 'Read analytics', 'Monitor mentions'],
    available: true,
  },
  {
    id: 'linkedin', name: 'LinkedIn', color: '#0A66C2', initial: 'IN',
    desc: 'Share professional content. Reach your LinkedIn network.',
    permissions: ['Share posts & articles', 'Read analytics', 'Manage company page'],
    available: true,
  },
  {
    id: 'facebook', name: 'Facebook', color: '#1877F2', initial: 'FB',
    desc: 'Post to your Facebook page and access insights.',
    permissions: ['Post to page', 'Read page insights', 'Manage comments'],
    available: false, comingSoon: true,
  },
  {
    id: 'youtube', name: 'YouTube', color: '#FF0000', initial: 'YT',
    desc: 'Upload videos and manage your YouTube channel.',
    permissions: ['Upload videos', 'Read analytics', 'Manage channel'],
    available: false, comingSoon: true,
  },
  {
    id: 'pinterest', name: 'Pinterest', color: '#E60023', initial: 'PT',
    desc: 'Create and schedule pins to your boards.',
    permissions: ['Create pins', 'Manage boards', 'Read analytics'],
    available: false, comingSoon: true,
  },
  {
    id: 'threads', name: 'Threads', color: '#6364FF', initial: 'TH',
    desc: 'Post to Threads via your Instagram connection.',
    permissions: ['Create threads', 'Read replies'],
    available: false, comingSoon: true,
  },
];

interface ConnectedAccount {
  id: string; platform: string; username: string;
  followers: number; connectedAt: string; isActive: boolean;
}

function formatFollowers(n: number) {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
  return String(n);
}

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.instance.get('/api/social/accounts');
      setConnected(res.data.data || []);
    } catch { } finally { setLoading(false); }
  };

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    setError('');
    try {
      const res = await api.instance.get(`/api/social/connect/${platformId}`);
      window.location.href = res.data.data.authUrl;
    } catch (err: any) {
      setError(err.response?.data?.error || `Could not connect ${platformId}. Make sure OAuth credentials are configured.`);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string, platform: string) => {
    setDisconnecting(accountId);
    try {
      await api.instance.delete(`/api/social/accounts/${accountId}`, { data: { platform } });
      setConnected(prev => prev.filter(a => a.id !== accountId));
      setSuccess(`${platform} disconnected successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to disconnect. Please try again.');
    } finally { setDisconnecting(null); }
  };

  const getAccount = (platformId: string) =>
    connected.find(a => a.platform.toLowerCase() === platformId.toLowerCase());

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl sm:text-3xl font-bold text-white">
          Social Media Integrations
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Connect your accounts to enable scheduling, analytics, and AI-powered content publishing
        </p>
      </div>

      {/* Status messages */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: '#E8C96A' }}>
          <Check className="w-4 h-4" /> {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Progress */}
      <div className="glass rounded-2xl border p-5" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
              Connected platforms
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {connected.length} of {PLATFORMS.filter(p => p.available).length} available platforms connected
            </p>
          </div>
          <button onClick={fetchAccounts} className="p-2 rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-2 rounded-full transition-all"
            style={{
              width: `${(connected.length / PLATFORMS.filter(p => p.available).length) * 100}%`,
              background: 'linear-gradient(90deg,#C9A84C,#E8C96A)',
            }} />
        </div>
        {connected.length === 0 && (
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Connect at least one platform to start scheduling and publishing
          </p>
        )}
      </div>

      {/* Platform grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLATFORMS.map(platform => {
          const account = getAccount(platform.id);
          const isConnecting = connecting === platform.id;
          const isDisconnecting = disconnecting === account?.id;

          return (
            <div key={platform.id}
              className="glass rounded-2xl border transition-all"
              style={{
                borderColor: account ? 'rgba(201,168,76,0.25)' : platform.comingSoon ? 'rgba(255,255,255,0.04)' : 'rgba(201,168,76,0.1)',
                opacity: platform.comingSoon ? 0.65 : 1,
              }}>
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: `${platform.color}20`, border: `1.5px solid ${platform.color}35` }}>
                    {platform.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-white">{platform.name}</h3>
                      {account && (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C' }}>
                          <Check className="w-2.5 h-2.5" /> Connected
                        </span>
                      )}
                      {platform.comingSoon && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>
                          Coming soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {platform.desc}
                    </p>
                  </div>
                </div>

                {/* Connected account info */}
                {account && (
                  <div className="mb-4 p-3 rounded-xl border"
                    style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-white">{account.username}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {formatFollowers(account.followers)} followers · Connected {new Date(account.connectedAt).toLocaleDateString('en-KE')}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.2)' }} />
                    </div>
                  </div>
                )}

                {/* Permissions */}
                <div className="mb-4 space-y-1.5">
                  {platform.permissions.map(perm => (
                    <div key={perm} className="flex items-center gap-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      <Shield className="w-3 h-3 flex-shrink-0" style={{ color: 'rgba(201,168,76,0.4)' }} />
                      {perm}
                    </div>
                  ))}
                </div>

                {/* Action button */}
                {platform.comingSoon ? (
                  <button disabled className="w-full py-2.5 rounded-xl text-xs font-medium border cursor-not-allowed"
                    style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' }}>
                    Coming soon
                  </button>
                ) : account ? (
                  <button
                    onClick={() => handleDisconnect(account.id, platform.id)}
                    disabled={isDisconnecting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium border transition-all disabled:opacity-50"
                    style={{ borderColor: 'rgba(239,68,68,0.25)', color: '#EF4444' }}>
                    {isDisconnecting
                      ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Disconnecting...</>
                      : <><Unlink className="w-3.5 h-3.5" /> Disconnect {platform.name}</>}
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={isConnecting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                    style={{
                      background: `${platform.color}15`,
                      border: `1px solid ${platform.color}30`,
                      color: platform.color,
                    }}>
                    {isConnecting
                      ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Connecting...</>
                      : <><Link className="w-3.5 h-3.5" /> Connect {platform.name}</>}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security note */}
      <div className="glass rounded-2xl border p-5" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-sm font-bold text-white mb-3">
          How we protect your accounts
        </h3>
        <div className="space-y-2">
          {[
            'We use official OAuth 2.0 — we never see or store your passwords',
            'Access tokens are encrypted with AES-256 before storage',
            'We only request the minimum permissions needed to post and read analytics',
            'You can disconnect any platform at any time and all tokens are immediately deleted',
            'All API calls are made over HTTPS with certificate verification',
          ].map(item => (
            <div key={item} className="flex items-start gap-2.5">
              <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
