import express from 'express'
import {
  createStripeAccount,
  createStripeAccountLink,
  createStripeCheckoutSession,
  getCheckoutSessionStatusStripe,
  handleStripeWebhook,
} from '../controllers/paymentController'

const router = express.Router()

// GET routes
router.get('/session-status', getCheckoutSessionStatusStripe)

// POST routes
router.post('/accounts', createStripeAccount)
router.post('/account-links', createStripeAccountLink)
router.post('/payment-intent', createStripeCheckoutSession)

router.post('/webhooks/stripe', handleStripeWebhook)

export default router
