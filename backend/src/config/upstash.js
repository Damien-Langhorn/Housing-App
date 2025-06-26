
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import dotenv from 'dotenv';

dotenv.config();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(50, '1m') // 50 requests per minute
});

export default ratelimit;
// This code sets up a rate limiting middleware using Upstash's Redis and RateLimit.
// It allows 10 requests per minute per IP address. If the limit is exceeded, it responds with a 429 status code and an error message.