import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const ITEM_CATEGORIES = [
  'Textbooks & Educational Materials',
  'Electronics & Technology',
  'Furniture & Home Decor',
  'Clothing & Accessories',
  'Sports & Fitness Equipment',
  'Musical Instruments',
  'Art & Craft Supplies',
  'Kitchen & Dining',
  'Beauty & Personal Care',
  'Books (non-textbook)',
  'Gaming & Hobbies',
  'Bicycles & Transportation',
  'Dorm Essentials',
  'Event Tickets',
  'Computer Accessories',
  'Office Supplies',
  'Pet Supplies',
  'Outdoor Gear',
  'Tools & Hardware',
  'Other',
]

export const ITEM_CONDITION = ['new', 'like_new', 'good', 'fair', 'poor']

const ItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ITEM_CATEGORIES,
      index: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ITEM_CONDITION,
    },
    price: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    images: [
      {
        type: String,
        validate: {
          validator: function (v: any) {
            return /^https?:\/\/.+/.test(v)
          },
          message: (props: { value: string }) =>
            `${props.value} is not a valid URL!`,
        },
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ['available', 'sold', 'reserved'],
      default: 'available',
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      max: 5,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true },
  },
)

// Virtual for seller information that can be populated
ItemSchema.virtual('sellerInfo', {
  ref: 'User',
  localField: 'seller',
  foreignField: '_id',
  justOne: true,
})

ItemSchema.statics.getCategories = function () {
  return ITEM_CATEGORIES
}

ItemSchema.index({ title: 'text', description: 'text' }) // Enable text search
ItemSchema.index({ 'price.amount': 1 })

const Item = mongoose.model('Item', ItemSchema)

export default Item
