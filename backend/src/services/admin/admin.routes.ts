import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/config/database';
import { logger } from '../../shared/utils/logger';

const router = Router();

// Admin auth middleware
function adminAuth(req: any, res: Response, next: any) {
  const token = req.headers.authorization?.slice(7);
  if (!token) { res.status(401).json({ success: false, error: 'Admin token required' }); return; }
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET!) as any;
    if (!decoded.isAdmin) { res.status(403).json({ success: false, error: 'Admin access required' }); return; }
    req.adminUser = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired admin token' });
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

// POST /api/admin/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, adminCode } = req.body;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yoyzie.ai';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'yoyzie_admin_2026';
    const ADMIN_CODE = process.env.ADMIN_CODE || '247365';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD || adminCode !== ADMIN_CODE) {
      logger.warn(`Failed admin login attempt: ${email} from ${req.ip}`);
      res.status(401).json({ success: false, error: 'Invalid admin credentials' });
      return;
    }

    const token = jwt.sign(
      { email, isAdmin: true, role: 'super_admin' },
      process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );

    logger.info(`Admin login: ${email} from ${req.ip}`);
    res.json({ success: true, data: { token, role: 'super_admin' } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// ── Overview: real-time stats (all values computed from the database) ───────

// GET /api/admin/stats
router.get('/stats', adminAuth, async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const d30 = new Date(now.getTime() - 30 * 864e5);
    const d7 = new Date(now.getTime() - 7 * 864e5);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalInfluencers,
      totalBusinesses,
      activeSubscriptions,
      newUsersToday,
      verifiedUsers,
      unverifiedOld,
      totalPosts,
      scheduledPosts,
      publishedPosts,
      connectedAccounts,
      activeCampaigns,
      pendingPayoutCount,
      botReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { accountType: 'INFLUENCER' } }),
      prisma.user.count({ where: { accountType: { in: ['BUSINESS', 'ENTERPRISE'] } } }),
      prisma.subscription.count({ where: { status: 'ACTIVE', plan: { not: 'FREE' } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.count({ where: { emailVerified: false, createdAt: { lt: d7 } } }),
      prisma.post.count(),
      prisma.post.count({ where: { status: 'SCHEDULED' } }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.socialAccount.count({ where: { isActive: true } }),
      prisma.campaign.count({ where: { status: 'ACTIVE' } }),
      prisma.walletTransaction.count({ where: { type: 'WITHDRAWAL', status: 'processing' } }).catch(() => 0),
      prisma.botDetectionReport.count().catch(() => 0),
    ]);

    // Real revenue: sum of paid invoices
    const [revenueAllTime, revenueThisMonth, revenueLast30] = await Promise.all([
      prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: { in: ['paid', 'succeeded', 'PAID'] } } }).catch(() => ({ _sum: { amount: null } })),
      prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: { in: ['paid', 'succeeded', 'PAID'] }, paidAt: { gte: startOfMonth } } }).catch(() => ({ _sum: { amount: null } })),
      prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: { in: ['paid', 'succeeded', 'PAID'] }, paidAt: { gte: d30 } } }).catch(() => ({ _sum: { amount: null } })),
    ]);

    // Pending payout value
    const pendingPayoutAgg = await prisma.walletTransaction
      .aggregate({ _sum: { amount: true }, where: { type: 'WITHDRAWAL', status: 'processing' } })
      .catch(() => ({ _sum: { amount: null } }));

    // Signups per day for the last 14 days (real chart)
    const recentUsers = await prisma.user.findMany({
      where: { createdAt: { gte: new Date(now.getTime() - 14 * 864e5) } },
      select: { createdAt: true },
    });
    const signupsByDay: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 864e5);
      const key = day.toISOString().slice(0, 10);
      const label = day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      signupsByDay.push({
        date: label,
        count: recentUsers.filter(u => u.createdAt.toISOString().slice(0, 10) === key).length,
      });
    }

    res.json({
      success: true,
      data: {
        totalUsers,
        totalInfluencers,
        totalBusinesses,
        activeSubscriptions,
        flaggedAccounts: unverifiedOld,
        pendingPayouts: pendingPayoutCount,
        pendingPayoutValue: pendingPayoutAgg._sum.amount ?? 0,
        monthlyRevenue: revenueThisMonth._sum.amount ?? 0,
        revenue30d: revenueLast30._sum.amount ?? 0,
        revenueAllTime: revenueAllTime._sum.amount ?? 0,
        newUsersToday,
        verifiedUsers,
        totalPosts,
        scheduledPosts,
        publishedPosts,
        connectedAccounts,
        activeCampaigns,
        botReports,
        signupsByDay,
        generatedAt: now.toISOString(),
      },
    });
  } catch (error: any) {
    logger.error('Admin stats error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// ── Users ────────────────────────────────────────────────────────────────────

// GET /api/admin/users?search=&accountType=&page=&limit=
router.get('/users', adminAuth, async (req: Request, res: Response) => {
  try {
    const { search, accountType, plan, page = '1', limit = '50' } = req.query;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (accountType && accountType !== 'all') where.accountType = String(accountType).toUpperCase();
    if (plan && plan !== 'all') where.subscription = { plan: String(plan).toUpperCase() };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, email: true, name: true, avatar: true,
          accountType: true, emailVerified: true, onboardingDone: true,
          lastLoginAt: true, createdAt: true,
          subscription: { select: { plan: true, status: true } },
          _count: { select: { posts: true, socialAccounts: true, sessions: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: Math.min(Number(limit), 100),
        skip: (Number(page) - 1) * Number(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users.map(u => ({ ...u, plan: u.subscription?.plan || 'FREE' })),
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error: any) {
    logger.error('Admin users error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// GET /api/admin/users/:id — full detail
router.get('/users/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, email: true, name: true, avatar: true, accountType: true, company: true,
        bio: true, emailVerified: true, emailVerifiedAt: true, onboardingDone: true,
        lastLoginAt: true, createdAt: true,
        subscription: { select: { plan: true, status: true, currentPeriodEnd: true, trialEndsAt: true } },
        socialAccounts: { select: { platform: true, username: true, followers: true, isActive: true } },
        _count: { select: { posts: true, sessions: true, campaigns: true } },
      },
    });
    if (!user) { res.status(404).json({ success: false, error: 'User not found' }); return; }

    const influencerProfile = await prisma.influencerProfile.findUnique({
      where: { userId: user.id },
      select: { walletBalance: true, pendingBalance: true, totalEarnings: true, commissionRate: true },
    }).catch(() => null);

    res.json({ success: true, data: { ...user, influencerProfile } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// POST /api/admin/users/:id/suspend — revoke all sessions (kills refresh tokens)
router.post('/users/:id/suspend', adminAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { email: true } });
    if (!user) { res.status(404).json({ success: false, error: 'User not found' }); return; }
    await prisma.session.deleteMany({ where: { userId: req.params.id } });
    logger.info(`Admin suspended user ${req.params.id} (${user.email}) — all sessions revoked`);
    res.json({ success: true, message: 'All sessions revoked. The user is signed out and cannot refresh their token.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to suspend user' });
  }
});

// ── Influencers ──────────────────────────────────────────────────────────────

// GET /api/admin/influencers
router.get('/influencers', adminAuth, async (req: Request, res: Response) => {
  try {
    const profiles = await prisma.influencerProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true, emailVerified: true } },
      },
      orderBy: { totalEarnings: 'desc' },
      take: 200,
    });
    const totalWallet = profiles.reduce((s, p) => s + (p.walletBalance || 0), 0);
    const totalPending = profiles.reduce((s, p) => s + (p.pendingBalance || 0), 0);
    const totalEarnings = profiles.reduce((s, p) => s + (p.totalEarnings || 0), 0);
    res.json({ success: true, data: profiles, totals: { count: profiles.length, totalWallet, totalPending, totalEarnings } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch influencers' });
  }
});

// ── Payouts ──────────────────────────────────────────────────────────────────

// GET /api/admin/payouts?status=
router.get('/payouts', adminAuth, async (req: Request, res: Response) => {
  try {
    const { status, page = '1', limit = '50' } = req.query;
    const where: any = { type: 'WITHDRAWAL' };
    if (status && status !== 'all') where.status = String(status);

    const [payouts, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where,
        include: { influencer: { select: { user: { select: { name: true, email: true } } } } },
        orderBy: { createdAt: 'desc' },
        take: Math.min(Number(limit), 100),
        skip: (Number(page) - 1) * Number(limit),
      }),
      prisma.walletTransaction.count({ where }),
    ]);
    res.json({ success: true, data: payouts, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch payouts' });
  }
});

// PATCH /api/admin/payouts/:id — mark completed / failed
router.patch('/payouts/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const schema = z.object({ status: z.enum(['completed', 'failed', 'processing']) });
    const { status } = schema.parse(req.body);
    const payout = await prisma.walletTransaction.update({
      where: { id: req.params.id },
      data: { status, processedAt: status === 'processing' ? null : new Date() },
    });
    logger.info(`Admin set payout ${req.params.id} → ${status}`);
    res.json({ success: true, data: payout });
  } catch (error: any) {
    if (error.name === 'ZodError') { res.status(400).json({ success: false, error: 'Invalid status' }); return; }
    res.status(500).json({ success: false, error: 'Failed to update payout' });
  }
});

