import mongoose from 'mongoose'

const bannerSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
)

// Check if model already exists to avoid OverwriteModelError
const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema)

export default Banner
