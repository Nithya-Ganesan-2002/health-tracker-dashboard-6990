'use strict';
const jwt = require('jsonwebtoken');
const { getConfig } = require('../config');

// PUBLIC_INTERFACE
function signToken(payload) {
  /** Signs a JWT with configured secret and expiration.
   * payload: object to encode
   * returns: string token
   */
  const cfg = getConfig();
  return jwt.sign(payload, cfg.jwtSecret, { expiresIn: cfg.tokenExpiresIn });
}

// PUBLIC_INTERFACE
function verifyToken(token) {
  /** Verifies a JWT and returns the decoded payload
   * token: string Bearer token (without prefix)
   * throws on invalid token
   */
  const cfg = getConfig();
  return jwt.verify(token, cfg.jwtSecret);
}

module.exports = {
  signToken,
  verifyToken,
};
