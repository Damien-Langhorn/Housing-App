import rateLimit from 'express-rate-limit';
import ratelimit from "../config/upstash.js";

// ✅ Enhanced rate limiter with Redis store support
const createRateLimiter = (options) => {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    // ✅ Production-ready message
    message: {
      success: false,
      message: options.message || 'Too many requests, please try again later.',
    },
    ...options,
  });
};

// ✅ Global rate limiter (more restrictive for production)
export const globalRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 200,
  message: 'Too many requests from this IP, please try again in 15 minutes.',
});

// ✅ Strict rate limiter for auth endpoints
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many authentication attempts, please try again in 15 minutes.',
});

// ✅ API rate limiter
export const apiRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 50 : 100,
  message: 'Too many API requests, please try again in 15 minutes.',
});

// ✅ Upload rate limiter (very restrictive)
export const uploadRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Upload limit reached, please try again in 1 hour.',
});

// ✅ Enhanced Upstash rate limiter with better error handling
const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit(req.ip);
        if (!success) {
            return res.status(429).json({ 
                success: false,
                message: "Too many requests, please try again later." 
            });
        }
        next();
    } catch (error) {
        console.error("Rate limiter error:", error);
        // ✅ Fail open - don't block requests if rate limiter fails
        next();
    }
};

export default rateLimiter;