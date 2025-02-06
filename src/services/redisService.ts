import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error('REDIS_URL environment variable is not set');
}

const redis = new Redis(redisUrl);

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export const redisService = {
  async blacklistToken(token: string, expirationTime: number): Promise<void> {
    try {
      await redis.set(`blacklisted_${token}`, '1', 'EX', expirationTime);
    } catch (error) {
      console.error('Redis blacklist error:', error);
      throw error;
    }
  },

  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const result = await redis.get(`blacklisted_${token}`);
      return result !== null;
    } catch (error) {
      console.error('Redis check blacklist error:', error);
      return false;
    }
  }
}; 