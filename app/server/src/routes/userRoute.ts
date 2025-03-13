import express from 'express'
import {
  getUserOnboardingStripe,
  getUserOnboardingStripeData,
} from '../controllers/userController'

const router = express.Router()

router.post('/onboarding', getUserOnboardingStripe)
// get all the info of user
router.post('/user', getUserOnboardingStripeData)

export default router
