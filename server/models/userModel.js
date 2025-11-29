import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dkovoziev/image/upload/v1761613174/abdus_mfakug.jpg',
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'deliveryman'],
      default: 'user',
    },
    address: [
      {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    // order
  },
  { timestamps: true }
)

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}
// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Ensure only one address is default
userSchema.pre('save', function (next) {
  if (this.isModified('address')) {
    const defaultAddress = this.address.find((addr) => addr.isDefault)

    if (defaultAddress) {
      this.address.forEach((addr) => {
        // Set all others to false
        if (addr !== defaultAddress) addr.isDefault = false
      })
    }
  }

  next()
})

const User = mongoose.model('User', userSchema)

export default User
