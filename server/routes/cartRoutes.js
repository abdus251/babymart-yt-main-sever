import express from 'express'
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} from '../controllers/cartController.js'

const router = express.Router()

// All cart routes are protected
router.use(protect)

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CartItem'
 */
router.route('/').get(getCart).post(addItemToCart).delete(clearCart)
/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *   put:
 *     summary: Update a cart item
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 */
router.route('/update').put(updateCartItem)

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Remove a cart item
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart item
 */
router.route('/:productId').delete(removeItemFromCart)

export default router
