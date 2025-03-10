import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  fullName: string
  email: string
  password: string
  universityId: string
  isVerified: boolean
  verificationToken?: string

  // Stripe Connect fields
  stripeCustomerId?: string // For buyers to save payment methods
  stripeConnectAccountId?: string // For sellers to receive payments
  stripeConnectOnboardingComplete?: boolean

  // Optional: Saved payment methods
  defaultPaymentMethodId?: string

  createdAt: Date
  updatedAt: Date
}

// Define the User schema
const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    universityId: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Stripe Connect fields
    stripeCustomerId: {
      type: String,
      sparse: true,
    },
    stripeConnectAccountId: {
      type: String,
      sparse: true,
    },
    stripeConnectOnboardingComplete: {
      type: Boolean,
      default: false,
    },
    defaultPaymentMethodId: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
)

export const User = mongoose?.models?.User || mongoose.model('User', userSchema)
export default User
