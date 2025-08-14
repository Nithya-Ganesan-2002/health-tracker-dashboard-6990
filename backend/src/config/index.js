'use strict';
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env if present
dotenv.config();

const defaultDataDir = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(defaultDataDir)) {
  fs.mkdirSync(defaultDataDir, { recursive: true });
}

// PUBLIC_INTERFACE
function getConfig() {
  /** Provides application configuration from environment variables with safe fallbacks for local development.
   * Env vars (to be managed via .env):
   * - PORT: Server port
   * - HOST: Server host
   * - JWT_SECRET: Secret key for signing JWTs (REQUIRED for production)
   * - TOKEN_EXPIRES_IN: JWT expiration (e.g., '1h', '7d')
   * - DATA_DIR: Directory for JSON storage (default: ./data)
   * - NODE_ENV: Node environment
   */
  const cfg = {
    env: process.env.NODE_ENV || 'development',
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT || '3000', 10),
    jwtSecret: process.env.JWT_SECRET || null,
    tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || '7d',
    dataDir: process.env.DATA_DIR || defaultDataDir,
  };

  if (!cfg.jwtSecret && cfg.env !== 'production') {
    // For development, generate an ephemeral secret if not provided
    cfg.jwtSecret = require('crypto').randomBytes(32).toString('hex');
    // eslint-disable-next-line no-console
    console.warn('[config] JWT_SECRET not set. Using ephemeral secret for development only.');
  }

  if (!cfg.jwtSecret && cfg.env === 'production') {
    throw new Error('Missing JWT_SECRET in environment for production.');
  }

  return cfg;
}

module.exports = {
  getConfig,
};
