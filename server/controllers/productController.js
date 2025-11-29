import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
// import cloudinary from 'cloudinary'

//  createProduct

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    brand,
    image,
    discountPercentage,
    stock,
  } = req.body
  //   Check if product already exists
  const productExists = await Product.findOne({ name })
  if (productExists) {
    res.status(400)
    throw new Error('Product already exists')
  }

  //   Upload image to cloudinary
  const product = await Product.create({
    name,
    price,
    description,
    category,
    brand,
    image,
    discountPercentage: discountPercentage || 0,
    stock: stock || 0,
    image: '',
  })
  if (product) {
    res.status(201).json(product)
  } else {
    res.status(400)
    throw new Error('Invalid product data')
  }
})

export { createProduct }
