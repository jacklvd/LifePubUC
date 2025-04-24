import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import Redis from 'ioredis'
import {
  EMAIL_USER,
  EMAIL_PASS,
  FRONTEND_URL,
  JWT_SECRET,
  REDIS_HOST,
  REDIS_PASSWORD,
} from '../../config/env'

import User from '../models/userSchema'

// Define interface for storage mechanism
interface StorageMechanism {
  get(key: string): Promise<string | null>
  setex(key: string, seconds: number, value: string): Promise<any>
  del(key: string): Promise<any>
}

// Create a memory fallback for development if Redis isn't available
class MemoryStore implements StorageMechanism {
  private store: Map<string, string>
  private expiryTimes: Map<string, number>

  constructor() {
    this.store = new Map<string, string>()
    this.expiryTimes = new Map<string, number>()
  }

  async get(key: string): Promise<string | null> {
    // Check if key has expired
    if (this.expiryTimes.has(key) && Date.now() > this.expiryTimes.get(key)!) {
      this.del(key)
      return null
    }
    return this.store.get(key) || null
  }

  async setex(key: string, seconds: number, value: string): Promise<string> {
    this.store.set(key, value)
    this.expiryTimes.set(key, Date.now() + seconds * 1000)
    return 'OK'
  }

  async del(key: string): Promise<number> {
    this.store.delete(key)
    this.expiryTimes.delete(key)
    return 1
  }
}

// Initialize a storage mechanism - either Redis or memory fallback
let storage: StorageMechanism
let isUsingFallback = false
try {
  // Try to initialize Redis

  const redis = new Redis({
    port: 19001, // Redis port
    host: REDIS_HOST as string, // Redis host
    username: 'default', // needs Redis >= 6
    password: REDIS_PASSWORD as string, // Redis password
    db: 0, // Defaults to 0
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000)
      return delay
    },

    maxRetriesPerRequest: 3,
  })

  // Handle Redis connection errors
  redis.on('error', (err: Error) => {
    console.error('Redis connection error:', err)
    if ((err as any).code === 'ECONNREFUSED' && !isUsingFallback) {
      console.warn(
        'Redis connection failed, using in-memory storage as fallback',
      )
      storage = new MemoryStore()
      isUsingFallback = true
    }
  })

  redis.on('connect', () => {
    console.log('Successfully connected to Redis')
    storage = redis as unknown as StorageMechanism
    isUsingFallback = false
  })

  // Initial setting
  storage = redis as unknown as StorageMechanism
} catch (error) {
  console.error('Error initializing Redis:', error)
  storage = new MemoryStore()
  isUsingFallback = true
}

// Set a default expiration time for verification tokens (e.g., 24 hours)
const VERIFICATION_EXPIRY = 24 * 60 * 60 // 24 hours in seconds
const VERIFICATION_EXPIRY_MS = VERIFICATION_EXPIRY * 1000 // 24 hours in milliseconds

