import rateLimit from 'express-rate-limit';
import validator from 'validator';

// Strict rate limit for contact form to prevent spam
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (process.env.NODE_ENV === 'test' || process.argv.some(a => a.includes('test'))) ? 100 : 5, // max 5 submissions per window per IP in production/dev
  message: {
    success: false,
    message: 'Too many contact requests from this connection. Please wait 15 minutes before sending another message.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limit for admin authentication
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // max 10 login attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Honeypot spam defense middleware
export function honeypotCheck(req, res, next) {
  // If the hidden bot field (e.g. 'website_hp') is filled, reject silently or fake success
  if (req.body.website_hp && req.body.website_hp.trim() !== '') {
    console.warn(`[SPAM DETECTED] Honeypot triggered from IP: ${req.ip}`);
    // Return fake success so bots think their submission succeeded without cluttering database or emails
    return res.status(200).json({
      success: true,
      message: 'Your message has been received. Thank you!'
    });
  }
  next();
}

// Basic input sanitization middleware
export function sanitizeInputs(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = validator.escape(req.body[key].trim());
      }
    }
  }
  next();
}

// Global safe error handling middleware (never leaks stack traces or system secrets)
export function errorHandler(err, req, res, next) {
  console.error('[SERVER ERROR]', err.message);
  
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 
    ? 'An unexpected error occurred. Please try again later.' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message
  });
}
