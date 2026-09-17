'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Users, CreditCard, AlertTriangle, BarChart3,
  Shield, LogOut, Search, Ban, Check, RefreshCw,
  TrendingUp, Wallet, FileText, Settings, Loader2,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface AdminStats {
  totalUsers: number;
  totalInfluencers: number;
  totalBusinesses: number;
  activeSubscriptions: number;
  pendingPayouts: number;
  pendingPayoutValue: number;
  flaggedAccounts: number;
  monthlyRevenue: number;
  revenue30d: number;
  revenueAllTime: number;
  newUsersToday: number;
  verifiedUsers: number;
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  connectedAccounts: number;
  activeCampaigns: number;
  botReports: number;
  signupsByDay: { date: string; count: number }[];
  generatedAt: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  accountType: string;
  plan: string;
  createdAt: string;
  lastLoginAt: string | null;
  emailVerified: boolean;
  _count?: { posts: number; socialAccounts: number; sessions: number };
}

interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  withdrawalMethod: string | null;
  mpesaNumber: string | null;
  createdAt: string;
  influencer?: { user?: { name: string; email: string } };
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
  subscription?: { user?: { name: string; email: string } };
}

const ADMIN_NAV = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'influencers', label: 'Influencers', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'payouts', label: 'Payouts', icon: Wallet },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E8C96A';

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtMoney(n: number, currency = 'KES'): string {
  return `${currency} ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function fmtDate(d: string | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState('');
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<string>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Restore token after hydration
  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    if (!t) { router.push('/admin/login'); return; }
    setAdminToken(t);
    setReady(true);
  }, [router]);

  const fetchStats = useCallback(async () => {
    if (!adminToken) return;
    setLoadingStats(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/admin/stats`, { headers: { Authorization: `Bearer ${adminToken}` } });
      const j = await res.json();
      if (j.success) { setStats(j.data); setLastRefresh(new Date()); }
    } catch {}
    setLoadingStats(false);
  }, [adminToken]);

  useEffect(() => {
    if (!ready) return;
    fetchStats();
    const id = setInterval(fetchStats, 30000); // real-time: refresh every 30s
    return () => clearInterval(id);
  }, [ready, fetchStats]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#070A0F' }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#070A0F' }}>
      {/* Top bar */}
      <header className="border-b sticky top-0 z-40"
        style={{ borderColor: 'rgba(201,168,76,0.12)', background: 'rgba(7,10,15,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden" style={{ border: `1px solid rgba(201,168,76,0.35)` }}>
              <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie" width={36} height={36} className="object-cover" />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', color: GOLD_LIGHT }} className="font-bold leading-tight block">
                Yoyzie Admin
              </span>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {lastRefresh ? `Live · updated ${lastRefresh.toLocaleTimeString()}` : 'Connecting…'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchStats} title="Refresh now"
              className="p-2 rounded-xl border transition-all"
              style={{ borderColor: 'rgba(201,168,76,0.2)', color: GOLD_LIGHT }}>
              <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all"
              style={{ borderColor: 'rgba(239,68,68,0.25)', color: 'rgba(239,68,68,0.8)' }}>
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
        {/* Nav tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto pb-2">
          {ADMIN_NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
              style={tab === n.id
                ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: '#0A0A0A' }
                : { color: 'rgba(255,255,255,0.45)' }}>
              <n.icon className="w-3.5 h-3.5" /> {n.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {tab === 'overview' && <Overview stats={stats} loading={loadingStats} />}
        {tab === 'users' && <UsersSection adminToken={adminToken} stats={stats} />}
        {tab === 'influencers' && <InfluencersSection adminToken={adminToken} />}
        {tab === 'billing' && <BillingSection adminToken={adminToken} />}
        {tab === 'payouts' && <PayoutsSection adminToken={adminToken} />}
        {tab === 'reports' && <ReportsSection adminToken={adminToken} />}
        {tab === 'settings' && <SettingsSection adminToken={adminToken} />}
      </main>
    </div>
  );
}

// ── Shared bits ──────────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border p-5 ${className}`}
      style={{ borderColor: 'rgba(201,168,76,0.12)', background: 'rgba(255,255,255,0.02)' }}>
      {children}
    </div>
  );
}

function StatTile({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <Card>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
      <p className="text-2xl font-bold mt-1" style={{ fontFamily: 'var(--font-display)', color: accent || '#fff' }}>{value}</p>
      {sub && <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</p>}
    </Card>
  );
}

function useAdminFetch(adminToken: string, path: string, deps: any[] = []) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(() => {
    if (!adminToken) return;
    setLoading(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiBase}${path}`, { headers: { Authorization: `Bearer ${adminToken}` } })
      .then(r => r.json())
      .then(j => { if (j.success) setData(j); })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, path, ...deps]);
  useEffect(() => { reload(); }, [reload]);
  return { data, loading, reload };
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-8 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {text}
      </td>
    </tr>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <Card className="overflow-x-auto !p-0">
      <table className="w-full text-sm">{children}</table>
    </Card>
  );
}

const th = 'text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-3';
const tdStyle = 'px-4 py-3 border-t';

function Th({ children }: { children: React.ReactNode }) {
  return <th className={th} style={{ color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(201,168,76,0.08)' }}>{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className={tdStyle} style={{ borderColor: 'rgba(201,168,76,0.06)', color: 'rgba(255,255,255,0.75)' }}>{children}</td>;
}

// ── Overview ─────────────────────────────────────────────────────────────────

function Overview({ stats, loading }: { stats: AdminStats | null; loading: boolean }) {
  if (loading && !stats) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin" style={{ color: GOLD }} /></div>;
  }
  if (!stats) return <Card><p className="text-sm text-white/50">Could not load stats. Check that the backend is running and ADMIN_JWT_SECRET matches.</p></Card>;

  const maxSignups = Math.max(...stats.signupsByDay.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Total Users" value={stats.totalUsers.toLocaleString()} sub={`+${stats.newUsersToday} today`} />
        <StatTile label="Influencers" value={stats.totalInfluencers.toLocaleString()} accent={GOLD_LIGHT} />
        <StatTile label="Businesses / Enterprise" value={stats.totalBusinesses.toLocaleString()} />
        <StatTile label="Paid Subscriptions" value={stats.activeSubscriptions.toLocaleString()} accent={GOLD_LIGHT} />
        <StatTile label="Revenue (this month)" value={fmtMoney(stats.monthlyRevenue)} accent={GOLD_LIGHT} sub={`All-time: ${fmtMoney(stats.revenueAllTime)}`} />
        <StatTile label="Pending Payouts" value={String(stats.pendingPayouts)} sub={fmtMoney(stats.pendingPayoutValue)} />
        <StatTile label="Connected Accounts" value={stats.connectedAccounts.toLocaleString()} sub={`${stats.activeCampaigns} active campaigns`} />
        <StatTile label="Posts" value={stats.totalPosts.toLocaleString()} sub={`${stats.scheduledPosts} scheduled · ${stats.publishedPosts} published`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <p className="text-sm font-semibold text-white mb-4">New signups — last 14 days</p>
          <div className="flex items-end gap-1.5 h-32">
            {stats.signupsByDay.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${d.date}: ${d.count}`}>
                <div className="w-full rounded-t transition-all"
                  style={{ height: `${Math.max((d.count / maxSignups) * 100, 3)}%`, background: `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD})`, opacity: 0.85 }} />
                {i % 3 === 0 && <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{d.date.split(' ')[0]}</span>}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-white mb-3">Health signals</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span style={{ color: 'rgba(255,255,255,0.5)' }}>Verified users</span><span className="text-white font-medium">{stats.verifiedUsers.toLocaleString()}</span></div>
            <div className="flex justify-between"><span style={{ color: 'rgba(255,255,255,0.5)' }}>Flagged (stale unverified)</span><span className="font-medium" style={{ color: '#F59E0B' }}>{stats.flaggedAccounts}</span></div>
            <div className="flex justify-between"><span style={{ color: 'rgba(255,255,255,0.5)' }}>Bot detection reports</span><span className="font-medium" style={{ color: stats.botReports > 0 ? '#EF4444' : '#fff' }}>{stats.botReports}</span></div>
            <div className="flex justify-between"><span style={{ color: 'rgba(255,255,255,0.5)' }}>Revenue last 30d</span><span className="font-medium" style={{ color: GOLD_LIGHT }}>{fmtMoney(stats.revenue30d)}</span></div>
          </div>
        </Card>
      </div>

      <p className="text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
        All figures are computed live from the production database · generated {new Date(stats.generatedAt).toLocaleTimeString()}
      </p>
    </div>
  );
}

// ── Users ────────────────────────────────────────────────────────────────────

function UsersSection({ adminToken, stats }: { adminToken: string; stats: AdminStats | null }) {
  const [search, setSearch] = useState('');
  const [accountType, setAccountType] = useState('all');
  const [page, setPage] = useState(1);
  const { data, loading, reload } = useAdminFetch(
    adminToken,
    `/api/admin/users?search=${encodeURIComponent(search)}&accountType=${accountType}&page=${page}&limit=20`,
    [search, accountType, page]
  );
  const [suspending, setSuspending] = useState<string | null>(null);

  const suspend = async (id: string) => {
    setSuspending(id);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    await fetch(`${apiBase}/api/admin/users/${id}/suspend`, {
      method: 'POST', headers: { Authorization: `Bearer ${adminToken}` },
    }).catch(() => {});
    setSuspending(null);
    reload();
  };

  const users: AdminUser[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(201,168,76,0.15)' }} />
        </div>
        <select value={accountType} onChange={e => { setAccountType(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl text-sm outline-none border"
          style={{ background: '#0D0D0F', color: '#fff', borderColor: 'rgba(201,168,76,0.15)' }}>
          <option value="all">All account types</option>
          <option value="INDIVIDUAL">Individual</option>
          <option value="INFLUENCER">Influencer</option>
          <option value="BUSINESS">Business</option>
          <option value="ENTERPRISE">Enterprise</option>
        </select>
      </div>

      <TableWrap>
        <thead>
          <tr>
            <Th>User</Th><Th>Type</Th><Th>Plan</Th><Th>Posts</Th><Th>Verified</Th><Th>Joined</Th><Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading && <EmptyRow colSpan={7} text="Loading users…" />}
          {!loading && users.length === 0 && <EmptyRow colSpan={7} text="No users match this filter." />}
          {!loading && users.map(u => (
            <tr key={u.id}>
              <Td>
                <div className="font-medium text-white">{u.name}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{u.email}</div>
              </Td>
              <Td><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.12)', color: GOLD_LIGHT }}>{u.accountType}</span></Td>
              <Td><span className="text-xs">{u.plan}</span></Td>
              <Td><span className="text-xs">{u._count?.posts ?? 0}</span></Td>
              <Td>{u.emailVerified
                ? <Check className="w-4 h-4" style={{ color: '#00D4AA' }} />
                : <AlertTriangle className="w-4 h-4" style={{ color: '#F59E0B' }} />}</Td>
              <Td><span className="text-xs">{fmtDate(u.createdAt)}</span></Td>
              <Td>
                <button onClick={() => suspend(u.id)} disabled={suspending === u.id}
                  title="Revoke all sessions (suspend)"
                  className="p-1.5 rounded-lg border transition-all disabled:opacity-40"
                  style={{ borderColor: 'rgba(239,68,68,0.25)', color: 'rgba(239,68,68,0.8)' }}>
                  {suspending === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      {pagination && (
        <div className="flex items-center justify-between text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>{pagination.total} users · page {pagination.page} of {pagination.pages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border disabled:opacity-30" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>Prev</button>
            <button onClick={() => setPage(p => (pagination && p < pagination.pages ? p + 1 : p))} disabled={page >= pagination.pages}
              className="px-3 py-1.5 rounded-lg border disabled:opacity-30" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Influencers ──────────────────────────────────────────────────────────────

function InfluencersSection({ adminToken }: { adminToken: string }) {
  const { data, loading } = useAdminFetch(adminToken, '/api/admin/influencers');
  const profiles: any[] = data?.data ?? [];
  const totals = data?.totals;

  return (
    <div className="space-y-4">
      {totals && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile label="Influencer profiles" value={String(totals.count)} />
          <StatTile label="Total wallet balances" value={fmtMoney(totals.totalWallet)} accent={GOLD_LIGHT} />
          <StatTile label="Pending (processing)" value={fmtMoney(totals.totalPending)} />
          <StatTile label="Lifetime earnings" value={fmtMoney(totals.totalEarnings)} />
        </div>
      )}
      <TableWrap>
        <thead><tr><Th>Influencer</Th><Th>Wallet</Th><Th>Pending</Th><Th>Earnings</Th><Th>Commission</Th><Th>Campaigns</Th><Th>Badge</Th></tr></thead>
        <tbody>
          {loading && <EmptyRow colSpan={7} text="Loading influencers…" />}
          {!loading && profiles.length === 0 && <EmptyRow colSpan={7} text="No influencer profiles yet — they are created when influencers onboard." />}
          {!loading && profiles.map((p: any) => (
            <tr key={p.id}>
              <Td>
                <div className="font-medium text-white">{p.user?.name}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.user?.email}</div>
              </Td>
              <Td>{fmtMoney(p.walletBalance)}</Td>
              <Td>{fmtMoney(p.pendingBalance)}</Td>
              <Td>{fmtMoney(p.totalEarnings)}</Td>
              <Td>{p.commissionRate}%</Td>
              <Td>{p.totalCampaigns}</Td>
              <Td>{p.verifiedBadge ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,170,0.12)', color: '#00D4AA' }}>Verified</span> : '—'}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

// ── Billing ──────────────────────────────────────────────────────────────────

function BillingSection({ adminToken }: { adminToken: string }) {
  const { data, loading } = useAdminFetch(adminToken, '/api/admin/billing');
  const invoices: Invoice[] = data?.data ?? [];
  const byPlan: { plan: string; count: number }[] = data?.subscriptionsByPlan ?? [];
  const totals = data?.totals;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Paid invoices" value={String(totals?.paidInvoices ?? 0)} />
        <StatTile label="Total revenue" value={fmtMoney(totals?.totalRevenue ?? 0)} accent={GOLD_LIGHT} />
        {byPlan.slice(0, 2).map((p: any) => (
          <StatTile key={p.plan} label={`Active ${p.plan} subs`} value={String(p.count)} />
        ))}
      </div>
      <TableWrap>
        <thead><tr><Th>Invoice</Th><Th>User</Th><Th>Amount</Th><Th>Status</Th><Th>Paid at</Th><Th>Created</Th></tr></thead>
        <tbody>
          {loading && <EmptyRow colSpan={6} text="Loading invoices…" />}
          {!loading && invoices.length === 0 && <EmptyRow colSpan={6} text="No invoices yet — billing data appears once subscriptions start being charged." />}
          {!loading && invoices.map(inv => (
            <tr key={inv.id}>
              <Td><span className="font-mono text-xs">{inv.id.slice(0, 12)}…</span></Td>
              <Td>
                <div className="text-white">{inv.subscription?.user?.name || '—'}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{inv.subscription?.user?.email}</div>
              </Td>
              <Td>{fmtMoney(inv.amount, inv.currency.toUpperCase())}</Td>
              <Td>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: ['paid', 'succeeded', 'PAID'].includes(inv.status) ? 'rgba(0,212,170,0.12)' : 'rgba(245,158,11,0.12)',
                  color: ['paid', 'succeeded', 'PAID'].includes(inv.status) ? '#00D4AA' : '#F59E0B',
                }}>{inv.status}</span>
              </Td>
              <Td>{fmtDate(inv.paidAt)}</Td>
              <Td>{fmtDate(inv.createdAt)}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

// ── Payouts ──────────────────────────────────────────────────────────────────

function PayoutsSection({ adminToken }: { adminToken: string }) {
  const [status, setStatus] = useState('all');
  const { data, loading, reload } = useAdminFetch(adminToken, `/api/admin/payouts?status=${status}`, [status]);
  const payouts: Payout[] = data?.data ?? [];
  const [updating, setUpdating] = useState<string | null>(null);

  const update = async (id: string, newStatus: string) => {
    setUpdating(id);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    await fetch(`${apiBase}/api/admin/payouts/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
    setUpdating(null);
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all', 'pending', 'processing', 'completed', 'failed'].map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all"
            style={status === s
              ? { background: GOLD, borderColor: GOLD, color: '#0A0A0A' }
              : { borderColor: 'rgba(201,168,76,0.2)', color: 'rgba(255,255,255,0.5)' }}>
            {s}
          </button>
        ))}
      </div>
      <TableWrap>
        <thead><tr><Th>Influencer</Th><Th>Amount</Th><Th>Method</Th><Th>Destination</Th><Th>Status</Th><Th>Requested</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {loading && <EmptyRow colSpan={7} text="Loading payouts…" />}
          {!loading && payouts.length === 0 && <EmptyRow colSpan={7} text="No withdrawal requests with this status." />}
          {!loading && payouts.map(p => (
            <tr key={p.id}>
              <Td>
                <div className="text-white">{p.influencer?.user?.name || '—'}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.influencer?.user?.email}</div>
              </Td>
              <Td><span className="font-semibold" style={{ color: GOLD_LIGHT }}>{fmtMoney(p.amount, p.currency)}</span></Td>
              <Td><span className="text-xs capitalize">{p.withdrawalMethod || '—'}</span></Td>
              <Td><span className="text-xs font-mono">{p.mpesaNumber || '—'}</span></Td>
              <Td>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: p.status === 'completed' ? 'rgba(0,212,170,0.12)' : p.status === 'failed' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                  color: p.status === 'completed' ? '#00D4AA' : p.status === 'failed' ? '#EF4444' : '#F59E0B',
                }}>{p.status}</span>
              </Td>
              <Td>{fmtDate(p.createdAt)}</Td>
              <Td>
                {p.status !== 'completed' && (
                  <div className="flex gap-1.5">
                    <button onClick={() => update(p.id, 'completed')} disabled={updating === p.id}
                      className="px-2 py-1 rounded-lg text-[11px] font-medium border"
                      style={{ borderColor: 'rgba(0,212,170,0.3)', color: '#00D4AA' }}>
                      Mark paid
                    </button>
                    <button onClick={() => update(p.id, 'failed')} disabled={updating === p.id}
                      className="px-2 py-1 rounded-lg text-[11px] font-medium border"
                      style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}>
                      Fail
                    </button>
                  </div>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

// ── Reports ──────────────────────────────────────────────────────────────────

function ReportsSection({ adminToken }: { adminToken: string }) {
  const { data, loading } = useAdminFetch(adminToken, '/api/admin/reports');
  const signups: { date: string; count: number }[] = data?.data?.signupsByDay ?? [];
  const posts: { date: string; count: number }[] = data?.data?.postsByDay ?? [];
  const postStatus = data?.data?.posts30Status;
  const byPlatform: { platform: string; count: number }[] = data?.data?.accountsByPlatform ?? [];
  const byPlan: { plan: string; count: number }[] = data?.data?.usersByPlan ?? [];

  const maxS = Math.max(...signups.map(d => d.count), 1);
  const maxP = Math.max(...posts.map(d => d.count), 1);
  const maxPlat = Math.max(...byPlatform.map(p => p.count), 1);

  return (
    <div className="space-y-4">
      {loading && <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: GOLD }} /></div>}
      {!loading && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <p className="text-sm font-semibold text-white mb-4">Signups — last 30 days</p>
              <div className="flex items-end gap-1 h-28">
                {signups.map((d, i) => (
                  <div key={i} className="flex-1 rounded-t" title={`${d.date}: ${d.count}`}
                    style={{ height: `${Math.max((d.count / maxS) * 100, 3)}%`, background: GOLD, opacity: 0.8 }} />
                ))}
              </div>
            </Card>
            <Card>
              <p className="text-sm font-semibold text-white mb-4">Posts created — last 30 days</p>
              <div className="flex items-end gap-1 h-28">
                {posts.map((d, i) => (
                  <div key={i} className="flex-1 rounded-t" title={`${d.date}: ${d.count}`}
                    style={{ height: `${Math.max((d.count / maxP) * 100, 3)}%`, background: GOLD_LIGHT, opacity: 0.8 }} />
                ))}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <p className="text-sm font-semibold text-white mb-3">Posts by status (30d)</p>
              <div className="space-y-2 text-sm">
                {postStatus && Object.entries(postStatus).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="capitalize" style={{ color: 'rgba(255,255,255,0.5)' }}>{k}</span>
                    <span className="text-white font-medium">{String(v)}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <p className="text-sm font-semibold text-white mb-3">Connected accounts by platform</p>
              {byPlatform.length === 0 ? <p className="text-xs text-white/30">None yet</p> : byPlatform.map(p => (
                <div key={p.platform} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{p.platform}</span>
                    <span className="text-white">{p.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${(p.count / maxPlat) * 100}%`, background: GOLD_LIGHT }} />
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <p className="text-sm font-semibold text-white mb-3">Users by plan</p>
              {byPlan.map(p => (
                <div key={p.plan} className="flex justify-between text-sm">
                  <span className="capitalize" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.plan}</span>
                  <span className="text-white font-medium">{p.count}</span>
                </div>
              ))}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

// ── Settings ─────────────────────────────────────────────────────────────────

const SETTING_FIELDS = [
  { key: 'maintenance_mode', label: 'Maintenance mode', hint: 'Set to "on" to show a maintenance banner (frontend reads this).' },
  { key: 'payout_min_mpesa', label: 'Minimum M-Pesa payout (KES)', hint: 'Minimum withdrawal amount via M-Pesa.' },
  { key: 'payout_min_paypal', label: 'Minimum PayPal payout (KES)', hint: 'Minimum withdrawal amount via PayPal.' },
  { key: 'payout_min_bank', label: 'Minimum bank payout (KES)', hint: 'Minimum withdrawal amount via bank transfer.' },
  { key: 'support_email', label: 'Support email', hint: 'Shown to users on help pages.' },
  { key: 'announcement', label: 'Platform announcement', hint: 'Short message shown across the dashboard. Leave empty for none.' },
];

function SettingsSection({ adminToken }: { adminToken: string }) {
  const { data, loading, reload } = useAdminFetch(adminToken, '/api/admin/settings');
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (data?.data) setValues(data.data);
  }, [data]);

  const save = async () => {
    setSaving(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    await fetch(`${apiBase}/api/admin/settings`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }).catch(() => {});
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
    reload();
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {loading && <Loader2 className="w-5 h-5 animate-spin" style={{ color: GOLD }} />}
      {SETTING_FIELDS.map(f => (
        <Card key={f.key}>
          <label className="text-sm font-medium text-white block mb-1">{f.label}</label>
          <p className="text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.hint}</p>
          <input
            value={values[f.key] ?? ''}
            onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
            placeholder="(not set)"
            className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(201,168,76,0.15)' }}
          />
        </Card>
      ))}
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: '#0A0A0A' }}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
        {savedAt && <span className="text-xs" style={{ color: '#00D4AA' }}>Saved at {savedAt}</span>}
      </div>
    </div>
  );
}
