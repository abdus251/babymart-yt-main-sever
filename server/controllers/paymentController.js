// server/controllers/paymentController.js
import Stripe from 'stripe'
import asyncHandler from 'express-async-handler'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY) // .env এ secret key রাখতে হবে

// @desc    Create payment intent
// @route   POST /api/payment/create-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'usd' } = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
  })

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  })
})

// @desc    Handle Stripe webhook
// @route   POST /api/payment/webhook
// @access  Public
export const handleStripeWebhook = asyncHandler(async (req, res) => {
  // stripe webhook logic
  res.status(200).json({ received: true })
})
