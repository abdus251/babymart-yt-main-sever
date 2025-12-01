import User from '../models/userModel.js'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'

// ================================
// 1. GET OVERALL ANALYTICS
// ================================
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()

    const paidOrders = await Order.find({
      status: { $in: ['paid', 'complete'] },
    })

    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0)

    return res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message,
    })
  }
}

// ================================
// 2. PRODUCT ANALYTICS
// ================================
export const getProductAnalytics = async (req, res) => {
  try {
    const products = await Product.find().select('name stock price sold')
    return res.status(200).json({
      success: true,
      analytics: { products },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product analytics',
      error: error.message,
    })
  }
}

// ================================
// 3. SALES ANALYTICS
// ================================
export const getSalesAnalytics = async (req, res) => {
  try {
    const sales = await Order.find().select('total status createdAt')

    return res.status(200).json({
      success: true,
      analytics: { sales },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sales analytics',
      error: error.message,
    })
  }
}

// ================================
// 4. INVENTORY ANALYTICS
// ================================
export const getInventoryAnalytics = async (req, res) => {
  try {
    const outOfStock = await Product.countDocuments({ stock: 0 })
    const lowStock = await Product.countDocuments({ stock: { $lt: 10 } })

    return res.status(200).json({
      success: true,
      analytics: {
        outOfStock,
        lowStock,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory analytics',
      error: error.message,
    })
  }
}

// import User from '../models/userModel.js'
// import Order from '../models/orderModel.js'
// import Product from '../models/productModel.js'

// export const getAnalytics = async (req, res) => {
//   try {
//     // Count total users
//     const totalUsers = await User.countDocuments()

//     // Count total products
//     const totalProducts = await Product.countDocuments()

//     // Count total orders
//     const totalOrders = await Order.countDocuments()

//     // Calculate total revenue (orders with status 'paid'/'complete')
//     const paidOrders = await Order.find({
//       status: { $in: ['paid', 'complete'] },
//     })

//     const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0)

//     return res.status(200).json({
//       success: true,
//       analytics: {
//         totalUsers,
//         totalProducts,
//         totalOrders,
//         totalRevenue,
//       },
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch analytics data',
//       error: error.message,
//     })
//   }
// }
