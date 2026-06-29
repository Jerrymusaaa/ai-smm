import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { aiRateLimit } from '../../shared/middleware/rateLimit.middleware';
import { aiService } from './ai.service';
import { AuthRequest } from '../../shared/types';

const router = Router();
router.use(authenticate);
router.use(aiRateLimit);

// POST /api/ai/caption
router.post('/caption', async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    platform: z.string(),
    topic: z.string().min(1),
    tone: z.string().default('engaging'),
    brandName: z.string().optional(),
    includeHashtags: z.boolean().default(true),
    includeEmojis: z.boolean().default(true),
    language: z.string().default('english'),
  });
  const params = schema.parse(req.body);
  const caption = await aiService.generateCaption(params);
  res.json({ success: true, data: { caption } });
});

// POST /api/ai/hashtags
router.post('/hashtags', async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    topic: z.string().min(1),
    platform: z.string(),
    niche: z.string().optional(),
    includeKenyan: z.boolean().default(true),
  });
  const params = schema.parse(req.body);
  const hashtags = await aiService.suggestHashtags(params);
  res.json({ success: true, data: { hashtags } });
});

// POST /api/ai/calendar
router.post('/calendar', async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    brandName: z.string().min(1),
    niche: z.string().min(1),
    platforms: z.array(z.string()),
    postsPerWeek: z.number().min(1).max(21),
    goals: z.string(),
  });
  const params = schema.parse(req.body);
  const calendar = await aiService.generateContentCalendar(params);
  res.json({ success: true, data: { calendar } });
});

// POST /api/ai/campaign-strategy
router.post('/campaign-strategy', async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    campaignName: z.string(),
    objective: z.string(),
    targetAudience: z.string(),
    budget: z.string(),
    platforms: z.array(z.string()),
    duration: z.string(),
  });
  const params = schema.parse(req.body);
  const strategy = await aiService.generateCampaignStrategy(params);
  res.json({ success: true, data: { strategy } });
});

// POST /api/ai/analytics-insights
router.post('/analytics-insights', async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    followers: z.number(),
    engagement: z.number(),
    reach: z.number(),
    topPosts: z.array(z.any()).default([]),
    period: z.string().default('last 30 days'),
  });
  const params = schema.parse(req.body);
  const insights = await aiService.generateAnalyticsInsights(params);
  res.json({ success: true, data: { insights } });
});

// POST /api/ai/influencer-proposal
router.post('/influencer-proposal', async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    influencerName: z.string(),
    niche: z.string(),
    followers: z.string(),
    campaignBrief: z.string(),
    proposedRate: z.number(),
  });
  const params = schema.parse(req.body);
  const proposal = await aiService.writeInfluencerProposal(params);
  res.json({ success: true, data: { proposal } });
});

// POST /api/ai/chat  (multi-turn chatbot)
router.post('/chat', async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    messages: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })),
    userContext: z.object({
      name: z.string().optional(),
      accountType: z.string().optional(),
      plan: z.string().optional(),
      connectedPlatforms: z.array(z.string()).optional(),
    }).optional(),
  });
  const params = schema.parse(req.body);
  const reply = await aiService.chat(params);
  res.json({ success: true, data: { reply } });
});

// GET /api/ai/trends
router.get('/trends', async (req: AuthRequest, res: Response) => {
  const platform = (req.query.platform as string) || 'instagram';
  const niche = req.query.niche as string | undefined;
  const trends = await aiService.getKenyanTrendSuggestions({ platform, niche });
  res.json({ success: true, data: trends });
});

export { router as aiRouter };
