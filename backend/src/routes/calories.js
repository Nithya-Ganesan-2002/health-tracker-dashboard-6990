'use strict';
const express = require('express');
const caloriesController = require('../controllers/calories');
const { requireAuth } = require('../middleware/auth');
const { calorieLogValidators, paginationValidators, dateRangeValidators } = require('../utils/validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Calories
 *     description: Calorie intake logging
 */

/**
 * @swagger
 * /api/calories:
 *   post:
 *     summary: Log calorie intake
 *     description: Adds a calorie entry for the authenticated user.
 *     tags: [Calories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [calories]
 *             properties:
 *               date: { type: string, format: date-time }
 *               calories: { type: number }
 *               description: { type: string }
 *               mealType: { type: string, enum: [breakfast, lunch, dinner, snack] }
 *               protein: { type: number }
 *               carbs: { type: number }
 *               fat: { type: number }
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 */
router.post('/', requireAuth, calorieLogValidators(), caloriesController.create.bind(caloriesController));

/**
 * @swagger
 * /api/calories:
 *   get:
 *     summary: List calorie entries
 *     description: Returns list of calorie entries for the authenticated user, with optional date filtering and pagination.
 *     tags: [Calories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *     responses:
 *       200:
 *         description: List result
 */
router.get('/', requireAuth, dateRangeValidators(), paginationValidators(), caloriesController.list.bind(caloriesController));

module.exports = router;
