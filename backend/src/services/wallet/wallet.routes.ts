import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { prisma } from '../../shared/config/database';
import { AuthRequest } from '../../shared/types';
import { AppError } from '../../shared/middleware/error.middleware';

const router = Router();
router.use(authenticate);

// GET /api/wallet/balance
router.get('/balance', async (req: AuthRequest, res: Response) => {
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: req.user!.id },
    select: { walletBalance: true, pendingBalance: true, totalEarnings: true, commissionRate: true },
  });
  if (!profile) {
    res.status(404).json({ success: false, error: 'Influencer profile not found' });
    return;
  }
  res.json({ success: true, data: profile });
});

// GET /api/wallet/transactions
router.get('/transactions', async (req: AuthRequest, res: Response) => {
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: req.user!.id },
  });
  if (!profile) {
    res.status(404).json({ success: false, error: 'Influencer profile not found' });
    return;
  }
  const transactions = await prisma.walletTransaction.findMany({
    where: { influencerId: profile.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json({ success: true, data: transactions });
});

// POST /api/wallet/withdraw
router.post('/withdraw', async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    amount: z.number().min(500, 'Minimum withdrawal is KES 500'),
    method: z.enum(['mpesa', 'paypal', 'bank']),
    destination: z.string().min(1, 'Withdrawal destination is required'),
  });

  const { amount, method, destination } = schema.parse(req.body);

  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: req.user!.id },
  });

  if (!profile) throw new AppError(404, 'Influencer profile not found');
  if (profile.walletBalance < amount) throw new AppError(400, 'Insufficient wallet balance');

  // Minimum checks per method
  if (method === 'paypal' && amount < 2000) throw new AppError(400, 'Minimum PayPal withdrawal is KES 2,000');
  if (method === 'bank' && amount < 5000) throw new AppError(400, 'Minimum bank transfer is KES 5,000');

  // Deduct from wallet and create transaction record
  await prisma.$transaction([
    prisma.influencerProfile.update({
      where: { id: profile.id },
      data: { walletBalance: { decrement: amount } },
    }),
    prisma.walletTransaction.create({
      data: {
        influencerId: profile.id,
        type: 'WITHDRAWAL',
        amount: -amount,
        currency: 'KES',
        status: 'processing',
        description: `${method.toUpperCase()} withdrawal`,
        withdrawalMethod: method,
        ...(method === 'mpesa' ? { mpesaNumber: destination } : {}),
        ...(method === 'paypal' ? { paypalEmail: destination } : {}),
        reference: `WD-${Date.now()}`,
      },
    }),
  ]);

  res.json({
    success: true,
    message: `Withdrawal of KES ${amount.toLocaleString()} initiated via ${method.toUpperCase()}. Processing time: ${
      method === 'mpesa' ? 'instant' : method === 'paypal' ? '1-2 business days' : '2-3 business days'
    }.`,
  });
});

// GET /api/wallet/earnings-statement
router.get('/earnings-statement', async (req: AuthRequest, res: Response) => {
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: req.user!.id },
  });
  if (!profile) throw new AppError(404, 'Influencer profile not found');

  const transactions = await prisma.walletTransaction.findMany({
    where: { influencerId: profile.id, type: 'CREDIT' },
    orderBy: { createdAt: 'desc' },
  });

  const totalEarned = transactions.reduce((sum, t) => sum + t.amount, 0);

  res.json({
    success: true,
    data: {
      totalEarned,
      transactions,
      generatedAt: new Date().toISOString(),
    },
  });
});

export { router as walletRouter };
