import express from 'express'
import { getStats } from '../controllers/statsController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get stats
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                     totalOrders:
 *                       type: number
 *                     totalSales:
 *                       type: number
 *                     totalProducts:
 *                       type: number
 *                     totalRevenue:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/').get(protect, getStats)

export default router
