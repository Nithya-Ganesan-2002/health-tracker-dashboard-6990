'use strict';
const { validationResult } = require('express-validator');
const caloriesService = require('../services/calories');

class CaloriesController {
  // PUBLIC_INTERFACE
  create(req, res, next) {
    /** Creates a calorie entry for current user. */
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const item = caloriesService.logCalories(req.user.id, req.body);
      return res.status(201).json(item);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  list(req, res, next) {
    /** Lists calorie entries for current user with filters. */
    try {
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
      const result = caloriesService.listCalories(req.user.id, {
        from: req.query.from,
        to: req.query.to,
        page,
        limit,
      });
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new CaloriesController();
