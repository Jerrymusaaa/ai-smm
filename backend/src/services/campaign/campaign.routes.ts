import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { prisma } from '../../shared/config/database';
import { AuthRequest } from '../../shared/types';

const router = Router();
router.use(authenticate);

const campaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.string(),
  goal: z.string().optional(),
  platforms: z.array(z.string()),
  budget: z.number().min(0).default(0),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  aiAssist: z.boolean().default(true),
});

// GET /api/campaigns
router.get('/', async (req: AuthRequest, res: Response) => {
  const { status } = req.query;
  const where: any = { userId: req.user!.id };
  if (status) where.status = status;

  const campaigns = await prisma.campaign.findMany({
    where,
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: campaigns });
});

// POST /api/campaigns
router.post('/', async (req: AuthRequest, res: Response) => {
  const data = campaignSchema.parse(req.body);
  const campaign = await prisma.campaign.create({
    data: { ...data, userId: req.user!.id, platforms: data.platforms as any[] },
  });
  res.status(201).json({ success: true, data: campaign });
});

// GET /api/campaigns/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const campaign = await prisma.campaign.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: { posts: true },
  });
  if (!campaign) { res.status(404).json({ success: false, error: 'Campaign not found' }); return; }
  res.json({ success: true, data: campaign });
});

// PATCH /api/campaigns/:id
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const data = campaignSchema.partial().parse(req.body);
  const campaign = await prisma.campaign.updateMany({
    where: { id: req.params.id, userId: req.user!.id },
    data: data as any,
  });
  if (!campaign.count) { res.status(404).json({ success: false, error: 'Campaign not found' }); return; }
  res.json({ success: true, message: 'Campaign updated' });
});

// PATCH /api/campaigns/:id/status
router.patch('/:id/status', async (req: AuthRequest, res: Response) => {
  const { status } = z.object({ status: z.enum(['DRAFT','SCHEDULED','ACTIVE','PAUSED','COMPLETED','CANCELED']) }).parse(req.body);
  await prisma.campaign.updateMany({
    where: { id: req.params.id, userId: req.user!.id },
    data: { status },
  });
  res.json({ success: true, message: 'Campaign status updated' });
});

// DELETE /api/campaigns/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await prisma.campaign.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
  res.json({ success: true, message: 'Campaign deleted' });
});

export { router as campaignRouter };
