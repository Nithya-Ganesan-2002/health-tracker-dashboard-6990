'use strict';
const { validationResult } = require('express-validator');
const userService = require('../services/user');
const { signToken } = require('../services/token');

class AuthController {
  // PUBLIC_INTERFACE
  async register(req, res, next) {
    /** Registers a new user and returns JWT and profile. */
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = await userService.createUser(req.body);
      const token = signToken({ id: user.id, email: user.email });
      return res.status(201).json({ token, user });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async login(req, res, next) {
    /** Authenticates a user by email/password and returns JWT and profile. */
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = await userService.authenticate(req.body.email, req.body.password);
      const token = signToken({ id: user.id, email: user.email });
      return res.status(200).json({ token, user });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async me(req, res, next) {
    /** Returns current authenticated user's profile. */
    try {
      const user = userService.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async updateProfile(req, res, next) {
    /** Updates the authenticated user's profile. */
    try {
      const updated = userService.updateUser(req.user.id, req.body || {});
      return res.status(200).json(updated);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();
