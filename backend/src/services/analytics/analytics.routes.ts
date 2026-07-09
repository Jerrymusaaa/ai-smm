import { Router, Response } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { prisma } from '../../shared/config/database';
import { AuthRequest } from '../../shared/types';
import { subDays, format, eachDayOfInterval, startOfDay } from 'date-fns';
import { logger } from '../../shared/utils/logger';

const router = Router();
router.use(authenticate);

// ── GET /api/analytics/overview ───────────────────────────────────────────────
// Returns real data from connected social accounts + stored analytics
router.get('/overview', async (req: AuthRequest, res: Response) => {
  try {
    const { days = '30' } = req.query;
    const since = subDays(new Date(), Number(days));

    // Get all connected social accounts
    const accounts = await prisma.socialAccount.findMany({
      where: { userId: req.user!.id, isActive: true },
      select: {
        id: true, platform: true, username: true,
        followers: true, following: true, updatedAt: true,
      },
    });

    // Get stored analytics data for these accounts
    const analyticsData = await prisma.analytics.findMany({
      where: {
        socialAccountId: { in: accounts.map(a => a.id) },
        date: { gte: since },
      },
      orderBy: { date: 'asc' },
    });

    // Get published posts for engagement data
    const posts = await prisma.post.findMany({
      where: {
        userId: req.user!.id,
        publishedAt: { gte: since },
        status: 'PUBLISHED',
      },
      select: {
        id: true, platform: true, likes: true, comments: true,
        shares: true, clicks: true, impressions: true, reach: true,
        publishedAt: true,
      },
    });

    const totalFollowers = accounts.reduce((sum, a) => sum + a.followers, 0);
    const totalImpressions = analyticsData.reduce((sum, a) => sum + a.impressions, 0)
      + posts.reduce((sum, p) => sum + p.impressions, 0);
    const totalEngagements = analyticsData.reduce((sum, a) => sum + a.engagements, 0)
      + posts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);
    const totalReach = analyticsData.reduce((sum, a) => sum + a.reach, 0)
      + posts.reduce((sum, p) => sum + p.reach, 0);
    const totalClicks = posts.reduce((sum, p) => sum + p.clicks, 0);

    // Build daily growth chart data
    const dateRange = eachDayOfInterval({ start: since, end: new Date() });
    const chartData = dateRange.map(date => {
      const dateStr = format(date, 'MMM dd');
      const dayAnalytics = analyticsData.filter(
        a => format(new Date(a.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      const dayPosts = posts.filter(
        p => p.publishedAt && format(new Date(p.publishedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );

      return {
        date: dateStr,
        followers: dayAnalytics.reduce((s, a) => s + a.followersGained, 0),
        impressions: dayAnalytics.reduce((s, a) => s + a.impressions, 0) + dayPosts.reduce((s, p) => s + p.impressions, 0),
        engagement: dayAnalytics.reduce((s, a) => s + a.engagements, 0) + dayPosts.reduce((s, p) => s + p.likes + p.comments + p.shares, 0),
        reach: dayAnalytics.reduce((s, a) => s + a.reach, 0) + dayPosts.reduce((s, p) => s + p.reach, 0),
      };
    });

    // Platform breakdown
    const platformBreakdown = accounts.map(account => {
      const accountAnalytics = analyticsData.filter(a => a.socialAccountId === account.id);
      const accountPosts = posts.filter(p => p.platform === account.platform);
      return {
        platform: account.platform,
        username: account.username,
        followers: account.followers,
        impressions: accountAnalytics.reduce((s, a) => s + a.impressions, 0) + accountPosts.reduce((s, p) => s + p.impressions, 0),
        engagement: accountAnalytics.reduce((s, a) => s + a.engagements, 0) + accountPosts.reduce((s, p) => s + p.likes + p.comments + p.shares, 0),
        reach: accountAnalytics.reduce((s, a) => s + a.reach, 0) + accountPosts.reduce((s, p) => s + p.reach, 0),
      };
    });

    res.json({
      success: true,
      data: {
        hasConnectedAccounts: accounts.length > 0,
        connectedAccounts: accounts.length,
        totalFollowers,
        totalImpressions,
        totalEngagements,
        totalReach,
        totalClicks,
        engagementRate: totalReach > 0 ? ((totalEngagements / totalReach) * 100).toFixed(2) : '0',
        postsCount: posts.length,
        chartData,
        platformBreakdown,
        accounts,
        period: `Last ${days} days`,
      },
    });
  } catch (error: any) {
    logger.error('Analytics overview error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
});

// ── GET /api/analytics/posts/top ─────────────────────────────────────────────
router.get('/posts/top', async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '10', days = '30' } = req.query;
    const since = subDays(new Date(), Number(days));

    const posts = await prisma.post.findMany({
      where: {
        userId: req.user!.id,
        publishedAt: { gte: since },
        status: 'PUBLISHED',
      },
      orderBy: { impressions: 'desc' },
      take: Number(limit),
    });

    res.json({ success: true, data: posts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch top posts' });
  }
});

// ── GET /api/analytics/platforms ─────────────────────────────────────────────
router.get('/platforms', async (req: AuthRequest, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch platform analytics' });
  }
});

// ── POST /api/analytics/sync ──────────────────────────────────────────────────
// Manually trigger a sync of analytics data from connected platforms
router.post('/sync', async (req: AuthRequest, res: Response) => {
  try {
    const accounts = await prisma.socialAccount.findMany({
      where: { userId: req.user!.id, isActive: true },
    });

    if (accounts.length === 0) {
      res.json({ success: true, message: 'No connected accounts to sync', synced: 0 });
      return;
    }

    // For each connected account, we would normally call the platform API
    // For now, we record that a sync was attempted and return current DB data
    // When OAuth is fully set up, this is where platform API calls go
    const results = await Promise.all(
      accounts.map(async (account) => {
        try {
          // TODO: Call platform-specific API based on account.platform
          // e.g. for Instagram: call Graph API with account.accessToken
          // e.g. for Twitter: call Twitter API v2 with account.accessToken

          // For now, return current stored data
          return {
            platform: account.platform,
            username: account.username,
            followers: account.followers,
            status: 'current_data',
          };
        } catch (err: any) {
          return {
            platform: account.platform,
            username: account.username,
            status: 'error',
            error: err.message,
          };
        }
      })
    );

    res.json({ success: true, message: 'Sync complete', synced: accounts.length, results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Sync failed' });
  }
});

// ── GET /api/analytics/ai-insights ───────────────────────────────────────────
router.get('/ai-insights', async (req: AuthRequest, res: Response) => {
  try {
    const { days = '30' } = req.query;
    const since = subDays(new Date(), Number(days));

    const accounts = await prisma.socialAccount.findMany({
      where: { userId: req.user!.id, isActive: true },
      select: { platform: true, followers: true },
    });

    const posts = await prisma.post.findMany({
      where: { userId: req.user!.id, publishedAt: { gte: since }, status: 'PUBLISHED' },
      select: { likes: true, comments: true, shares: true, impressions: true, reach: true },
    });

    if (accounts.length === 0) {
      res.json({
        success: true,
        data: {
          insights: 'Connect your social media accounts to get AI-powered insights about your performance.',
          hasData: false,
        },
      });
      return;
    }

    const totalFollowers = accounts.reduce((s, a) => s + a.followers, 0);
    const totalEngagement = posts.reduce((s, p) => s + p.likes + p.comments + p.shares, 0);
    const totalReach = posts.reduce((s, p) => s + p.reach, 0);

    // Use AI to generate insights
    try {
      const { aiService } = await import('../ai/ai.service');
      const insights = await (aiService as any).chat({
        messages: [{
          role: 'user',
          content: `Generate 3-4 specific, actionable social media performance insights for a Kenyan creator with:
- ${accounts.length} connected platform(s): ${accounts.map(a => a.platform).join(', ')}
- ${totalFollowers.toLocaleString()} total followers
- ${posts.length} posts published in the last ${days} days
- ${totalEngagement.toLocaleString()} total engagements
- ${totalReach.toLocaleString()} total reach
- Engagement rate: ${totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(2) : 0}%

Focus on Kenyan social media context. Be specific and actionable. Keep each insight to 1-2 sentences.`
        }],
      });
      res.json({ success: true, data: { insights, hasData: true } });
    } catch {
      res.json({
        success: true,
        data: {
          insights: `You have ${totalFollowers.toLocaleString()} followers across ${accounts.length} platform(s). Post consistently and engage with your audience to grow your reach.`,
          hasData: true,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to generate insights' });
  }
});

export { router as analyticsRouter };
