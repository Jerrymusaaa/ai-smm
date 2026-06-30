import { Router, Request, Response } from 'express';
import { z } from 'zod';
import passport from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import { authService } from './auth.service';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { authRateLimit } from '../../shared/middleware/rateLimit.middleware';
import { prisma } from '../../shared/config/database';
import { AuthRequest } from '../../shared/types';
import jwt from 'jsonwebtoken';
import { logger } from '../../shared/utils/logger';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL:  `${process.env.API_URL || 'http://localhost:5000'}/api/auth/google/callback`,
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('No email from Google'));

      let user = await prisma.user.findUnique({ where: { email } });
      let isNewUser = false;

      if (!user) {
        isNewUser = true;
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName || email.split('@')[0],
            avatar: profile.photos?.[0]?.value,
            emailVerified: true,
            emailVerifiedAt: new Date(),
            accountType: 'INDIVIDUAL',
            onboardingDone: false,
            subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
            aiMemory: { create: {} },
          },
        });
        logger.info(`New user created via Google OAuth: ${email}`);
      } else {
        if (!user.avatar && profile.photos?.[0]?.value) {
          await prisma.user.update({
            where: { id: user.id },
            data: { avatar: profile.photos[0].value, lastLoginAt: new Date() },
          });
        }
      }

      return done(null, { ...user, isNewUser });
    } catch (error) {
      return done(error as Error);
    }
  }
));

router.use(passport.initialize());

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=google_failed` }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      if (!user) {
        res.redirect(`${FRONTEND_URL}/login?error=no_user`);
        return;
      }

      const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
      );

      await prisma.session.create({
        data: {
          userId: user.id,
          token: accessToken,
          refreshToken,
          device: req.headers['user-agent'] || 'Google OAuth',
          ipAddress: req.ip,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      const userData = encodeURIComponent(JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        accountType: user.accountType,
        emailVerified: user.emailVerified,
        plan: subscription?.plan || 'FREE',
        onboardingDone: user.onboardingDone,
      }));

      // New users go to account-type selection. Existing users go straight to dashboard.
      const needsOnboarding = user.isNewUser || !user.onboardingDone;
      const destination = needsOnboarding ? 'choose-account-type' : 'dashboard';

      res.redirect(
        `${FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${userData}&next=${destination}`
      );
    } catch (error) {
      logger.error('Google OAuth callback error:', error);
      res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

router.post('/register', authRateLimit, async (req: Request, res: Response) => {
  try {
    const data = z.object({
      email: z.string().email('Invalid email'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      name: z.string().min(1, 'Name is required').max(100),
      accountType: z.enum(['individual', 'influencer', 'business', 'enterprise']).optional(),
    }).parse(req.body);

    const result = await authService.register(data);
    res.status(201).json({
      success: true,
      message: 'Account created! Check your email to verify your account.',
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

router.post('/login', authRateLimit, async (req: Request, res: Response) => {
  try {
    const data = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
    const result = await authService.login({ ...data, device: req.headers['user-agent'], ip: req.ip });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Invalid email or password format' });
      return;
    }
    res.status(error.statusCode || 401).json({ success: false, error: error.message || 'Login failed' });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) { res.status(401).json({ success: false, error: 'Refresh token required' }); return; }
    const result = await authService.refreshToken(token);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message || 'Token refresh failed' });
  }
});

router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.slice(7) || '';
    await authService.logout(token);
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Logout failed' });
  }
});

router.get('/verify-email/:token', async (req: Request, res: Response) => {
  try {
    const result = await authService.verifyEmail(req.params.token);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/forgot-password', authRateLimit, async (req: Request, res: Response) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const result = await authService.forgotPassword(email);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/reset-password', authRateLimit, async (req: Request, res: Response) => {
  try {
    const { token, password } = z.object({ token: z.string(), password: z.string().min(8) }).parse(req.body);
    const result = await authService.resetPassword(token, password);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/auth/complete-onboarding — set account type after Google signup
router.post('/complete-onboarding', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { accountType, businessName, niche } = z.object({
      accountType: z.enum(['individual', 'influencer', 'business', 'enterprise']),
      businessName: z.string().optional(),
      niche: z.string().optional(),
    }).parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        accountType: accountType.toUpperCase() as any,
        company: businessName,
        onboardingDone: true,
      },
      select: {
        id: true, email: true, name: true, avatar: true,
        accountType: true, company: true, onboardingDone: true,
        emailVerified: true,
      },
    });

    // If influencer, create their InfluencerProfile
    if (accountType === 'influencer') {
      await prisma.influencerProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          niches: niche ? [niche] : [],
          commissionRate: 25,
        },
      });
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, error: error.errors[0]?.message });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to complete onboarding' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        subscription: true,
        influencerProfile: true,
        socialAccounts: { where: { isActive: true }, select: { id: true, platform: true, username: true, followers: true } },
      },
    });
    if (!user) { res.status(404).json({ success: false, error: 'User not found' }); return; }
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

export { router as authRouter };
