import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../shared/config/database';
import { redisHelpers } from '../../shared/config/redis';
import { AppError } from '../../shared/middleware/error.middleware';
import { JwtPayload } from '../../shared/types';

export class AuthService {
  private generateTokens(userId: string, email: string) {
    const accessToken = jwt.sign(
      { userId, email } as JwtPayload,
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { userId, email } as JwtPayload,
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    accountType?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError(409, 'Email already in use');

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const verificationToken = uuidv4();

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        accountType: (data.accountType?.toUpperCase() as any) || 'INDIVIDUAL',
        subscription: {
          create: { plan: 'FREE', status: 'ACTIVE' },
        },
        aiMemory: {
          create: {},
        },
      },
      select: { id: true, email: true, name: true, accountType: true, createdAt: true },
    });

    // Store verification token in Redis (24hr expiry)
    await redisHelpers.set(
      `verify:${verificationToken}`,
      { userId: user.id, email: user.email },
      86400
    );

    return { user, verificationToken };
  }

  async login(data: { email: string; password: string; device?: string; ip?: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { subscription: true },
    });

    if (!user || !user.password) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid email or password');
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id, user.email);

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        device: data.device || 'Unknown',
        ipAddress: data.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accountType: user.accountType,
        emailVerified: user.emailVerified,
        plan: user.subscription?.plan || 'FREE',
      },
      accessToken,
      refreshToken,
    };
  }

  async verifyEmail(token: string) {
    const data = await redisHelpers.get<{ userId: string; email: string }>(`verify:${token}`);
    if (!data) throw new AppError(400, 'Invalid or expired verification token');

    await prisma.user.update({
      where: { id: data.userId },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    });

    await redisHelpers.del(`verify:${token}`);
    return { message: 'Email verified successfully' };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;

      const session = await prisma.session.findUnique({ where: { refreshToken: token } });
      if (!session) throw new AppError(401, 'Invalid refresh token');

      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(
        decoded.userId,
        decoded.email
      );

      // Update session
      await prisma.session.update({
        where: { id: session.id },
        data: {
          token: accessToken,
          refreshToken: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new AppError(401, 'Invalid or expired refresh token');
    }
  }

  async logout(token: string) {
    await prisma.session.deleteMany({ where: { token } });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'If this email exists, a reset link has been sent' };

    const resetToken = uuidv4();
    await redisHelpers.set(`reset:${resetToken}`, { userId: user.id }, 3600);

    return { message: 'Password reset link sent', resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const data = await redisHelpers.get<{ userId: string }>(`reset:${token}`);
    if (!data) throw new AppError(400, 'Invalid or expired reset token');

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: data.userId },
      data: { password: hashedPassword },
    });

    await redisHelpers.del(`reset:${token}`);
    await prisma.session.deleteMany({ where: { userId: data.userId } });

    return { message: 'Password reset successfully' };
  }
}

export const authService = new AuthService();
