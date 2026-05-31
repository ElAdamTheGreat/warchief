// =============================================================================
// middleware/rateLimiter.js – Rate limiting & error handling middleware
// =============================================================================
// REQUIREMENT: middleware/rateLimiter.js – basic rate limiting, error handling for 429s
//
// Uses express-rate-limit for API endpoint protection.
// Also exports global error handler and 404 handler.
// =============================================================================

const rateLimit = require('express-rate-limit');

// ---------------------------------------------------------------------------
// API rate limiter
// Supercell API has its own limits; this protects our proxy from abuse.
// ---------------------------------------------------------------------------
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30,             // max 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'rateLimited',
    message: 'Too many requests. Please wait a moment and try again.',
  },
  handler: (_req, res, _next, options) => {
    res.status(429).json(options.message);
  },
});

// ---------------------------------------------------------------------------
// 404 handler – unknown routes
// ---------------------------------------------------------------------------
function notFoundHandler(req, res, _next) {
  res.status(404).json({
    error: 'notFound',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  console.error(`\n❌ Error: ${err.message}`);

  // Supercell API errors (forwarded status codes)
  if (err.status) {
    return res.status(err.status).json({
      error: err.reason || 'apiError',
      message: err.message,
    });
  }

  // Network errors (fetch failures)
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(502).json({
      error: 'upstreamError',
      message: 'Could not connect to the Supercell API. Check your network connection.',
    });
  }

  // JSON parse errors
  if (err instanceof SyntaxError) {
    return res.status(502).json({
      error: 'parseError',
      message: 'Received invalid response from Supercell API.',
    });
  }

  // Generic server error
  res.status(500).json({
    error: 'serverError',
    message: 'Internal server error. Check server logs for details.',
  });
}

module.exports = {
  apiLimiter,
  notFoundHandler,
  errorHandler,
};
