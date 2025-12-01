import Product from '../models/productModel.js'
import Category from '../models/categoryModel.js'
import Brand from '../models/brandModel.js'
import Order from '../models/orderModel.js'
import asyncHandler from 'express-async-handler'

// @desc    Get stats
// @route   GET /api/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments()
  const productsCount = await Product.countDocuments()
  const ordersCount = await Order.countDocuments()
  const categoriesCount = await Category.countDocuments()
  const brandsCount = await Brand.countDocuments()

  //    Get total revenue from completed orders
  const revenueData = await Order.aggregate([
    {
      $match: { status: { $in: ['Delivered', 'completed', 'Paid'] } },
    },
    { $group: { _id: null, totalAmount: { $sum: '$totalPrice' } } },
  ])
  const totalRevenue = revenueData[0]?.totalAmount || 0

  // Get user roles distribution
  const roles = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ])

  //
  //
  //
  //
  //
  // Get category distribution
  const categoryData = await Product.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    {
      $unwind: '$categoryInfo',
    },
    {
      $group: {
        _id: '$categoryInfo.name',
        count: { $sum: 1 },
      },
    },
  ])

  // Get brand distribution
  const brandData = await Product.aggregate([
    {
      $lookup: {
        from: 'brands',
        localField: 'brand',
        foreignField: '_id',
        as: 'brandInfo',
      },
    },
    {
      $unwind: '$brandInfo',
    },
    {
      $group: {
        _id: '$brandInfo.name',
        count: { $sum: 1 },
      },
    },
  ])

  res.json({
    counts: {
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      categories: categoriesCount,
      brands: brandsCount,
      totalRevenue: totalRevenue,
    },
    roles: roles.map((role) => ({
      name: role._id,
      count: role.count,
    })),
    categories: categoryData.map((category) => ({
      name: category._id,
      count: category.count,
    })),
    brands: brandData.map((brand) => ({
      name: brand._id,
      count: brand.count,
    })),
  })
})

export { getStats }
