import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import { connectDatabase } from './shared/config/database';
import { connectRedis } from './shared/config/redis';
import { logger } from './shared/utils/logger';
import { globalRateLimit } from './shared/middleware/rateLimit.middleware';
import { errorHandler, notFound } from './shared/middleware/error.middleware';

import { authRouter } from './services/auth/auth.routes';
import { userRouter } from './services/user/user.routes';
import { postsRouter } from './services/scheduling/posts.routes';
import { campaignRouter } from './services/campaign/campaign.routes';
import { analyticsRouter } from './services/analytics/analytics.routes';
import { socialRouter } from './services/social/social.routes';
import { walletRouter } from './services/wallet/wallet.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(globalRateLimit);

app.get('/health', (_, res) => {
  res.json({ success: true, message: 'Yoyzie AI API running', version: '2.0.0', timestamp: new Date().toISOString() });
});

app.use('/api/auth',      authRouter);
app.use('/api/users',     userRouter);
app.use('/api/posts',     postsRouter);
app.use('/api/campaigns', campaignRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/social',    socialRouter);
app.use('/api/wallet',    walletRouter);

app.use(notFound);
app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  await connectRedis();
  app.listen(PORT, () => {
    logger.info(`🚀 Yoyzie AI API running on http://localhost:${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
  });
}

bootstrap().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
