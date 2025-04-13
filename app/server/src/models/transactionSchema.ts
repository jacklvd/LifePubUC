import mongoose from 'mongoose'

const TransactionItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['event', 'item'],
    required: true,
  },
})

const TransactionSchema = new mongoose.Schema({
  checkoutSessionId: {
    type: String,
    required: true,
  },
  paymentIntentId: {
    type: String,
    sparse: true,
    unique: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [TransactionItemSchema],
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
})

const Transaction = mongoose.model('Transaction', TransactionSchema)

export default Transaction