const sendVerificationEmail = async (email: string, fullName: string, verificationToken: string) => {
  const verificationLink = `${FRONTEND_URL}/verify-credential?emailToken=${verificationToken}`
  
  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: '🎉 Confirm Your Email - Welcome to LifePub!',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hi ${fullName}! 😊</h2>
        <p>Thank you for signing up for LifePub! 🎉</p>
        <p>To get started, please confirm your email address by clicking the link below:</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="${verificationLink}" 
            style="display: inline-block; padding: 12px 20px; font-size: 16px; 
            color: #fff; background-color: #007bff; text-decoration: none; 
            border-radius: 5px;">
            ✅ Verify My Email
          </a>
        </p>
        <p>Or, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #f4f4f4; padding: 10px; border-radius: 5px;">
          <a href="${verificationLink}" style="color: #007bff;">${verificationLink}</a>
        </p>
        <p><strong>This link will expire in 24 hours.</strong></p>
        <p>If you didn't sign up for LifePub, you can safely ignore this email.</p>
        <p>Wishing you all the best! 💙</p>
        <p><strong>The LifePub Team 🚀</strong></p>
      </div>
    `,
  })
  
  return verificationLink
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
})

export const verifyEmail = async (req: any, res: any) => {
  try {
    const { emailToken } = req.body

    // Check if token is provided
    if (!emailToken) {
      return res.status(400).json({
        success: false,
        message: 'Token is required.',
      })
    }

    // Retrieve user data from storage
    const userDataJson = await storage.get(`verification:${emailToken}`)

    if (!userDataJson) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token. Please request a new verification email.',
      })
    }

    const userData = JSON.parse(userDataJson)

    // Check if user already exists (could have been verified through another link)
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser && existingUser.isVerified) {
      // Delete the verification token from storage
      await storage.del(`verification:${emailToken}`)
      await storage.del(`email:${userData.email}`)
      
      return res.status(200).json({
        success: true,
        message: 'Your email is already verified. You can sign in.',
      })
    }
    
    // If user exists but is not verified, update it
    if (existingUser && !existingUser.isVerified) {
      existingUser.isVerified = true
      await existingUser.save()
      
      // Delete the verification token from storage
      await storage.del(`verification:${emailToken}`)
      await storage.del(`email:${userData.email}`)
      
      return res.status(200).json({
        success: true,
        message: 'Email verified successfully. You can now sign in.',
      })
    }

    // Save verified user to the database
    const newUser = new User({
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      universityId: userData.universityId,
      isVerified: true,
    })

    await newUser.save()

    // Delete the verification token from storage
    await storage.del(`verification:${emailToken}`)
    await storage.del(`email:${userData.email}`)

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now sign in.',
    })
  } catch (error: any) {
    console.error('Error verifying email:', error)
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: error.message,
    })
  }
}

export const signUp = async (req: any, res: any) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { fullName, email, password, universityId } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    // If user exists and is verified, reject the signup
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ 
        message: 'User already exists and is verified. Please sign in instead.' 
      })
    }
    
    // Check if this email already has a pending verification
    const hasExistingVerification = await storage.get(`email:${email}`)
    if (hasExistingVerification) {
      return res.status(400).json({
        message: 'A verification email has already been sent. Please check your inbox or request a new verification email.',
        canResend: true,
        email: email
      })
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Hash the password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // If user exists but is not verified, update the password in case they are trying again
    if (existingUser && !existingUser.isVerified) {
      existingUser.password = hashedPassword
      await existingUser.save()
    }

    // Store user data in storage
    const userData = {
      fullName,
      email,
      password: hashedPassword,
      universityId,
      isVerified: false,
      createdAt: new Date().toISOString(),
    }

    // Store the token with the user data, with expiration
    await storage.setex(
      `verification:${verificationToken}`,
      VERIFICATION_EXPIRY,
      JSON.stringify(userData)
    )

    // Store a reference from email to token to prevent duplicate verification emails
    await storage.setex(
      `email:${email}`,
      VERIFICATION_EXPIRY,
      verificationToken
    )

    // Send verification email
    await sendVerificationEmail(email, fullName, verificationToken)

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      message: 'Please check your email to verify your account. The verification link will expire in 24 hours.',
    })
  } catch (error: any) {
    console.log(error)
    await session.abortTransaction()
    session.endSession()
    res.status(500).json({
      message: 'Error creating user',
      error: error.message,
    })
  }
}

export const resendVerificationEmail = async (req: any, res: any) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.'
      })
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email })
    
    // If user exists and is already verified
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This email is already verified. Please sign in.'
      })
    }
    
    // Check if there is an existing token
    const existingToken = await storage.get(`email:${email}`)
    
    // If there is an existing token, delete it
    if (existingToken) {
      await storage.del(`verification:${existingToken}`)
      await storage.del(`email:${email}`)
    }
    
    // Get user data - either from existing user or from request
    let userData
    let fullName
    
    if (existingUser) {
      // Use existing user data
      fullName = existingUser.fullName
      userData = {
        fullName: existingUser.fullName,
        email: existingUser.email,
        password: existingUser.password,
        universityId: existingUser.universityId,
        isVerified: false,
        createdAt: new Date().toISOString(),
      }
    } else {
      // We need more information to create a new verification
      return res.status(404).json({
        success: false,
        message: 'No pending verification found for this email. Please sign up first.'
      })
    }
    
    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    
    // Store the token with the user data, with expiration
    await storage.setex(
      `verification:${verificationToken}`,
      VERIFICATION_EXPIRY,
      JSON.stringify(userData)
    )
    
    // Store a reference from email to token
    await storage.setex(
      `email:${email}`,
      VERIFICATION_EXPIRY,
      verificationToken
    )
    
    // Send the verification email
    await sendVerificationEmail(email, fullName, verificationToken)
    
    return res.status(200).json({
      success: true,
      message: 'Verification email resent successfully. Please check your inbox.',
      expiresIn: `${VERIFICATION_EXPIRY / 3600} hours`
    })
    
  } catch (error: any) {
    console.error('Error resending verification email:', error)
    return res.status(500).json({
      success: false,
      message: 'Error resending verification email',
      error: error.message
    })
  }
}

// signIn function remains the same
export const signIn = async (req: any, res: any) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' })
    }
    // Check if user is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: 'Email not verified. Please check your email.' })
    }
    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Incorrect password. Please try again.' })
    }
    // Generate a token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET as string, {
      expiresIn: '1h',
    })

    res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      data: {
        user,
        token,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      message: 'Error signing in',
      error: error.message,
    })
  }
}
