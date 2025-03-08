import express from 'express'
import { signIn, signUp, verifyEmail } from '../controllers/authController'

const router = express.Router()
router.post('/register', signUp)
router.post('/login', signIn)
router.patch('/verify-email', verifyEmail)

export default router
