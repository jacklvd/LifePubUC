import { Request, Response, NextFunction } from 'express'
import User from '../models/userSchema'

export const validateSellerMiddleware = async (
  req: Request,
  res: Response,
  nextFunction: NextFunction,
): Promise<void> => {
  try {
    const { sellerId } = req.params

    console.log(sellerId);

    if (!sellerId) {
      res.status(400).json({ message: 'Seller ID is required', data: {} })
      return
    }

    const seller = await User.findById(sellerId)
    console.log(seller);

    if (!seller) {
      res.status(400).json({ message: 'Seller does not exist', data: {} })
      return
    }

    if (!seller.stripeConnectOnboardingComplete) {
      res.status(403).json({
        message: 'Seller has not completed Stripe Connect onboarding',
        data: {},
      })
      return
    }

    nextFunction()
  } catch (error) {
    console.error('Error validating seller:', error)
    res.status(500).json({ message: 'Error validating seller', error })
  }
}
