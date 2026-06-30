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
    const params = schema.parse(req.body);
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
    });
    const params = schema.parse(req.body);
    const caption = await aiService.generateCaption(params);
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
    const params = schema.parse(req.body);
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

export { router as aiRouter };
