'use strict';
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../data/db');

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// PUBLIC_INTERFACE
function findByEmail(email) {
  /** Returns user by email or undefined */
  return db.getUsers().find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

// PUBLIC_INTERFACE
function findById(id) {
  /** Returns user by id or undefined */
  return db.getUsers().find((u) => u.id === id);
}

// PUBLIC_INTERFACE
async function createUser(payload) {
  /** Creates a new user with hashed password.
   * payload: { email, password, name?, age?, gender?, heightCm?, weightKg?, activityLevel? }
   * returns: sanitized user
   */
  const { email, password } = payload;
  const existing = findByEmail(email);
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: crypto.randomUUID(),
    email,
    passwordHash,
    name: payload.name || '',
    age: payload.age || null,
    gender: payload.gender || null,
    heightCm: payload.heightCm || null,
    weightKg: payload.weightKg || null,
    activityLevel: payload.activityLevel || 'sedentary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const users = db.getUsers();
  users.push(user);
  db.setUsers(users);

  return sanitizeUser(user);
}

// PUBLIC_INTERFACE
async function authenticate(email, password) {
  /** Authenticates a user by email/password. Returns sanitized user on success. */
  const user = findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  return sanitizeUser(user);
}

// PUBLIC_INTERFACE
function updateUser(id, updates) {
  /** Updates a user profile (excluding password). Returns sanitized user. */
  const users = db.getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const current = users[idx];
  const allowed = ['name', 'age', 'gender', 'heightCm', 'weightKg', 'activityLevel'];
  const next = { ...current };
  allowed.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      next[key] = updates[key];
    }
  });
  next.updatedAt = new Date().toISOString();
  users[idx] = next;
  db.setUsers(users);
  return sanitizeUser(next);
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  authenticate,
  updateUser,
};
