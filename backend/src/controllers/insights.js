'use strict';
const dashboardService = require('../services/dashboard');
const insightsService = require('../services/insights');

class InsightsController {
  // PUBLIC_INTERFACE
  targets(req, res, next) {
    /** Returns estimated calorie targets and macros for current user. */
    try {
      const user = req.user;
      const result = insightsService.estimateTargets(user);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  tips(req, res, next) {
    /** Returns personalized tips based on average calories vs target. */
    try {
      const summary = dashboardService.getSummary(req.user);
      const avg = summary.calories.averagePerDay || 0;
      const result = insightsService.generateTips(req.user, avg);
      return res.status(200).json({ averageCalories: avg, ...result });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new InsightsController();
