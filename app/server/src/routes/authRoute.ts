import express from 'express'
import { signIn, signUp, verifyEmail, resendVerificationEmail } from '../controllers/authController'

const router = express.Router()
router.post('/register', signUp)
router.post('/login', signIn)
router.patch('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerificationEmail)

export default router