import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { prisma } from '../../shared/config/database';
import { AuthRequest } from '../../shared/types';

const router = Router();

// All routes require auth
router.use(authenticate);

// GET /api/users/profile
router.get('/profile', async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      subscription: true,
      socialAccounts: { select: { id: true, platform: true, username: true, followers: true, isActive: true } },
      _count: { select: { posts: true, campaigns: true } },
    },
  });
  res.json({ success: true, data: user });
});

// PATCH /api/users/profile
router.patch('/profile', async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    name: z.string().min(1).max(100).optional(),
    company: z.string().optional(),
    role: z.string().optional(),
    bio: z.string().max(500).optional(),
    website: z.string().url().optional().or(z.literal('')),
    twitterHandle: z.string().optional(),
    linkedinUrl: z.string().optional(),
    timezone: z.string().optional(),
    language: z.string().optional(),
    phone: z.string().optional(),
  });

  const data = schema.parse(req.body);
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data,
    select: { id: true, email: true, name: true, company: true, role: true, bio: true, website: true, timezone: true, language: true },
  });
  res.json({ success: true, data: user });
});

// GET /api/users/notifications
router.get('/notifications', async (req: AuthRequest, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json({ success: true, data: notifications });
});

// PATCH /api/users/notifications/:id/read
router.patch('/notifications/:id/read', async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.user!.id },
    data: { read: true },
  });
  res.json({ success: true, message: 'Notification marked as read' });
});

// PATCH /api/users/notifications/read-all
router.patch('/notifications/read-all', async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.id, read: false },
    data: { read: true },
  });
  res.json({ success: true, message: 'All notifications marked as read' });
});

// GET /api/users/sessions
router.get('/sessions', async (req: AuthRequest, res: Response) => {
  const sessions = await prisma.session.findMany({
    where: { userId: req.user!.id },
    select: { id: true, device: true, ipAddress: true, createdAt: true, expiresAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: sessions });
});

// DELETE /api/users/sessions/:id
router.delete('/sessions/:id', async (req: AuthRequest, res: Response) => {
  await prisma.session.deleteMany({
    where: { id: req.params.id, userId: req.user!.id },
  });
  res.json({ success: true, message: 'Session terminated' });
});

// GET /api/users/api-keys
router.get('/api-keys', async (req: AuthRequest, res: Response) => {
  const keys = await prisma.apiKey.findMany({
    where: { userId: req.user!.id },
    select: { id: true, name: true, key: true, permissions: true, lastUsedAt: true, createdAt: true },
  });
  res.json({ success: true, data: keys });
});

// POST /api/users/api-keys
router.post('/api-keys', async (req: AuthRequest, res: Response) => {
  const { name, permissions } = z.object({
    name: z.string().min(1),
    permissions: z.array(z.enum(['read', 'write', 'delete'])),
  }).parse(req.body);

  const key = `sai_${Buffer.from(Math.random().toString()).toString('base64').slice(0, 32)}`;
  const apiKey = await prisma.apiKey.create({
    data: { userId: req.user!.id, name, key, permissions },
  });

  res.status(201).json({ success: true, data: apiKey });
});

// DELETE /api/users/api-keys/:id
router.delete('/api-keys/:id', async (req: AuthRequest, res: Response) => {
  await prisma.apiKey.deleteMany({
    where: { id: req.params.id, userId: req.user!.id },
  });
  res.json({ success: true, message: 'API key deleted' });
});

export { router as userRouter };
