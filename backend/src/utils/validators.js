'use strict';
const { body, query, param } = require('express-validator');

// PUBLIC_INTERFACE
function registerValidators() {
  /** Validation chain for register endpoint */
  return [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password min length 6'),
    body('name').optional().isString().trim(),
    body('age').optional().isInt({ min: 0, max: 120 }),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('heightCm').optional().isFloat({ min: 50, max: 300 }),
    body('weightKg').optional().isFloat({ min: 20, max: 500 }),
    body('activityLevel').optional().isIn(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  ];
}

// PUBLIC_INTERFACE
function loginValidators() {
  /** Validation chain for login endpoint */
  return [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isString().notEmpty(),
  ];
}

// PUBLIC_INTERFACE
function calorieLogValidators() {
  /** Validation chain for calorie logging endpoint */
  return [
    body('date').optional().isISO8601().withMessage('date must be ISO8601'),
    body('calories').isFloat({ min: 0 }).withMessage('calories must be a positive number'),
    body('description').optional().isString().trim(),
    body('mealType').optional().isIn(['breakfast', 'lunch', 'dinner', 'snack']),
    body('protein').optional().isFloat({ min: 0 }),
    body('carbs').optional().isFloat({ min: 0 }),
    body('fat').optional().isFloat({ min: 0 }),
  ];
}

// PUBLIC_INTERFACE
function workoutPlanValidators() {
  /** Validation chain for workout plan create/update */
  return [
    body('title').isString().notEmpty().withMessage('title is required'),
    body('exercises').isArray({ min: 1 }).withMessage('exercises must be an array'),
    body('exercises.*.name').isString().notEmpty(),
    body('exercises.*.sets').optional().isInt({ min: 1 }),
    body('exercises.*.reps').optional().isInt({ min: 1 }),
    body('exercises.*.durationMin').optional().isInt({ min: 1 }),
    body('schedule').optional().isArray(),
  ];
}

// PUBLIC_INTERFACE
function paginationValidators() {
  /** Optional pagination validators for list endpoints */
  return [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ];
}

// PUBLIC_INTERFACE
function idParamValidator() {
  /** Common validator for ID param */
  return [param('id').isString().notEmpty()];
}

// PUBLIC_INTERFACE
function dateRangeValidators() {
  /** Optional date range validators for filters */
  return [
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
  ];
}

module.exports = {
  registerValidators,
  loginValidators,
  calorieLogValidators,
  workoutPlanValidators,
  paginationValidators,
  idParamValidator,
  dateRangeValidators,
};
