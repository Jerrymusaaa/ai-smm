import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { aiRateLimit } from '../../shared/middleware/rateLimit.middleware';
import { aiService } from './ai.service';
import { AuthRequest } from '../../shared/types';

const router = Router();
router.use(authenticate);
router.use(aiRateLimit);

router.post('/chat', async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() })),
      userContext: z.object({
        name: z.string().optional(),
        accountType: z.string().optional(),
        plan: z.string().optional(),
        connectedPlatforms: z.array(z.string()).optional(),
      }).optional(),
    });
    const params = schema.parse(req.body) as Parameters<typeof aiService.chat>[0];
    const reply = await aiService.chat(params);
    res.json({ success: true, data: { reply } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI request failed' });
  }
});

router.post('/caption', async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      platform: z.string(), topic: z.string().min(1), tone: z.string().default('engaging'),
      brandName: z.string().optional(), includeHashtags: z.boolean().default(true),
      includeEmojis: z.boolean().default(true), language: z.string().default('english'),
      useStyle: z.boolean().default(false),
    });
    const params = schema.parse(req.body) as Parameters<typeof aiService.generateCaption>[0];
    const caption = await aiService.generateCaption({ ...params, userId: req.user!.id });
    res.json({ success: true, data: { caption } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI request failed' });
  }
});

router.post('/hashtags', async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      topic: z.string().min(1), platform: z.string(), niche: z.string().optional(),
      includeKenyan: z.boolean().default(true),
    });
    const params = schema.parse(req.body) as Parameters<typeof aiService.suggestHashtags>[0];
    const hashtags = await aiService.suggestHashtags(params);
    res.json({ success: true, data: { hashtags } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI request failed' });
  }
});

router.get('/trends', async (req: AuthRequest, res: Response) => {
  try {
    const platform = (req.query.platform as string) || 'instagram';
    const niche = req.query.niche as string | undefined;
    const trends = await aiService.getKenyanTrendSuggestions({ platform, niche });
    res.json({ success: true, data: trends });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI request failed' });
  }
});

// ── Style learning: AI studies the user's own posts to learn their voice ────

router.post('/style/learn', async (req: AuthRequest, res: Response) => {
  try {
    const result = await aiService.learnUserStyle(req.user!.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to learn style' });
  }
});

router.get('/style', async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, data: await aiService.getStoredStyle(req.user!.id) });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch style' });
  }
});

// ── Trending sounds (TikTok / Reels) ────────────────────────────────────────

router.get('/sounds', async (req: AuthRequest, res: Response) => {
  try {
    const platform = (req.query.platform as string) || 'tiktok';
    const niche = req.query.niche as string | undefined;
    const data = await aiService.getTrendingSounds({ platform, niche });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI request failed' });
  }
});

// ── A/B test variations ─────────────────────────────────────────────────────

router.post('/ab-variations', async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      platform: z.string(), topic: z.string().min(1), count: z.number().min(2).max(4).default(3),
    });
    const { platform, topic, count } = schema.parse(req.body);
    const variations = await aiService.generateABVariations({ platform, topic, count, userId: req.user!.id });
    res.json({ success: true, data: { variations } });
  } catch (error: any) {
    if (error.name === 'ZodError') { res.status(400).json({ success: false, error: 'Invalid A/B request' }); return; }
    res.status(500).json({ success: false, error: error.message || 'AI request failed' });
  }
});

// ── Best posting times (Kenyan rhythms + user's own engagement data) ────────

router.get('/best-times', async (req: AuthRequest, res: Response) => {
  try {
    const platform = req.query.platform as string | undefined;
    const data = await aiService.getBestPostingTimes(req.user!.id, platform);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI request failed' });
  }
});

export { router as aiRouter };
