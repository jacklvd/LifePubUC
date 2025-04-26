import express from 'express'
import {
  signIn,
  signUp,
  verifyEmail,
  resendVerificationEmail,
  resetPassword,
  forgotPassword,
  validateResetToken,
} from '../controllers/authController'

const router = express.Router()
router.post('/register', signUp)
router.post('/login', signIn)
router.patch('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerificationEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/validate-reset-token/:token', validateResetToken)

export default router
