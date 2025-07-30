import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
};

const redisClient = new Redis(redisConfig);

// Handle connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err: Error) => {
  console.error('Redis error:', err);
});

export default redisClient;