import { Router, Request, Response } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { oauthService } from './oauth.service';
import { AuthRequest } from '../../shared/types';
import { logger } from '../../shared/utils/logger';

const router = Router();

const SUPPORTED_PLATFORMS = ['twitter', 'linkedin', 'instagram', 'tiktok'];

// GET /api/social/accounts
// Get all connected social accounts for the current user
router.get('/accounts', authenticate, async (req: AuthRequest, res: Response) => {
  const accounts = await oauthService.getConnectedAccounts(req.user!.id);
  res.json({ success: true, data: accounts });
});

// GET /api/social/connect/:platform
// Initiate OAuth flow - redirects user to platform auth page
router.get('/connect/:platform', authenticate, async (req: AuthRequest, res: Response) => {
  const { platform } = req.params;

  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    res.status(400).json({ success: false, error: `Platform ${platform} not supported` });
    return;
  }

  try {
    const state = oauthService.generateState(req.user!.id, platform);
    await oauthService.storeState(state, { userId: req.user!.id, platform });
    const authUrl = oauthService.getAuthUrl(platform, req.user!.id);

    // Return URL for frontend to redirect to
    res.json({ success: true, data: { authUrl } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/social/callback/:platform
// OAuth callback - handles code exchange and account connection
router.get('/callback/:platform', async (req: Request, res: Response) => {
  const { platform } = req.params;
  const { code, state, error } = req.query;

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'\;

  if (error) {
    logger.error(`OAuth error for ${platform}: ${error}`);
    res.redirect(`${frontendUrl}/dashboard/settings?tab=integrations&error=${error}`);
    return;
  }

  if (!code || !state) {
    res.redirect(`${frontendUrl}/dashboard/settings?tab=integrations&error=missing_params`);
    return;
  }

  try {
    // Verify state and get userId
    const stateData = await oauthService.verifyState(state as string);
    const { userId } = stateData;

    // Exchange code for tokens
    const tokens = await oauthService.exchangeCode(platform, code as string);

    // Fetch user profile from platform
    const profile = await oauthService.fetchProfile(platform, tokens.accessToken);

    // Save to database
    const account = await oauthService.connectAccount(userId, platform, tokens, profile);

    logger.info(`Successfully connected ${platform} for user ${userId}`);

    // Redirect back to frontend with success
    res.redirect(
      `${frontendUrl}/dashboard/settings?tab=integrations&connected=${platform}&username=${encodeURIComponent(profile.username)}`
    );
  } catch (error: any) {
    logger.error(`OAuth callback failed for ${platform}:`, error.message);
    res.redirect(`${frontendUrl}/dashboard/settings?tab=integrations&error=${encodeURIComponent(error.message)}`);
  }
});

// DELETE /api/social/accounts/:id
// Disconnect a social account
router.delete('/accounts/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { platform } = req.body;
  const result = await oauthService.disconnectAccount(req.user!.id, platform, req.params.id);
  res.json({ success: true, ...result });
});

// POST /api/social/accounts/:id/refresh
// Refresh token for a social account
router.post('/accounts/:id/refresh', authenticate, async (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: 'Token refresh not yet implemented' });
});

export { router as socialRouter };
