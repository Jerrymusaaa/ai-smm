import { createClient } from 'redis';
import { logger } from '../utils/logger';

export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    // Bound reconnection attempts so a missing/unreachable Redis can never
    // hang the boot sequence (default behavior retries forever).
    reconnectStrategy: (retries) => {
      if (retries >= 3) {
        return new Error('Redis reconnect limit reached — continuing without Redis');
      }
      return 1000;
    },
  },
});

redis.on('error', (err) => logger.error('Redis error:', err));
redis.on('connect', () => logger.info('✅ Redis connected'));
redis.on('disconnect', () => logger.warn('Redis disconnected'));

export async function connectRedis() {
  try {
    await redis.connect();
  } catch (error) {
    logger.error('❌ Redis connection failed — app continuing without Redis:', error);
  }
}

// All helpers fail safe: when Redis is unavailable (not connected or mid-
// disconnect) they log and no-op instead of throwing, so features that use
// Redis for caching/OAuth state degrade gracefully rather than failing
// requests (e.g. user registration used to 500 with "The client is closed").
export const redisHelpers = {
  async set(key: string, value: any, ttlSeconds?: number) {
    if (!redis.isReady) {
      logger.warn(`Redis unavailable — skipped set for "${key}"`);
      return;
    }
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.setEx(key, ttlSeconds, serialized);
      } else {
        await redis.set(key, serialized);
      }
    } catch (error) {
      logger.error(`Redis set failed for "${key}":`, error);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    if (!redis.isReady) return null;
    try {
      const value = await redis.get(key);
      if (!value) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      logger.error(`Redis get failed for "${key}":`, error);
      return null;
    }
  },

  async del(key: string) {
    if (!redis.isReady) return;
    try {
      await redis.del(key);
    } catch (error) {
      logger.error(`Redis del failed for "${key}":`, error);
    }
  },

  async exists(key: string): Promise<boolean> {
    if (!redis.isReady) return false;
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis exists failed for "${key}":`, error);
      return false;
    }
  },

  async setWithExpiry(key: string, value: any, ttlSeconds: number) {
    await this.set(key, value, ttlSeconds);
  },
};
