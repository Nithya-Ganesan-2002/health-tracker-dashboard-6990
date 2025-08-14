'use strict';
const db = require('../data/db');

// PUBLIC_INTERFACE
function getSummary(user) {
  /** Computes dashboard summary for the last 7 days for a user.
   * Returns totals and trends for calories and workouts.
   */
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6); // include today
  start.setHours(0, 0, 0, 0);

  const calories = db.getCalories().filter((c) => c.userId === user.id);
  const workouts = db.getWorkouts().filter((w) => w.userId === user.id);

  const daily = {};
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    daily[key] = 0;
  }

  calories.forEach((c) => {
    const key = new Date(c.date).toISOString().slice(0, 10);
    if (daily[key] != null) {
      daily[key] += Number(c.calories || 0);
    }
  });

  const dailySeries = Object.entries(daily).map(([date, total]) => ({ date, total }));
  const totalCalories7d = dailySeries.reduce((sum, d) => sum + d.total, 0);
  const avgCalories = Math.round(totalCalories7d / 7);

  return {
    user: {
      id: user.id,
      name: user.name,
      activityLevel: user.activityLevel,
      heightCm: user.heightCm,
      weightKg: user.weightKg,
    },
    calories: {
      totalLast7Days: totalCalories7d,
      averagePerDay: avgCalories,
      dailySeries,
    },
    workouts: {
      count: workouts.length,
      plans: workouts.map((w) => ({ id: w.id, title: w.title, exercises: w.exercises.length })),
    },
  };
}

module.exports = {
  getSummary,
};
