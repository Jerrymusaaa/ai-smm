import { Router, Request, Response } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { oauthService } from './oauth.service';
import { AuthRequest } from '../../shared/types';
import { logger } from '../../shared/utils/logger';

const router = Router();

const SUPPORTED_PLATFORMS = ['twitter', 'linkedin', 'instagram', 'tiktok'];

router.get('/accounts', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const accounts = await oauthService.getConnectedAccounts(req.user!.id);
    res.json({ success: true, data: accounts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/connect/:platform', authenticate, async (req: AuthRequest, res: Response) => {
  const { platform } = req.params;
  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    res.status(400).json({ success: false, error: 'Platform not supported' });
    return;
  }
  try {
    const state = oauthService.generateState(req.user!.id, platform);
    await oauthService.storeState(state, { userId: req.user!.id, platform });
    const authUrl = oauthService.getAuthUrl(platform, req.user!.id);
    res.json({ success: true, data: { authUrl } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/callback/:platform', async (req: Request, res: Response) => {
  const { platform } = req.params;
  const { code, state, error } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  if (error) {
    res.redirect(frontendUrl + '/dashboard/settings?error=' + error);
    return;
  }
  if (!code || !state) {
    res.redirect(frontendUrl + '/dashboard/settings?error=missing_params');
    return;
  }
  try {
    const stateData = await oauthService.verifyState(state as string);
    const tokens = await oauthService.exchangeCode(platform, code as string);
    const profile = await oauthService.fetchProfile(platform, tokens.accessToken);
    await oauthService.connectAccount(stateData.userId, platform, tokens, profile);
    res.redirect(frontendUrl + '/dashboard/settings?connected=' + platform);
  } catch (err: any) {
    logger.error('OAuth callback failed:', err.message);
    res.redirect(frontendUrl + '/dashboard/settings?error=' + encodeURIComponent(err.message));
  }
});

router.delete('/accounts/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { platform } = req.body;
    const result = await oauthService.disconnectAccount(req.user!.id, platform, req.params.id);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as socialRouter };
