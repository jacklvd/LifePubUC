import mongoose from "mongoose"

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['textbook', 'electronics', 'furniture', 'clothing', 'other'],
    index: true 
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'like_new', 'good', 'fair', 'poor'],
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: any) {
        return /^https?:\/\/.+/.test(v);
      },
      message: (props: { value: string; }) => `${props.value} is not a valid URL!`
    }
  }],
  status: {
    type: String,
    required: true,
    enum: ['available', 'sold', 'reserved'],
    default: 'available',
    index: true // Add index for status-based queries
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  toObject: { virtuals: true }
});

// Indexes
ItemSchema.index({ title: 'text', description: 'text' }); // Enable text search
ItemSchema.index({ 'price.amount': 1 }); // Index for price-based queries

// Virtual for formatted price

// Pre-save middleware

// Instance method to increment views

// Static method to find available items by category

// Static method to find items within a price range

// Query middleware to automatically populate seller information

// Create compound index for complex queries

const Item = mongoose.model('Item', ItemSchema);

export default Item;