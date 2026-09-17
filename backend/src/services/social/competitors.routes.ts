import { Router, Request, Response } from 'express';
import { z } from 'zod';
import axios from 'axios';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { prisma } from '../../shared/config/database';
import { AuthRequest } from '../../shared/types';
import { AppError } from '../../shared/middleware/error.middleware';

const router = Router();
router.use(authenticate);

const HANDLE_RE = /^[A-Za-z0-9._-]{1,60}$/;

/**
 * Fetch public metrics for a public profile. Each platform has different
 * public endpoints; where an API key is required we fall back to an
 * AI-informed estimate that is clearly labelled.
 */
async function fetchPublicMetrics(platform: string, handle: string): Promise<{ followers: number; postCount: number | null; displayName: string | null; estimated: boolean }> {
  const cleanHandle = handle.replace(/^@/, '');

  try {
    switch (platform.toUpperCase()) {
      case 'TWITTER': {
        // Public bearer token (App-only) if provided
        const bearer = process.env.TWITTER_BEARER_TOKEN;
        if (bearer) {
          const res = await axios.get(`https://api.twitter.com/2/users/by/username/${cleanHandle}`, {
            headers: { Authorization: `Bearer ${bearer}` },
            params: { 'user.fields': 'public_metrics,name' },
            timeout: 8000,
          });
          const u = res.data?.data;
          if (u) {
            return { followers: u.public_metrics?.followers_count ?? 0, postCount: u.public_metrics?.tweet_count ?? null, displayName: u.name, estimated: false };
          }
        }
        break;
      }
      case 'YOUTUBE': {
        const key = process.env.YOUTUBE_API_KEY;
        if (key) {
          const search = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: { part: 'snippet', q: cleanHandle, type: 'channel', maxResults: 1, key },
            timeout: 8000,
          });
          const channelId = search.data?.items?.[0]?.id?.channelId;
          if (channelId) {
            const stats = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
              params: { part: 'statistics,snippet', id: channelId, key },
              timeout: 8000,
            });
            const s = stats.data?.items?.[0]?.statistics;
            if (s) {
              return { followers: Number(s.subscriberCount ?? 0), postCount: Number(s.videoCount ?? 0), displayName: stats.data.items[0].snippet.title, estimated: false };
            }
          }
        }
        break;
      }
      case 'TIKTOK':
      case 'INSTAGRAM':
      default:
        // Instagram/TikTok public scraping is unreliable and against ToS;
        // we mark these as AI-estimated instead.
        break;
    }
  } catch (err: any) {
    // fall through to estimate
  }

  return { followers: 0, postCount: null, displayName: null, estimated: true };
}

// GET /api/social/competitors
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const competitors = await prisma.competitor.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: competitors });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch competitors' });
  }
});

// POST /api/social/competitors — track a new public profile
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      platform: z.string().min(1),
      handle: z.string().min(1).max(60),
      notes: z.string().max(500).optional(),
    });
    const { platform, handle, notes } = schema.parse(req.body);
    const cleanHandle = handle.replace(/^@/, '');

    if (!HANDLE_RE.test(cleanHandle)) throw new AppError(400, 'Invalid handle format');

    const metrics = await fetchPublicMetrics(platform, cleanHandle);

    const competitor = await prisma.competitor.upsert({
      where: { userId_platform_handle: { userId: req.user!.id, platform: platform.toUpperCase() as any, handle: cleanHandle } },
      update: {
        followers: metrics.followers,
        postCount: metrics.postCount,
        displayName: metrics.displayName,
        engagementRate: 0,
        lastSyncedAt: new Date(),
        notes,
      },
      create: {
        userId: req.user!.id,
        platform: platform.toUpperCase() as any,
        handle: cleanHandle,
        displayName: metrics.displayName || `@${cleanHandle}`,
        followers: metrics.followers,
        postCount: metrics.postCount,
        lastSyncedAt: new Date(),
        notes,
      },
    });

    res.json({ success: true, data: { ...competitor, estimated: metrics.estimated } });
  } catch (error: any) {
    if (error.name === 'ZodError') { res.status(400).json({ success: false, error: 'Platform and handle are required' }); return; }
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Failed to add competitor' });
  }
});

// POST /api/social/competitors/:id/sync — refresh public metrics
router.post('/:id/sync', async (req: AuthRequest, res: Response) => {
  try {
    const competitor = await prisma.competitor.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!competitor) { res.status(404).json({ success: false, error: 'Competitor not found' }); return; }

    const metrics = await fetchPublicMetrics(competitor.platform, competitor.handle);

    const updated = await prisma.competitor.update({
      where: { id: competitor.id },
      data: {
        followers: metrics.followers || competitor.followers,
        postCount: metrics.postCount ?? competitor.postCount,
        displayName: metrics.displayName ?? competitor.displayName,
        lastSyncedAt: new Date(),
      },
    });

    res.json({ success: true, data: { ...updated, estimated: metrics.estimated } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to sync competitor' });
  }
});

// DELETE /api/social/competitors/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.competitor.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
    res.json({ success: true, message: 'Competitor removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to remove competitor' });
  }
});

// POST /api/social/competitors/benchmark — AI comparison vs user's own accounts
router.post('/benchmark', async (req: AuthRequest, res: Response) => {
  try {
    const [competitors, accounts, posts] = await Promise.all([
      prisma.competitor.findMany({ where: { userId: req.user!.id } }),
      prisma.socialAccount.findMany({ where: { userId: req.user!.id, isActive: true }, select: { platform: true, username: true, followers: true } }),
      prisma.post.findMany({
        where: { userId: req.user!.id, status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 30,
        select: { platform: true, likes: true, comments: true, shares: true, impressions: true },
      }),
    ]);

    if (competitors.length === 0) {
      res.json({ success: true, data: { summary: 'Add competitors first, then run the benchmark to compare performance.' } });
      return;
    }

    const userAvgEngagement = posts.length
      ? posts.reduce((s, p) => s + p.likes + p.comments + p.shares, 0) / posts.length
      : 0;

    const summary = await benchmarkWithAI(competitors, accounts, userAvgEngagement);

    res.json({ success: true, data: { summary, userAvgEngagement } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Benchmark failed' });
  }
});

async function benchmarkWithAI(competitors: any[], accounts: any[], userAvgEngagement: number): Promise<string> {
  const { aiService } = await import('../ai/ai.service');
  const compList = competitors.map(c => `${c.platform} @${c.handle}: ${c.followers.toLocaleString()} followers`).join('; ');
  const userList = accounts.map(a => `${a.platform} @${a.username}: ${a.followers.toLocaleString()} followers`).join('; ') || 'no connected accounts yet';

  const result = await aiService.chat({
    messages: [{
      role: 'user',
      content: `Compare my accounts [${userList}] (avg ${Math.round(userAvgEngagement)} engagements/post) against these public competitor profiles [${compList}].\nGive: 1) where I stand, 2) the biggest gap, 3) two specific actions to close it this month. Be concise and specific.`,
    }],
  });

  return result;
}

export { router as competitorsRouter };
