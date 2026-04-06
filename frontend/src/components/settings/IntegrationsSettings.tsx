'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Link, Unlink, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

const PLATFORMS = [
  {
    id: 'instagram', label: 'Instagram', color: '#E1306C', initial: 'IG',
    desc: 'Post photos, reels, stories and access analytics',
    scopes: 'Feed posts · Stories · Reels · Analytics',
  },
  {
    id: 'tiktok', label: 'TikTok', color: '#FF0050', initial: 'TT',
    desc: 'Publish videos and access performance data',
    scopes: 'Video posts · Analytics · Comments',
  },
  {
    id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', initial: 'IN',
    desc: 'Share posts and articles to your LinkedIn profile',
    scopes: 'Profile posts · Articles · Analytics',
  },
  {
    id: 'twitter', label: 'X / Twitter', color: '#1DA1F2', initial: 'X',
    desc: 'Post tweets and threads, read analytics',
    scopes: 'Tweets · Threads · Analytics · DMs',
  },
  {
    id: 'facebook', label: 'Facebook', color: '#1877F2', initial: 'FB',
    desc: 'Post to pages and access insights',
    scopes: 'Page posts · Stories · Analytics',
    comingSoon: true,
  },
  {
    id: 'youtube', label: 'YouTube', color: '#FF0000', initial: 'YT',
    desc: 'Upload videos and manage your channel',
    scopes: 'Videos · Shorts · Analytics',
    comingSoon: true,
  },
  {
    id: 'pinterest', label: 'Pinterest', color: '#E60023', initial: 'PT',
    desc: 'Create and schedule pins to your boards',
    scopes: 'Pins · Boards · Analytics',
    comingSoon: true,
  },
  {
    id: 'threads', label: 'Threads', color: '#6364FF', initial: 'TH',
    desc: 'Post to Threads via Instagram connection',
    scopes: 'Posts · Replies · Analytics',
    comingSoon: true,
  },
];

interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
  displayName?: string;
  avatar?: string;
  followers: number;
  connectedAt: string;
}

export function IntegrationsSettings() {
  const searchParams = useSearchParams();
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchConnectedAccounts();

    // Check for OAuth callback results
    const connected = searchParams.get('connected');
    const username = searchParams.get('username');
    const error = searchParams.get('error');

    if (connected && username) {
      setSuccessMessage(`Successfully connected ${connected} as ${decodeURIComponent(username)}!`);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
    if (error) {
      setErrorMessage(`Connection failed: ${decodeURIComponent(error)}`);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  }, [searchParams]);

  const fetchConnectedAccounts = async () => {
    try {
      const res = await api.users.getProfile();
      setConnectedAccounts(res.data.data?.socialAccounts || []);
    } catch {
      // use empty array
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    try {
      const res = await api.instance.get(`/api/social/connect/${platformId}`);
      const { authUrl } = res.data.data;
      // Redirect to OAuth provider
      window.location.href = authUrl;
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || `Failed to connect ${platformId}`);
      setTimeout(() => setErrorMessage(''), 5000);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string, platform: string) => {
    setDisconnecting(accountId);
    try {
      await api.instance.delete(`/api/social/accounts/${accountId}`, {
        data: { platform },
      });
      setConnectedAccounts(prev => prev.filter(a => a.id !== accountId));
      setSuccessMessage(`${platform} account disconnected`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrorMessage('Failed to disconnect account');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setDisconnecting(null);
    }
  };

  const getConnectedAccount = (platformId: string) =>
    connectedAccounts.find(a => a.platform.toLowerCase() === platformId.toLowerCase());

  const formatFollowers = (n: number) =>
    n >= 1000000 ? `${(n/1000000).toFixed(1)}M`
    : n >= 1000 ? `${(n/1000).toFixed(1)}K`
    : n.toString();

  return (
    <div className="space-y-5">
      {/* Status messages */}
      {successMessage && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20">
          <Check className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
          <p className="text-sm text-[#00D4AA]">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Summary */}
      <div className="glass rounded-2xl border border-white/[0.06] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
              Connected platforms
            </h3>
            <p className="text-xs text-white/40 mt-0.5">
              {connectedAccounts.length} of {PLATFORMS.filter(p => !p.comingSoon).length} platforms connected
            </p>
          </div>
          <button onClick={fetchConnectedAccounts}
            className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-white/[0.06] rounded-full h-2">
            <div className="h-2 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00D4AA] transition-all"
              style={{ width: `${(connectedAccounts.length / 4) * 100}%` }} />
          </div>
          <p className="text-xs text-white/30 mt-1.5">
            Connect all platforms to unlock full AI optimization
          </p>
        </div>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLATFORMS.map(platform => {
          const connected = getConnectedAccount(platform.id);
          const isConnecting = connecting === platform.id;
          const isDisconnecting = disconnecting === connected?.id;

          return (
            <div key={platform.id}
              className={`glass rounded-2xl border transition-all p-5 ${
                connected
                  ? 'border-[#00D4AA]/25 bg-[#00D4AA]/03'
                  : platform.comingSoon
                  ? 'border-white/[0.04] opacity-60'
                  : 'border-white/[0.06] hover:border-white/15'
              }`}>

              <div className="flex items-start gap-4 mb-4">
                {/* Platform icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-lg"
                  style={{ background: `${platform.color}20`, border: `1.5px solid ${platform.color}35` }}>
                  {platform.initial}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-white">{platform.label}</h4>
                    {connected && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#00D4AA]/15 text-[#00D4AA] font-medium">
                        <Check className="w-2.5 h-2.5" /> Connected
                      </span>
                    )}
                    {platform.comingSoon && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/30 font-medium">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{platform.desc}</p>
                </div>
              </div>

              {/* Connected account info */}
              {connected && (
                <div className="mb-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white/80">{connected.username}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        {formatFollowers(connected.followers)} followers · Connected{' '}
                        {new Date(connected.connectedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/20" />
                  </div>
                </div>
              )}

              {/* Scopes */}
              <p className="text-[10px] text-white/25 mb-4">{platform.scopes}</p>

              {/* Action button */}
              {platform.comingSoon ? (
                <button disabled
                  className="w-full py-2.5 rounded-xl text-xs font-medium border border-white/[0.06] text-white/25 cursor-not-allowed">
                  Coming soon
                </button>
              ) : connected ? (
                <button
                  onClick={() => handleDisconnect(connected.id, platform.id)}
                  disabled={isDisconnecting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50">
                  {isDisconnecting
                    ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Disconnecting...</>
                    : <><Unlink className="w-3.5 h-3.5" /> Disconnect</>}
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(platform.id)}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                  style={{
                    background: `${platform.color}18`,
                    border: `1px solid ${platform.color}35`,
                    color: platform.color,
                  }}>
                  {isConnecting
                    ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Connecting...</>
                    : <><Link className="w-3.5 h-3.5" /> Connect {platform.label}</>}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* OAuth info */}
      <div className="glass rounded-2xl border border-white/[0.06] p-5">
        <h4 className="text-sm font-medium text-white/70 mb-3">About platform connections</h4>
        <div className="space-y-2">
          {[
            'We use official OAuth 2.0 — we never see your passwords',
            'You can disconnect any platform at any time',
            'Tokens are encrypted and stored securely',
            'Permissions are limited to only what is needed to post and read analytics',
          ].map(item => (
            <div key={item} className="flex items-start gap-2.5">
              <Check className="w-3.5 h-3.5 text-[#00D4AA] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-white/40">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
