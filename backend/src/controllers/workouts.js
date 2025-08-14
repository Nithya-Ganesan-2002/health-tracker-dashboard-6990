'use strict';
const { validationResult } = require('express-validator');
const workoutsService = require('../services/workouts');

class WorkoutsController {
  // PUBLIC_INTERFACE
  create(req, res, next) {
    /** Creates a workout plan for current user. */
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const item = workoutsService.createPlan(req.user.id, req.body);
      return res.status(201).json(item);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  list(req, res, next) {
    /** Lists workout plans for current user. */
    try {
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
      const result = workoutsService.listPlans(req.user.id, { page, limit });
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  update(req, res, next) {
    /** Updates a workout plan by id for current user. */
    try {
      const item = workoutsService.updatePlan(req.user.id, req.params.id, req.body || {});
      return res.status(200).json(item);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  delete(req, res, next) {
    /** Deletes a workout plan by id for current user. */
    try {
      const removed = workoutsService.deletePlan(req.user.id, req.params.id);
      return res.status(200).json(removed);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new WorkoutsController();
