// =============================================================================
// server.js – Express entry point for CoC War Planner Proxy (BFF)
// =============================================================================
// REQUIREMENT: Proxy server – Node.js + Express.js
// This server acts as a Backend-for-Frontend (BFF):
//   1. Fetches war data from Supercell API (Bearer token auth)
//   2. Fetches battlelogs for each enemy player
//   3. Parses armyShareCode → structured army compositions
//   4. Trims raw API data → clean, minimal DTO for React frontend
// =============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { errorHandler, notFoundHandler } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// CORS – allow requests from the React frontend
// ---------------------------------------------------------------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
}));

// ---------------------------------------------------------------------------
// JSON body parsing (for future POST endpoints if needed)
// ---------------------------------------------------------------------------
app.use(express.json());

// ---------------------------------------------------------------------------
// Request logging (simple dev logger)
// ---------------------------------------------------------------------------
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ---------------------------------------------------------------------------
// Health check endpoint
// ---------------------------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ---------------------------------------------------------------------------
// API routes (rate-limited)
// ---------------------------------------------------------------------------
app.use('/api', apiRoutes);

// ---------------------------------------------------------------------------
// 404 + global error handler
// ---------------------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🏰 CoC War Planner Proxy running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   War endpoint: http://localhost:${PORT}/api/war/:clanTag`);
  console.log(`   CORS origin:  ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);

  if (!process.env.COC_API_KEY || process.env.COC_API_KEY === 'your_api_key_here') {
    console.warn('⚠️  WARNING: COC_API_KEY is not set! Copy .env.example → .env and add your key.\n');
  }
});
