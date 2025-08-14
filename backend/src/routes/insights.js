'use strict';
const express = require('express');
const insightsController = require('../controllers/insights');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Insights
 *     description: Personalized health insights
 */

/**
 * @swagger
 * /api/insights/targets:
 *   get:
 *     summary: Estimated calorie targets
 *     tags: [Insights]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Returns estimated TDEE and macros
 */
router.get('/targets', requireAuth, insightsController.targets.bind(insightsController));

/**
 * @swagger
 * /api/insights/tips:
 *   get:
 *     summary: Personalized tips
 *     tags: [Insights]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Tips based on user profile and intake
 */
router.get('/tips', requireAuth, insightsController.tips.bind(insightsController));

module.exports = router;
