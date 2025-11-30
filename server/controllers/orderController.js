import asyncHandler from '../middleware/asyncHandler.js'
import Order from '../models/orderModel.js'

/* ======================================================
Get all orders for logged-in user
====================================================== */
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
  res.status(200).json({ orders })
})

/* ======================================================
Admin – Get all orders
====================================================== */
export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = parseInt(req.query.perPage) || 10
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1
  const status = req.query.status
  const paymentStatus = req.query.paymentStatus

  const filter = {}

  if (status && status !== 'all') filter.status = status

  if (paymentStatus && paymentStatus !== 'all') {
    if (paymentStatus === 'paid') {
      filter.status = { $in: ['paid', 'complete'] }
    } else if (paymentStatus === 'pending') {
      filter.status = 'pending'
    } else if (paymentStatus === 'failed') {
      filter.status = 'cancelled'
    }
  }

  const skip = (page - 1) * perPage

  const orders = await Order.find(filter)
    .populate('userId', 'name email')
    .populate('items.productId', 'name price image')
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: sortOrder })

  const total = await Order.countDocuments(filter)
  const totalPages = Math.ceil(total / perPage)

  const transformedOrders = orders.map((order) => ({
    id: order._id,
    orderId: `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
    user: {
      _id: order.userId._id,
      name: order.userId.name,
      email: order.userId.email,
    },
    items: order.items.map((item) => ({
      product: {
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
      },
      quantity: item.quantity,
      price: item.price,
    })),
    totalAmount: order.total,
    status: order.status,
    paymentStatus:
      order.status === 'paid' || order.status === 'complete'
        ? 'paid'
        : order.status === 'cancelled'
        ? 'failed'
        : 'pending',
    shippingAddress: order.shippingAddress,
    postalCode: order.postalCode,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }))

  res.json({
    orders: transformedOrders,
    total,
    totalPages,
    currentPage: page,
  })
})

/* ======================================================
Get order by ID
====================================================== */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'userId',
    'name email'
  )

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  res.status(200).json(order)
})

/* ======================================================
Create order from cart
====================================================== */
export const createOrderFromCart = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400)
    throw new Error('Cart items are required')
  }

  if (
    !shippingAddress ||
    !shippingAddress.street ||
    !shippingAddress.city ||
    !shippingAddress.country ||
    !shippingAddress.postalCode
  ) {
    res.status(400)
    throw new Error('Shipping address is required with all fields')
  }

  const validatedItems = items.map((item) => {
    if (!item._id || !item.name || !item.quantity || !item.price) {
      throw new Error('Invalid item structure')
    }

    ;```
return {
  productId: item._id,
  name: item.name,
  quantity: item.quantity,
  price: item.price,
  image: item.image,
}
```
  })

  const total = validatedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const order = await Order.create({
    userId: req.user._id,
    items: validatedItems,
    total,
    shippingAddress,
    postalCode: shippingAddress.postalCode,
    status: 'pending',
  })

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order,
  })
})

/* ======================================================
Update Order Status
====================================================== */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentIntentId, stripeSessionId } = req.body

  const validStatuses = ['pending', 'paid', 'complete', 'cancelled']
  if (!status || !validStatuses.includes(status)) {
    res.status(400)
    throw new Error('Invalid status')
  }

  const order = await Order.findById(req.params.id)
  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  const isOwner = order.userId.toString() === req.user._id.toString()
  const isAdmin = req.user.role === 'admin'
  const isPending = order.status === 'pending'

  if (!isAdmin && (!isOwner || !isPending)) {
    res.status(403)
    throw new Error('Not authorized to update this order')
  }

  const updateData = {
    status,
    updatedAt: new Date(),
  }

  if (status === 'paid') {
    if (paymentIntentId) updateData.paymentIntentId = paymentIntentId
    if (stripeSessionId) updateData.stripeSessionId = stripeSessionId
    updateData.paidAt = new Date()
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: false }
  )

  res.json({
    success: true,
    order: updatedOrder,
    message: `Order status updated to ${status}`,
  })
})

/* ======================================================
Delete Order
====================================================== */
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  if (req.user.role !== 'admin') {
    res.status(403)
    throw new Error('Not authorized to delete this order')
  }

  await Order.findByIdAndDelete(req.params.id)

  res.json({
    success: true,
    message: 'Order deleted successfully',
  })
})
