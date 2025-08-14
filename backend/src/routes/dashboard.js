'use strict';
const express = require('express');
const dashboardController = require('../controllers/dashboard');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Progress visualization
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Dashboard summary
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Summary data for charts
 */
router.get('/summary', requireAuth, dashboardController.summary.bind(dashboardController));

module.exports = router;
