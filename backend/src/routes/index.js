const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth');
const caloriesRoutes = require('./calories');
const workoutsRoutes = require('./workouts');
const dashboardRoutes = require('./dashboard');
const insightsRoutes = require('./insights');

const router = express.Router();

// Root health endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount versioned API routes
router.use('/api/auth', authRoutes);
router.use('/api/calories', caloriesRoutes);
router.use('/api/workouts', workoutsRoutes);
router.use('/api/dashboard', dashboardRoutes);
router.use('/api/insights', insightsRoutes);

module.exports = router;
