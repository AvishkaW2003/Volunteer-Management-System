import rateLimit from "express-rate-limit";

// Rate limiter for general authentication endpoints (register, login)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many attempts from this IP, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for password reset actions
export const resetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: "Too many password reset attempts from this IP, please try again after an hour"
  },
  standardHeaders: true,
  legacyHeaders: false,
});
