'use strict';
const crypto = require('crypto');
const db = require('../data/db');

// PUBLIC_INTERFACE
function logCalories(userId, entry) {
  /** Logs a calorie entry for a user.
   * entry: { date?, calories, description?, mealType?, protein?, carbs?, fat? }
   */
  const date = entry.date ? new Date(entry.date).toISOString() : new Date().toISOString();
  const item = {
    id: crypto.randomUUID(),
    userId,
    date,
    calories: Number(entry.calories || 0),
    description: entry.description || '',
    mealType: entry.mealType || null,
    protein: entry.protein != null ? Number(entry.protein) : null,
    carbs: entry.carbs != null ? Number(entry.carbs) : null,
    fat: entry.fat != null ? Number(entry.fat) : null,
    createdAt: new Date().toISOString(),
  };
  const caloriesList = db.getCalories();
  caloriesList.push(item);
  db.setCalories(caloriesList);
  return item;
}

// PUBLIC_INTERFACE
function listCalories(userId, { from, to, page = 1, limit = 50 } = {}) {
  /** Lists calorie entries for a user with optional date range and pagination. */
  const all = db.getCalories().filter((c) => c.userId === userId);
  let filtered = all;
  if (from) {
    const f = new Date(from).getTime();
    filtered = filtered.filter((c) => new Date(c.date).getTime() >= f);
  }
  if (to) {
    const t = new Date(to).getTime();
    filtered = filtered.filter((c) => new Date(c.date).getTime() <= t);
  }
  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);
  return { total, page, limit, items };
}

module.exports = {
  logCalories,
  listCalories,
};
