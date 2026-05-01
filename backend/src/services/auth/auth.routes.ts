import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authService } from './auth.service';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { authRateLimit } from '../../shared/middleware/rateLimit.middleware';
import { prisma } from '../../shared/config/database';
import { AuthRequest } from '../../shared/types';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100),
  accountType: z.enum(['individual', 'influencer', 'business', 'enterprise']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/register
router.post('/register', authRateLimit, async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please check your email to verify.',
      data: result.user,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, error: error.errors[0]?.message || 'Validation error' });
      return;
    }
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', authRateLimit, async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login({
      ...data,
      device: req.headers['user-agent'],
      ip: req.ip,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Invalid email or password format' });
      return;
    }
    res.status(error.statusCode || 401).json({ success: false, error: error.message || 'Login failed' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
      res.status(401).json({ success: false, error: 'Refresh token required' });
      return;
    }
    const result = await authService.refreshToken(token);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message || 'Token refresh failed' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.slice(7) || '';
    await authService.logout(token);
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Logout failed' });
  }
});

// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', async (req: Request, res: Response) => {
  try {
    const result = await authService.verifyEmail(req.params.token);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', authRateLimit, async (req: Request, res: Response) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const result = await authService.forgotPassword(email);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', authRateLimit, async (req: Request, res: Response) => {
  try {
    const { token, password } = z.object({
      token: z.string(),
      password: z.string().min(8),
    }).parse(req.body);
    const result = await authService.resetPassword(token, password);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        subscription: true,
        socialAccounts: {
          where: { isActive: true },
          select: { id: true, platform: true, username: true, followers: true, isActive: true },
        },
      },
    });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

export { router as authRouter };
