'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function OAuthCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken  = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userParam    = searchParams.get('user');
    const next         = searchParams.get('next') || 'dashboard';
    const error        = searchParams.get('error');

    if (error) {
      window.location.href = `/login?error=${error}`;
      return;
    }

    if (!accessToken || !userParam) {
      window.location.href = '/login?error=missing_params';
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));

      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;

      useAuthStore.setState({ user, accessToken, isAuthenticated: true, isLoading: false });

      window.location.href = next === 'choose-account-type' ? '/choose-account-type' : '/dashboard';
    } catch {
      window.location.href = '/login?error=parse_failed';
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen items-center justify-center" style={{ background: '#070A0F' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: 'rgba(201,168,76,0.6)', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Signing you in...</p>
      </div>
    </div>
  );
}
