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

// GET /api/admin/stats
router.get('/stats', adminAuth, async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalInfluencers, totalBusinesses, activeSubscriptions, flaggedAccounts, newUsersToday] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { accountType: 'INFLUENCER' } }),
      prisma.user.count({ where: { accountType: { in: ['BUSINESS', 'ENTERPRISE'] } } }),
      prisma.subscription.count({ where: { status: 'ACTIVE', plan: { not: 'FREE' } } }),
      prisma.user.count({ where: { emailVerified: false, createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.user.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    ]);

    const pendingPayouts = await prisma.walletTransaction.count({ where: { type: 'WITHDRAWAL', status: 'processing' } }).catch(() => 0);

    res.json({
      success: true,
      data: { totalUsers, totalInfluencers, totalBusinesses, activeSubscriptions, flaggedAccounts, pendingPayouts, monthlyRevenue: 0, newUsersToday },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/users
router.get('/users', adminAuth, async (req: Request, res: Response) => {
  try {
    const { search, page = '1', limit = '50' } = req.query;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: { subscription: { select: { plan: true, status: true } } },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      select: { id: true, name: true, email: true, accountType: true, emailVerified: true, createdAt: true, lastLoginAt: true, subscription: true },
    });

    res.json({
      success: true,
      data: users.map(u => ({ ...u, plan: u.subscription?.plan || 'FREE' })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// POST /api/admin/users/:id/suspend
router.post('/users/:id/suspend', adminAuth, async (req: Request, res: Response) => {
  try {
    await prisma.session.deleteMany({ where: { userId: req.params.id } });
    logger.info(`Admin suspended user: ${req.params.id}`);
    res.json({ success: true, message: 'User sessions terminated (suspended)' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to suspend user' });
  }
});

// POST /api/auth/request-deletion
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
