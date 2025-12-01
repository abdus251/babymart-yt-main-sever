import asyncHandler from 'express-async-handler'
import Banner from '../models/bannerModel.js'
import cloudinary from '../config/cloudinary.js'

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({})
  res.json(banners)
})

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const getBannerById = asyncHandler(async (req, res) => {
  const banners = await Banner.findById(req.params.id)

  if (banners) {
    res.json(banners)
  } else {
    res.status(404)
    throw new Error('Banner not found')
  }
})

export { getBanners, createBanner }

// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
  const { name, title, startFrom, image, bannerType } = req.body

  // const bannerExists = await User.findOne({ name })
  // if (bannerExists) {
  //   res.status(400)
  //   throw new Error('Banner already exists')
  // }

  let imageUrl = ''
  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'admin-dashboard/banners',
    })
    imageUrl = result.secure_url
  }

  const banner = new Banner({
    name,
    title,
    startFrom,
    image: imageUrl || undefined,
    bannerType,
  })

  const createdBanner = await banner.save()
  if (createdBanner) {
    res.status(201).json(createdBanner)
  } else {
    res.status(400)
    throw new Error('Invalid banner data')
  }
})

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
  const { name, title, startFrom, image, bannerType } = req.body

  const banner = await Banner.findById(req.params.id)

  if (banner) {
    banner.name = name || banner.name
    banner.title = title || banner.title
    banner.startFrom = startFrom || banner.startFrom
    banner.bannerType = bannerType || banner.bannerType

    try {
      if (image !== undefined) {
        if (image) {
          const result = await cloudinary.uploader.upload(image, {
            folder: 'admin-dashboard/banners',
          })
          banner.image = result.secure_url
        } else {
          banner.image = undefined // Clear the image (if image is empty string or null)
        }
      }
      const updatedBanner = await banner.save()
      res.json(updatedBanner)
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message)
        res.status(400)
        throw new Error(errors.join(', '))
      }
      res.status(400)
      throw new Error('Invalid banner data')
    }
  } else {
    res.status(404)
    throw new Error('Banner not found')
  }
})

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id)

  if (banner) {
    await banner.deleteOne()
    res.json({ message: 'Banner removed' })
  } else {
    res.status(404)
    throw new Error('Banner not found')
  }
})

export { getBannerById, updateBanner, deleteBanner }
