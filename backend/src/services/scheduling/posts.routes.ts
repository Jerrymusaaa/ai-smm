import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { prisma } from '../../shared/config/database';
import { AuthRequest } from '../../shared/types';

const router = Router();
router.use(authenticate);

const postSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  hashtags: z.array(z.string()).default([]),
  mediaUrls: z.array(z.string()).default([]),
  platform: z.string(),
  scheduledAt: z.string().datetime().optional(),
  status: z.enum(['DRAFT', 'SCHEDULED']).default('DRAFT'),
  socialAccountId: z.string().optional(),
  campaignId: z.string().optional(),
});

// GET /api/posts
router.get('/', async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20, status, platform } = req.query;
  const where: any = { userId: req.user!.id };
  if (status) where.status = status;
  if (platform) where.platform = platform;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    }),
    prisma.post.count({ where }),
  ]);

  res.json({
    success: true,
    data: posts,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
  });
});

// POST /api/posts
router.post('/', async (req: AuthRequest, res: Response) => {
  const data = postSchema.parse(req.body);
  const post = await prisma.post.create({
    data: { ...data, userId: req.user!.id, platform: data.platform as any },
  });
  res.status(201).json({ success: true, data: post });
});

// GET /api/posts/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const post = await prisma.post.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });
  if (!post) { res.status(404).json({ success: false, error: 'Post not found' }); return; }
  res.json({ success: true, data: post });
});

// PATCH /api/posts/:id
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const data = postSchema.partial().parse(req.body);
  const post = await prisma.post.updateMany({
    where: { id: req.params.id, userId: req.user!.id },
    data: data as any,
  });
  if (!post.count) { res.status(404).json({ success: false, error: 'Post not found' }); return; }
  res.json({ success: true, message: 'Post updated' });
});

// DELETE /api/posts/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await prisma.post.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
  res.json({ success: true, message: 'Post deleted' });
});

export { router as postsRouter };
