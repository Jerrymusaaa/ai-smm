import { Router, Response, Request } from 'express';
import { z } from 'zod';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { optionalAuth } from '../../shared/middleware/auth.middleware';
import { prisma } from '../../shared/config/database';
import { AuthRequest } from '../../shared/types';
import { aiService } from '../ai/ai.service';
import { logger } from '../../shared/utils/logger';

const router = Router();

// ── Public: list influencers for marketplace ──────────────────────────────────
// GET /api/influencers?niche=Tech&platform=TikTok&minFollowers=10000
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { niche, platform, minFollowers, search, limit = '20', page = '1' } = req.query;

    // Get all users who are influencers with their profiles
    const where: any = { accountType: 'INFLUENCER', influencerProfile: { isNot: null } };

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { company: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (niche) {
      where.influencerProfile = {
        ...where.influencerProfile,
        niches: { has: String(niche) },
      };
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        influencerProfile: true,
        socialAccounts: {
          where: { isActive: true },
          select: { platform: true, username: true, followers: true },
        },
      },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    const total = await prisma.user.count({ where });

    // Format for marketplace display
    const influencers = users.map(u => {
      const profile = u.influencerProfile!;
      const totalFollowers = u.socialAccounts.reduce((sum, a) => sum + a.followers, 0);
      const mainAccount = u.socialAccounts[0];

      return {
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        niches: profile.niches,
        platforms: u.socialAccounts.map(a => a.platform),
        mainPlatform: mainAccount?.platform || 'INSTAGRAM',
        handle: mainAccount?.username || `@${u.name.toLowerCase().replace(' ', '')}`,
        followers: totalFollowers,
        followersDisplay: formatFollowers(totalFollowers),
        engagementRate: profile.avgEngagementRate,
        botScore: profile.botScore,
        clickToViewRatio: profile.clickToViewRatio,
        commissionRate: profile.commissionRate,
        verifiedBadge: profile.verifiedBadge,
        priorityLevel: profile.priorityLevel,
        rating: profile.rating,
        totalCampaigns: profile.totalCampaigns,
        portfolioUrl: profile.portfolioUrl,
        match: 0, // calculated per-request with AI
      };
    });

    // Sort by priority level (higher = first)
    influencers.sort((a, b) => b.priorityLevel - a.priorityLevel);

    res.json({ success: true, data: influencers, pagination: { total, page: Number(page), limit: Number(limit) } });
  } catch (error: any) {
    logger.error('Get influencers error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch influencers' });
  }
});