// ── Billing ──────────────────────────────────────────────────────────────────

// GET /api/admin/billing
router.get('/billing', adminAuth, async (req: Request, res: Response) => {
  try {
    const [invoices, subsByPlan, totals] = await Promise.all([
      prisma.invoice.findMany({
        include: { subscription: { select: { user: { select: { name: true, email: true } } } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.subscription.groupBy({ by: ['plan'], _count: { _all: true }, where: { status: 'ACTIVE' } }),
      prisma.invoice.aggregate({
        _sum: { amount: true }, _count: { _all: true },
        where: { status: { in: ['paid', 'succeeded', 'PAID'] } },
      }),
    ]);
    res.json({
      success: true,
      data: invoices,
      subscriptionsByPlan: subsByPlan.map(s => ({ plan: s.plan, count: s._count._all })),
      totals: { paidInvoices: totals._count._all, totalRevenue: totals._sum.amount ?? 0 },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch billing' });
  }
});

// ── Reports (aggregates) ─────────────────────────────────────────────────────

// GET /api/admin/reports
router.get('/reports', adminAuth, async (req: Request, res: Response) => {
  try {
    const d30 = new Date(Date.now() - 30 * 864e5);
    const now = new Date();

    const [users30, posts30, platformCounts, accountsByPlatform] = await Promise.all([
      prisma.user.findMany({ where: { createdAt: { gte: d30 } }, select: { createdAt: true } }),
      prisma.post.findMany({ where: { createdAt: { gte: d30 } }, select: { createdAt: true, status: true, platform: true } }),
      prisma.subscription.groupBy({ by: ['plan'], _count: { _all: true } }),
      prisma.socialAccount.groupBy({ by: ['platform'], _count: { _all: true }, where: { isActive: true } }),
    ]);

    const signupsByDay: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 864e5);
      const key = day.toISOString().slice(0, 10);
      const label = day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      signupsByDay.push({ date: label, count: users30.filter(u => u.createdAt.toISOString().slice(0, 10) === key).length });
    }

    const postsByDay: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 864e5);
      const key = day.toISOString().slice(0, 10);
      const label = day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      postsByDay.push({ date: label, count: posts30.filter(p => p.createdAt.toISOString().slice(0, 10) === key).length });
    }

    res.json({
      success: true,
      data: {
        signupsByDay,
        postsByDay,
        posts30Status: {
          published: posts30.filter(p => p.status === 'PUBLISHED').length,
          scheduled: posts30.filter(p => p.status === 'SCHEDULED').length,
          draft: posts30.filter(p => p.status === 'DRAFT').length,
          failed: posts30.filter(p => p.status === 'FAILED').length,
        },
        usersByPlan: platformCounts.map(p => ({ plan: p.plan, count: p._count._all })),
        accountsByPlatform: accountsByPlatform.map(p => ({ platform: p.platform, count: p._count._all })),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch reports' });
  }
});

// ── Platform Settings (key-value store) ──────────────────────────────────────

// GET /api/admin/settings
router.get('/settings', adminAuth, async (req: Request, res: Response) => {
  try {
    const settings = await prisma.platformSetting.findMany();
    res.json({ success: true, data: Object.fromEntries(settings.map(s => [s.key, s.value])) });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
});

// PUT /api/admin/settings — body: { [key]: string }
router.put('/settings', adminAuth, async (req: Request, res: Response) => {
  try {
    const body = z.record(z.string(), z.string().max(2000)).parse(req.body);
    for (const [key, value] of Object.entries(body)) {
      await prisma.platformSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    logger.info(`Admin settings updated: ${Object.keys(body).join(', ')}`);
    const settings = await prisma.platformSetting.findMany();
    res.json({ success: true, data: Object.fromEntries(settings.map(s => [s.key, s.value])) });
  } catch (error: any) {
    if (error.name === 'ZodError') { res.status(400).json({ success: false, error: 'Invalid settings payload' }); return; }
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
});

// ── Data deletion requests (public endpoint kept for the /data-deletion page)

// POST /api/admin/request-deletion
router.post('/request-deletion', async (req: Request, res: Response) => {
  try {
    const { email, reason } = req.body;
    logger.info(`Data deletion request: ${email} — ${reason || 'No reason'}`);
    res.json({ success: true, message: 'Deletion request received' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to submit request' });
  }
});

export { router as adminRouter };
