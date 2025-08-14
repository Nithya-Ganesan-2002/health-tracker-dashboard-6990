'use strict';
const { verifyToken } = require('../services/token');

// PUBLIC_INTERFACE
function requireAuth(req, res, next) {
  /** Express middleware to enforce JWT authentication.
   * Expects Authorization: Bearer <token>
   * Attaches decoded user to req.user
   */
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = {
  requireAuth,
};
