import crypto from 'crypto';
import axios from 'axios';
import { prisma } from '../../shared/config/database';
import { redisHelpers } from '../../shared/config/redis';
import { AppError } from '../../shared/middleware/error.middleware';
import { logger } from '../../shared/utils/logger';

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  callbackUrl: string;
}

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

interface PlatformProfile {
  platformUserId: string;
  username: string;
  displayName?: string;
  avatar?: string;
  followers?: number;
}

export class OAuthService {
  private configs: Record<string, OAuthConfig> = {
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      authUrl: 'https://twitter.com/i/oauth2/authorize',
      tokenUrl: 'https://api.twitter.com/2/oauth2/token',
      scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
      callbackUrl: `${process.env.OAUTH_CALLBACK_URL}/twitter`,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
      scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
      callbackUrl: `${process.env.OAUTH_CALLBACK_URL}/linkedin`,
    },
    instagram: {
      clientId: process.env.INSTAGRAM_APP_ID!,
      clientSecret: process.env.INSTAGRAM_APP_SECRET!,
      authUrl: 'https://api.instagram.com/oauth/authorize',
      tokenUrl: 'https://api.instagram.com/oauth/access_token',
      scopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
      callbackUrl: `${process.env.OAUTH_CALLBACK_URL}/instagram`,
    },
    tiktok: {
      clientId: process.env.TIKTOK_CLIENT_KEY!,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
      authUrl: 'https://www.tiktok.com/v2/auth/authorize',
      tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
      scopes: ['user.info.basic', 'video.list', 'video.publish'],
      callbackUrl: `${process.env.OAUTH_CALLBACK_URL}/tiktok`,
    },
  };

  generateState(userId: string, platform: string): string {
    const state = crypto.randomBytes(16).toString('hex');
    return `${state}:${userId}:${platform}`;
  }

  async storeState(state: string, data: object): Promise<void> {
    await redisHelpers.set(`oauth:state:${state}`, data, 600); // 10 min expiry
  }

  async verifyState(state: string): Promise<any> {
    const data = await redisHelpers.get(`oauth:state:${state}`);
    if (!data) throw new AppError(400, 'Invalid or expired OAuth state');
    await redisHelpers.del(`oauth:state:${state}`);
    return data;
  }

  getAuthUrl(platform: string, userId: string): string {
    const config = this.configs[platform];
    if (!config) throw new AppError(400, `Unsupported platform: ${platform}`);

    const state = this.generateState(userId, platform);
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.callbackUrl,
      scope: config.scopes.join(' '),
      response_type: 'code',
      state,
    });

    // Twitter needs PKCE
    if (platform === 'twitter') {
      params.set('code_challenge', 'challenge');
      params.set('code_challenge_method', 'plain');
    }

    // TikTok uses slightly different params
    if (platform === 'tiktok') {
      params.set('client_key', config.clientId);
    }

    return `${config.authUrl}?${params.toString()}`;
  }

  async exchangeCode(platform: string, code: string): Promise<TokenData> {
    const config = this.configs[platform];

    const params: Record<string, string> = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.callbackUrl,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    };

    if (platform === 'twitter') {
      params.code_verifier = 'challenge';
    }

    try {
      const response = await axios.post(
        config.tokenUrl,
        new URLSearchParams(params).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...(platform === 'twitter' ? {
              Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
            } : {}),
          },
        }
      );

      const data = response.data;
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_in
          ? new Date(Date.now() + data.expires_in * 1000)
          : undefined,
      };
    } catch (error: any) {
      logger.error(`OAuth token exchange failed for ${platform}:`, error.response?.data || error.message);
      throw new AppError(400, `Failed to exchange OAuth code for ${platform}`);
    }
  }

  async fetchProfile(platform: string, accessToken: string): Promise<PlatformProfile> {
    try {
      switch (platform) {
        case 'twitter': {
          const res = await axios.get('https://api.twitter.com/2/users/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { 'user.fields': 'profile_image_url,public_metrics,username' },
          });
          const u = res.data.data;
          return {
            platformUserId: u.id,
            username: `@${u.username}`,
            displayName: u.name,
            avatar: u.profile_image_url,
            followers: u.public_metrics?.followers_count || 0,
          };
        }

        case 'linkedin': {
          const [profileRes, followersRes] = await Promise.all([
            axios.get('https://api.linkedin.com/v2/me', {
              headers: { Authorization: `Bearer ${accessToken}` },
              params: { projection: '(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))' },
            }),
            axios.get('https://api.linkedin.com/v2/networkSizes/urn:li:person:', {
              headers: { Authorization: `Bearer ${accessToken}` },
            }).catch(() => ({ data: { firstDegreeSize: 0 } })),
          ]);

          const p = profileRes.data;
          return {
            platformUserId: p.id,
            username: `${p.localizedFirstName} ${p.localizedLastName}`,
            displayName: `${p.localizedFirstName} ${p.localizedLastName}`,
            followers: followersRes.data.firstDegreeSize || 0,
          };
        }

        case 'instagram': {
          const res = await axios.get('https://graph.instagram.com/me', {
            params: {
              fields: 'id,username,account_type,media_count,followers_count,profile_picture_url',
              access_token: accessToken,
            },
          });
          const u = res.data;
          return {
            platformUserId: u.id,
            username: `@${u.username}`,
            displayName: u.username,
            avatar: u.profile_picture_url,
            followers: u.followers_count || 0,
          };
        }

        case 'tiktok': {
          const res = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { fields: 'open_id,display_name,avatar_url,follower_count,username' },
          });
          const u = res.data.data.user;
          return {
            platformUserId: u.open_id,
            username: `@${u.username || u.display_name}`,
            displayName: u.display_name,
            avatar: u.avatar_url,
            followers: u.follower_count || 0,
          };
        }

        default:
          throw new AppError(400, `Profile fetch not implemented for ${platform}`);
      }
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error(`Profile fetch failed for ${platform}:`, error.message);
      throw new AppError(400, `Failed to fetch ${platform} profile`);
    }
  }

  async connectAccount(
    userId: string,
    platform: string,
    tokens: TokenData,
    profile: PlatformProfile
  ) {
    const platformEnum = platform.toUpperCase() as any;

    const account = await prisma.socialAccount.upsert({
      where: {
        userId_platform_platformUserId: {
          userId,
          platform: platformEnum,
          platformUserId: profile.platformUserId,
        },
      },
      update: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: tokens.expiresAt,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.avatar,
        followers: profile.followers || 0,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        userId,
        platform: platformEnum,
        platformUserId: profile.platformUserId,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.avatar,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: tokens.expiresAt,
        followers: profile.followers || 0,
        isActive: true,
      },
    });

    logger.info(`Connected ${platform} account for user ${userId}: ${profile.username}`);
    return account;
  }

  async disconnectAccount(userId: string, platform: string, accountId: string) {
    await prisma.socialAccount.updateMany({
      where: { id: accountId, userId, platform: platform.toUpperCase() as any },
      data: { isActive: false },
    });
    return { message: `${platform} account disconnected` };
  }

  async getConnectedAccounts(userId: string) {
    return prisma.socialAccount.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        platform: true,
        username: true,
        displayName: true,
        avatar: true,
        followers: true,
        connectedAt: true,
        isActive: true,
      },
      orderBy: { connectedAt: 'desc' },
    });
  }
}

export const oauthService = new OAuthService();
