import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    // core payment information
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    platformFee: {
      type: Number,
      required: true,
    },
    sellerAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'completed',
        'failed',
        'refunded',
        'partially_refunded',
        'disputed',
      ],
      default: 'pending',
    },

    // relationships
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    // stripe information
    checkoutSessionId: String,
    stripeTransferId: String,
    stripeChargeId: String,
    stripeRefundId: String,
    paymentMethod: {
      type: String,
      enum: ['card', 'bank_transfer', 'other'],
      default: 'card',
    },
    lastFourDigits: String,

    // dates
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    completedAt: Date,
    refundedAt: Date,

    // metadata
    notes: String,
    refundReason: String,
    disputeDetails: Object,
  },
  { timestamps: true },
)

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction
