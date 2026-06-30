import { Resend } from 'resend';
import { logger } from '../../shared/utils/logger';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || 'noreply@yoyzie.ai';
const APP_NAME = process.env.APP_NAME || 'Yoyzie AI';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export class EmailService {

  async sendPasswordReset(to: string, name: string, token: string) {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

    try {
      await resend.emails.send({
        from: `${APP_NAME} <${FROM}>`,
        to,
        subject: 'Reset your Yoyzie AI password',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#070A0F;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;padding:0 20px;">

    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#E8C96A;font-size:28px;font-weight:800;margin:0;letter-spacing:-0.5px;">
        Yoyzie AI
      </h1>
      <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:4px 0 0;">
        Kenya's AI Social Media Platform
      </p>
    </div>

    <!-- Card -->
    <div style="background:#0D0D0F;border:1px solid rgba(201,168,76,0.2);border-radius:20px;padding:40px 36px;">
      <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px;">
        Reset your password
      </h2>
      <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;margin:0 0 28px;">
        Hi ${name}, we received a request to reset your Yoyzie AI password.
        Click the button below to choose a new one.
      </p>

      <!-- Button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}"
          style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#E8C96A);
                 color:#0A0A0A;text-decoration:none;font-weight:700;font-size:15px;
                 padding:14px 36px;border-radius:12px;letter-spacing:0.3px;">
          Reset password
        </a>
      </div>

      <p style="color:rgba(255,255,255,0.35);font-size:12px;line-height:1.6;margin:24px 0 0;text-align:center;">
        This link expires in <strong style="color:rgba(255,255,255,0.6);">1 hour</strong>.
        If you didn't request a password reset, ignore this email — your account is safe.
      </p>
    </div>

    <!-- Footer -->
    <p style="color:rgba(255,255,255,0.2);font-size:11px;text-align:center;margin:24px 0 0;line-height:1.6;">
      © ${new Date().getFullYear()} Yoyzie AI · Kenya's #1 AI Social Media Platform<br>
      <a href="${FRONTEND_URL}" style="color:rgba(201,168,76,0.6);text-decoration:none;">yoyzie.ai</a>
    </p>
  </div>
</body>
</html>
        `,
      });
      logger.info(`Password reset email sent to ${to}`);
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
      // Don't throw — email failure shouldn't break the API response
    }
  }

  async sendWelcome(to: string, name: string) {
    try {
      await resend.emails.send({
        from: `${APP_NAME} <${FROM}>`,
        to,
        subject: `Welcome to Yoyzie AI, ${name}! 🎉`,
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#070A0F;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;padding:0 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#E8C96A;font-size:28px;font-weight:800;margin:0;">Yoyzie AI</h1>
      <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:4px 0 0;">Kenya's AI Social Media Platform</p>
    </div>
    <div style="background:#0D0D0F;border:1px solid rgba(201,168,76,0.2);border-radius:20px;padding:40px 36px;">
      <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px;">
        Welcome, ${name}! 🚀
      </h2>
      <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;margin:0 0 24px;">
        You're now part of Kenya's smartest social media community.
        Here's what you can do with Yoyzie AI:
      </p>
      <div style="space-y:12px;">
        ${['✨ Generate AI captions in seconds', '📅 Schedule posts across 23+ platforms', '📊 Track your analytics in real-time', '🇰🇪 Detect trending Kenyan hashtags', '👥 Connect with brands & influencers'].map(item =>
          `<p style="color:rgba(255,255,255,0.7);font-size:14px;margin:10px 0;">${item}</p>`
        ).join('')}
      </div>
      <div style="text-align:center;margin:32px 0 0;">
        <a href="${FRONTEND_URL}/dashboard"
          style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#E8C96A);
                 color:#0A0A0A;text-decoration:none;font-weight:700;font-size:15px;
                 padding:14px 36px;border-radius:12px;">
          Go to my dashboard
        </a>
      </div>
    </div>
    <p style="color:rgba(255,255,255,0.2);font-size:11px;text-align:center;margin:24px 0 0;">
      © ${new Date().getFullYear()} Yoyzie AI · <a href="${FRONTEND_URL}" style="color:rgba(201,168,76,0.6);text-decoration:none;">yoyzie.ai</a>
    </p>
  </div>
</body>
</html>
      `,
      });
      logger.info(`Welcome email sent to ${to}`);
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
    }
  }

  async sendEmailVerification(to: string, name: string, token: string) {
    const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
    try {
      await resend.emails.send({
        from: `${APP_NAME} <${FROM}>`,
        to,
        subject: 'Verify your Yoyzie AI email address',
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#070A0F;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;padding:0 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#E8C96A;font-size:28px;font-weight:800;margin:0;">Yoyzie AI</h1>
    </div>
    <div style="background:#0D0D0F;border:1px solid rgba(201,168,76,0.2);border-radius:20px;padding:40px 36px;">
      <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px;">Verify your email</h2>
      <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;margin:0 0 28px;">
        Hi ${name}, click the button below to verify your email address and activate your account.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${verifyUrl}"
          style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#E8C96A);
                 color:#0A0A0A;text-decoration:none;font-weight:700;font-size:15px;
                 padding:14px 36px;border-radius:12px;">
          Verify email address
        </a>
      </div>
      <p style="color:rgba(255,255,255,0.35);font-size:12px;text-align:center;margin:24px 0 0;">
        Link expires in 24 hours.
      </p>
    </div>
  </div>
</body>
</html>
      `,
      });
    } catch (error) {
      logger.error('Failed to send verification email:', error);
    }
  }
}

export const emailService = new EmailService();
