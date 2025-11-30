import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  createPaymentIntent,
  handleStripeWebhook,
} from '../controllers/paymentController.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentIntent:
 *       type: object
 *       properties:
 *         clientSecret:
 *           type: string
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *       required:
 *         - clientSecret
 *         - amount
 *         - currency
 */

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Create a payment intent
 *     tags: [Payment]
 */
router.post('/create-intent', protect, createPaymentIntent)

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Handle Stripe webhook
 *     tags: [Payment]
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
)

export default router
