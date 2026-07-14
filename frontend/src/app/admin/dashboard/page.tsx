'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Users, CreditCard, AlertTriangle, BarChart3,
  Shield, LogOut, Search, Ban, Check,
  TrendingUp, Wallet, FileText, Settings
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalInfluencers: number;
  totalBusinesses: number;
  activeSubscriptions: number;
  pendingPayouts: number;
  flaggedAccounts: number;
  monthlyRevenue: number;
  newUsersToday: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  accountType: string;
  plan: string;
  createdAt: string;
  emailVerified: boolean;
}

const ADMIN_NAV = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'influencers', label: 'Influencers', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'payouts', label: 'Payouts', icon: Wallet },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';

  useEffect(() => {
    if (!adminToken) { router.push('/admin/login'); return; }
    fetchData();
  }, [adminToken]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };

      const [statsRes, usersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, { headers }),
      ]);

      if (statsRes.status === 401 || usersRes.status === 401) {
        router.push('/admin/login'); return;
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      if (statsData.success) setStats(statsData.data);
      if (usersData.success) setUsers(usersData.data);
    } catch {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    if (!confirm('Suspend this user account?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchData();
    } catch { setError('Action failed'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#070A0F' }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r flex flex-col"
        style={{ background: '#0A0A0A', borderColor: 'rgba(201,168,76,0.12)' }}>
        <div className="flex items-center gap-2.5 px-4 py-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(201,168,76,0.3)' }}>
            <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" width={32} height={32} className="object-cover" />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', color: '#E8C96A' }} className="text-sm font-bold">Yoyzie AI</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {ADMIN_NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeTab === item.id ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: activeTab === item.id ? '#E8C96A' : 'rgba(255,255,255,0.5)',
                border: activeTab === item.id ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
              }}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: 'rgba(239,68,68,0.7)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#EF4444'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.7)'}>
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-white">
              {ADMIN_NAV.find(n => n.id === activeTab)?.label}
            </h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <Shield className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />
              <span className="text-xs" style={{ color: '#E8C96A' }}>Super Admin</span>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
              {error}
            </div>
          )}

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: 'Total users', value: stats?.totalUsers ?? '—', icon: Users, color: '#C9A84C' },
                  { label: 'Active subscriptions', value: stats?.activeSubscriptions ?? '—', icon: CreditCard, color: '#E8C96A' },
                  { label: 'Pending payouts', value: stats?.pendingPayouts ?? '—', icon: Wallet, color: '#C9A84C' },
                  { label: 'Flagged accounts', value: stats?.flaggedAccounts ?? '—', icon: AlertTriangle, color: '#EF4444' },
                  { label: 'New users today', value: stats?.newUsersToday ?? '—', icon: TrendingUp, color: '#C9A84C' },
                  { label: 'Total influencers', value: stats?.totalInfluencers ?? '—', icon: Shield, color: '#E8C96A' },
                  { label: 'Total businesses', value: stats?.totalBusinesses ?? '—', icon: BarChart3, color: '#C9A84C' },
                  { label: 'Monthly revenue (KES)', value: stats?.monthlyRevenue ? `${stats.monthlyRevenue.toLocaleString()}` : '—', icon: TrendingUp, color: '#E8C96A' },
                ].map(stat => (
                  <div key={stat.label} className="glass rounded-2xl p-5 border" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                      <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold text-white mb-0.5">
                      {loading ? '...' : stat.value}
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(201,168,76,0.12)' }}>
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="bg-transparent text-sm text-white outline-none flex-1" />
              </div>

              <div className="glass rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
                      {['Name', 'Email', 'Type', 'Plan', 'Verified', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium"
                          style={{ color: 'rgba(255,255,255,0.4)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading users...</td></tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>No users found</td></tr>
                    ) : filteredUsers.map(user => (
                      <tr key={user.id} className="border-t transition-colors"
                        style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.02)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <td className="px-4 py-3 text-sm text-white">{user.name}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{user.email}</td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>
                            {user.accountType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{user.plan}</td>
                        <td className="px-4 py-3">
                          {user.emailVerified
                            ? <Check className="w-4 h-4" style={{ color: '#C9A84C' }} />
                            : <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {new Date(user.createdAt).toLocaleDateString('en-KE')}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleSuspendUser(user.id)}
                            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all"
                            style={{ color: 'rgba(239,68,68,0.7)' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                            <Ban className="w-3.5 h-3.5" /> Suspend
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Other tabs */}
          {!['overview', 'users'].includes(activeTab) && (
            <div className="glass rounded-2xl border p-12 text-center" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                {(() => { const Icon = ADMIN_NAV.find(n => n.id === activeTab)?.icon || Settings; return <Icon className="w-6 h-6" style={{ color: '#C9A84C' }} />; })()}
              </div>
              <p className="text-base font-semibold text-white mb-2 capitalize">{activeTab}</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                This section is being built. Check back soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