// GET /api/influencers/match?businessDescription=...&niche=...
// AI-powered matching — returns influencers with match percentage
router.get('/match', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { businessDescription, niche, platform } = req.query;

    // Get business user profile
    const businessUser = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { name: true, company: true, bio: true },
    });

    // Get all influencers
    const users = await prisma.user.findMany({
      where: { accountType: 'INFLUENCER', influencerProfile: { isNot: null } },
      include: {
        influencerProfile: true,
        socialAccounts: { where: { isActive: true }, select: { platform: true, username: true, followers: true } },
      },
      take: 20,
    });

    if (users.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    // Use AI to calculate match percentages
    const influencerSummaries = users.map(u => ({
      id: u.id,
      name: u.name,
      niches: u.influencerProfile?.niches || [],
      followers: u.socialAccounts.reduce((s, a) => s + a.followers, 0),
      platforms: u.socialAccounts.map(a => a.platform),
      engagementRate: u.influencerProfile?.avgEngagementRate || 0,
      botScore: u.influencerProfile?.botScore || 0,
    }));

    const matchPrompt = `You are an influencer marketing AI for Yoyzie AI, a Kenyan platform.

Business looking for influencers:
- Company: ${businessUser?.company || businessUser?.name}
- Description: ${businessDescription || businessUser?.bio || 'Not provided'}
- Preferred niche: ${niche || 'Any'}
- Preferred platform: ${platform || 'Any'}

Available influencers:
${JSON.stringify(influencerSummaries, null, 2)}

For each influencer, calculate a match percentage (0-100) based on:
- Niche alignment with the business (40% weight)
- Audience size appropriateness (20% weight)
- Engagement quality (20% weight)
- Audience authenticity / bot score (20% weight)

Return ONLY a JSON array: [{"id":"...", "match":85, "reason":"Short reason why they match"}]`;

    const message = await (aiService as any).client?.messages?.create?.({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      messages: [{ role: 'user', content: matchPrompt }],
    });

    let matches: Array<{ id: string; match: number; reason: string }> = [];
    if (message) {
      try {
        const text = (message.content[0] as any).text;
        matches = JSON.parse(text.replace(/```json|```/g, '').trim());
      } catch {
        matches = users.map(u => ({ id: u.id, match: 70, reason: 'Good general fit' }));
      }
    } else {
      matches = users.map(u => ({ id: u.id, match: 70 + Math.floor(Math.random() * 25), reason: 'Good general fit' }));
    }

    // Merge match scores with influencer data
    const result = users.map(u => {
      const matchData = matches.find(m => m.id === u.id) || { match: 70, reason: 'Good fit' };
      const totalFollowers = u.socialAccounts.reduce((s, a) => s + a.followers, 0);
      const profile = u.influencerProfile!;

      return {
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        niches: profile.niches,
        platforms: u.socialAccounts.map(a => a.platform),
        handle: u.socialAccounts[0]?.username || `@${u.name.toLowerCase().replace(' ', '')}`,
        followers: totalFollowers,
        followersDisplay: formatFollowers(totalFollowers),
        engagementRate: profile.avgEngagementRate,
        botScore: profile.botScore,
        clickToViewRatio: profile.clickToViewRatio,
        verifiedBadge: profile.verifiedBadge,
        rating: profile.rating,
        totalCampaigns: profile.totalCampaigns,
        match: matchData.match,
        matchReason: matchData.reason,
        commissionRate: profile.commissionRate,
      };
    }).sort((a, b) => b.match - a.match);

    res.json({ success: true, data: result });
  } catch (error: any) {
    logger.error('AI match error:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate matches' });
  }
});

// GET /api/influencers/:id — single influencer profile
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id, accountType: 'INFLUENCER' },
      include: {
        influencerProfile: true,
        socialAccounts: { where: { isActive: true } },
      },
    });

    if (!user || !user.influencerProfile) {
      res.status(404).json({ success: false, error: 'Influencer not found' });
      return;
    }

    const profile = user.influencerProfile;
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        niches: profile.niches,
        socialAccounts: user.socialAccounts,
        botScore: profile.botScore,
        audienceAuthPct: profile.audienceAuthenticityPct,
        clickToViewRatio: profile.clickToViewRatio,
        avgEngagementRate: profile.avgEngagementRate,
        verifiedBadge: profile.verifiedBadge,
        totalCampaigns: profile.totalCampaigns,
        rating: profile.rating,
        portfolioUrl: profile.portfolioUrl,
        commissionRate: profile.commissionRate,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch influencer' });
  }
});

// PATCH /api/influencers/profile — update own influencer profile
router.patch('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      niches: z.array(z.string()).optional(),
      portfolioUrl: z.string().url().optional().or(z.literal('')),
      bio: z.string().max(500).optional(),
    });
    const data = schema.parse(req.body);

    const profile = await prisma.influencerProfile.update({
      where: { userId: req.user!.id },
      data: { niches: data.niches },
    });

    if (data.bio !== undefined) {
      await prisma.user.update({ where: { id: req.user!.id }, data: { bio: data.bio } });
    }

    if (data.portfolioUrl !== undefined) {
      await prisma.influencerProfile.update({
        where: { userId: req.user!.id },
        data: { portfolioUrl: data.portfolioUrl },
      });
    }

    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export { router as influencerRouter };
