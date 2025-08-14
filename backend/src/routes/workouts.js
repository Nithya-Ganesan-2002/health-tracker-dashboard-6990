'use strict';
const express = require('express');
const workoutsController = require('../controllers/workouts');
const { requireAuth } = require('../middleware/auth');
const { workoutPlanValidators, paginationValidators, idParamValidator } = require('../utils/validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Workouts
 *     description: Workout plan management
 */

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Create workout plan
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, exercises]
 *             properties:
 *               title: { type: string }
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     sets: { type: integer }
 *                     reps: { type: integer }
 *                     durationMin: { type: integer }
 *               schedule:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', requireAuth, workoutPlanValidators(), workoutsController.create.bind(workoutsController));

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: List workout plans
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
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
router.get('/', requireAuth, paginationValidators(), workoutsController.list.bind(workoutsController));

/**
 * @swagger
 * /api/workouts/{id}:
 *   put:
 *     summary: Update workout plan
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:id', requireAuth, idParamValidator(), workoutsController.update.bind(workoutsController));

/**
 * @swagger
 * /api/workouts/{id}:
 *   delete:
 *     summary: Delete workout plan
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', requireAuth, idParamValidator(), workoutsController.delete.bind(workoutsController));

module.exports = router;
