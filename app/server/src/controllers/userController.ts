import { Request, Response } from 'express'
import User from '../models/userSchema'

export const getUserOnboardingStripe = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId)
    console.log(userId)
    if (!user) {
      res.status(400).json({ message: 'User does not exist' })
      return
    }

    if (!user.stripeConnectOnboardingComplete) {
      res.status(400).json({ message: "User hasn't finish onboarding" })
      return
    }

    res.status(200).json({
      message: 'Found user',
      data: user.stripeConnectOnboardingComplete,
    })
    return
  } catch (error) {
    res.status(500).json({ message: 'Get user failed' })
    console.log('User failed: ', error)
    return
  }
}

export const getUserOnboardingStripeData = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId)
    console.log(userId)
    if (!user) {
      res.status(400).json({ message: 'User does not exist' })
      return
    }

    if (!user.stripeConnectOnboardingComplete) {
      res.status(400).json({ message: "User hasn't finish onboarding" })
      return
    }

    res.status(200).json({ message: 'Found user', data: user })
    return
  } catch (error) {
    res.status(500).json({ message: 'Get user failed' })
    console.log('User failed: ', error)
    return
  }
}
