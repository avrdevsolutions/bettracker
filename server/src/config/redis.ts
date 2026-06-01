import Redis from 'ioredis';

const redis = new Redis.default(process.env.REDIS_URL ?? 'redis://localhost:6379');
export { redis };