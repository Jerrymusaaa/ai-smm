import { createClient } from 'redis';
import { logger } from '../utils/logger';

export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => logger.error('Redis error:', err));
redis.on('connect', () => logger.info('✅ Redis connected'));
redis.on('disconnect', () => logger.warn('Redis disconnected'));

export async function connectRedis() {
  try {
    await redis.connect();
  } catch (error) {
    logger.error('❌ Redis connection failed:', error);
  }
}

export const redisHelpers = {
  async set(key: string, value: any, ttlSeconds?: number) {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.setEx(key, ttlSeconds, serialized);
    } else {
      await redis.set(key, serialized);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  },

  async del(key: string) {
    await redis.del(key);
  },

  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  },

  async setWithExpiry(key: string, value: any, ttlSeconds: number) {
    await redis.setEx(key, ttlSeconds, JSON.stringify(value));
  },
};
