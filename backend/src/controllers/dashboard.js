'use strict';
const dashboardService = require('../services/dashboard');

class DashboardController {
  // PUBLIC_INTERFACE
  summary(req, res, next) {
    /** Returns dashboard summary for current user. */
    try {
      const result = dashboardService.getSummary({ ...req.user, ...req.body });
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new DashboardController();
