'use strict';
const crypto = require('crypto');
const db = require('../data/db');

// PUBLIC_INTERFACE
function createPlan(userId, plan) {
  /** Creates a workout plan for a user.
   * plan: { title, exercises: [{ name, sets?, reps?, durationMin? }], schedule?[] }
   */
  const workouts = db.getWorkouts();
  const item = {
    id: crypto.randomUUID(),
    userId,
    title: plan.title,
    exercises: Array.isArray(plan.exercises) ? plan.exercises : [],
    schedule: Array.isArray(plan.schedule) ? plan.schedule : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  workouts.push(item);
  db.setWorkouts(workouts);
  return item;
}

// PUBLIC_INTERFACE
function listPlans(userId, { page = 1, limit = 50 } = {}) {
  /** Lists workout plans for a user with pagination. */
  const all = db.getWorkouts().filter((w) => w.userId === userId);
  const total = all.length;
  const start = (page - 1) * limit;
  const items = all.slice(start, start + limit);
  return { total, page, limit, items };
}

// PUBLIC_INTERFACE
function updatePlan(userId, id, updates) {
  /** Updates a user's workout plan by id. */
  const workouts = db.getWorkouts();
  const idx = workouts.findIndex((w) => w.userId === userId && w.id === id);
  if (idx === -1) {
    const err = new Error('Workout plan not found');
    err.status = 404;
    throw err;
  }
  const curr = workouts[idx];
  const next = { ...curr };
  if (updates.title != null) next.title = updates.title;
  if (Array.isArray(updates.exercises)) next.exercises = updates.exercises;
  if (Array.isArray(updates.schedule)) next.schedule = updates.schedule;
  next.updatedAt = new Date().toISOString();
  workouts[idx] = next;
  db.setWorkouts(workouts);
  return next;
}

// PUBLIC_INTERFACE
function deletePlan(userId, id) {
  /** Deletes a workout plan by id for a user. */
  const workouts = db.getWorkouts();
  const idx = workouts.findIndex((w) => w.userId === userId && w.id === id);
  if (idx === -1) {
    const err = new Error('Workout plan not found');
    err.status = 404;
    throw err;
  }
  const removed = workouts.splice(idx, 1)[0];
  db.setWorkouts(workouts);
  return removed;
}

module.exports = {
  createPlan,
  listPlans,
  updatePlan,
  deletePlan,
};
