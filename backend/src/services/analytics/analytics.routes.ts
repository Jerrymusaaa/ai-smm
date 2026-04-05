import { Router, Response } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { prisma } from '../../shared/config/database';
import { AuthRequest } from '../../shared/types';
import { subDays, startOfDay } from 'date-fns';

const router = Router();
router.use(authenticate);

// GET /api/analytics/overview
router.get('/overview', async (req: AuthRequest, res: Response) => {
  const { days = 30 } = req.query;
  const since = subDays(new Date(), Number(days));

  const accounts = await prisma.socialAccount.findMany({
    where: { userId: req.user!.id, isActive: true },
    select: { id: true, platform: true, followers: true, username: true },
  });

  const totalFollowers = accounts.reduce((sum, a) => sum + a.followers, 0);

  const recentPosts = await prisma.post.findMany({
    where: { userId: req.user!.id, publishedAt: { gte: since }, status: 'PUBLISHED' },
    select: { likes: true, comments: true, shares: true, clicks: true, impressions: true, reach: true, platform: true },
  });

  const totals = recentPosts.reduce((acc, p) => ({
    likes: acc.likes + p.likes,
    comments: acc.comments + p.comments,
    shares: acc.shares + p.shares,
    clicks: acc.clicks + p.clicks,
    impressions: acc.impressions + p.impressions,
    reach: acc.reach + p.reach,
  }), { likes: 0, comments: 0, shares: 0, clicks: 0, impressions: 0, reach: 0 });

  res.json({
    success: true,
    data: {
      totalFollowers,
      platforms: accounts,
      engagements: totals.likes + totals.comments + totals.shares,
      ...totals,
      postsCount: recentPosts.length,
    },
  });
});

// GET /api/analytics/posts/top
router.get('/posts/top', async (req: AuthRequest, res: Response) => {
  const { limit = 10, days = 30 } = req.query;
  const since = subDays(new Date(), Number(days));

  const posts = await prisma.post.findMany({
    where: { userId: req.user!.id, publishedAt: { gte: since }, status: 'PUBLISHED' },
    orderBy: { impressions: 'desc' },
    take: Number(limit),
  });

  res.json({ success: true, data: posts });
});

// GET /api/analytics/platforms
router.get('/platforms', async (req: AuthRequest, res: Response) => {
  const accounts = await prisma.socialAccount.findMany({
    where: { userId: req.user!.id, isActive: true },
    include: {
      analytics: {
        orderBy: { date: 'desc' },
        take: 30,
      },
    },
  });
  res.json({ success: true, data: accounts });
});

export { router as analyticsRouter };
