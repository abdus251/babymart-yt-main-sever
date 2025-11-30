import express from express
import { 
    getAnalyticsOverview,
getProductAnalytics,
getSalesAnalytics,
getInventoryAnalytics                                               
} from '../controllers/analyticsController.js' 
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// All analytics routes require authentication
router.use(protect)
router.use(admin)

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get analytics overview
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object   
 *                       properties:
 *                         totalProducts:
 *                           type: number
 *                         totalOrders: 
 *                           type: number
 *                         totalUsers:
 *                           type: number
 *                         totalRevenue:
 *                           type: number
 *                     sales:
 *                       type: object
 *                       properties:
 *                         bestSellingProducts:
 *                           type: array    
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string 
 *                               productName:
 *                                 type: string
 *                               totalSold:
 *                                 type: number
 *                               totalRevenue:  
 *                                 type: number
 *                         recentOrders:    
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Order'   
 *                         monthlyRevenue:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               month:
 *                                 type: string
 *                               revenue:
 *                                 type: number 
 *                               orders:
 *                                 type: number 
 *                     inventory:
 *                       type: object   
 *                       properties:
 *                         productsOutOfStock:  
 *                           type: number   
 *                         productsLowStock:    
 *                           type: number   
 *       401:
 *         description: Unauthorized
 *       403:   
 *         description: Forbidden   
 *       500:
 *         description: Internal server error                         
 */

router.get('/overview', getAnalyticsOverview)

/**
 * @swagger
 * /api/analytics/products:
 *   get:
 *     summary: Get product analytics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     bestSellingProducts:
 *                       type: array    
 *                       items:
 *                         type: object
 */