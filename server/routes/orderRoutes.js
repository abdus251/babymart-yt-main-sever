import express from 'express'
import {
  getOrderById,
  getOrders,
  createOrderFromCart,
  updateOrderStatus,
  deleteOrder,
  getAllOrdersAdmin,
  updateOrderStatusFromWebhook,
} from '../controllers/orderController.js'

import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Admin: GET all orders
router.route('/admin').get(protect, getAllOrdersAdmin)

// Get all orders / Create new order
router.route('/').get(protect, getOrders).post(protect, createOrderFromCart)

// Order by ID
router.route('/:id').get(protect, getOrderById).delete(protect, deleteOrder)

// Update order status (Admin)
router.route('/:id/status').put(protect, admin, updateOrderStatus)

// Update order status from webhook (No protect)
router.route('/:id/webhook-status').put(updateOrderStatusFromWebhook)

export default router
