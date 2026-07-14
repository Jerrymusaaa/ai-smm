'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, Shield, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, adminCode }),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      localStorage.setItem('adminToken', data.data.token);
      document.cookie = `adminToken=${data.data.token}; path=/; max-age=${8 * 60 * 60}; SameSite=Strict`;
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #070A0F, #0A0A0A)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4"
            style={{ border: '1px solid rgba(201,168,76,0.4)' }}>
            <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" width={64} height={64} className="object-cover w-full h-full" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: '#E8C96A' }} className="text-2xl font-bold">
            Yoyzie AI Admin
          </h1>
          <p className="text-xs mt-1 flex items-center justify-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <Shield className="w-3 h-3" /> Restricted access — authorised personnel only
          </p>
        </div>

        <div className="rounded-2xl border p-8" style={{ background: '#0D0D0F', borderColor: 'rgba(201,168,76,0.2)' }}>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs block mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Admin email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="admin@yoyzie.ai"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none border transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.15)' }} />
              </div>
            </div>

            <div>
              <label className="text-xs block mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none border transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.15)' }} />
              </div>
            </div>

            <div>
              <label className="text-xs block mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Admin access code
              </label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="password" value={adminCode} onChange={e => setAdminCode(e.target.value)} required
                  placeholder="6-digit admin code"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none border transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.15)' }} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A' }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</> : 'Access Admin Panel'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
          All admin access is logged and monitored
        </p>
      </div>
    </div>
  );
}
