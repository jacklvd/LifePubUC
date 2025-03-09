import mongoose from 'mongoose'
import Item from '../models/itemSchema'
import dotenv from 'dotenv'

dotenv.config()

async function seedItems() {
  const items = [
    {
      title: 'Campbell Biology 12th Edition',
      description:
        'Excellent condition biology textbook. Used for one semester in BIO101. Minimal highlighting, no damage. ISBN: 978-0135188743.',
      category: 'textbook',
      condition: 'good',
      price: { amount: 75.99 },
      images: ['https://example.com/biology-textbook.jpg'],
      status: 'available',
      views: 12,
    },
    {
      title: 'Dorm Room Study Desk',
      description:
        'IKEA MICKE desk, white. Perfect for small dorm spaces. Some minor scratches but sturdy and functional. Must pick up from Campus Housing Building B.',
      category: 'furniture',
      condition: 'fair',
      price: { amount: 45.0 },
      images: ['https://example.com/desk.jpg'],
      status: 'available',
      views: 34,
    },
    {
      title: 'TI-84 Plus Graphing Calculator',
      description:
        'Required for Calculus and Statistics courses. All functions working perfectly. Includes batteries and case.',
      category: 'electronics',
      condition: 'like_new',
      price: { amount: 89.99 },
      images: ['https://example.com/calculator.jpg'],
      status: 'available',
      views: 56,
    },
    {
      title: 'Lab Coat - Size M',
      description:
        'White lab coat used for one semester in Chemistry lab. No stains, freshly laundered. Required for all lab courses.',
      category: 'clothing',
      condition: 'good',
      price: { amount: 15.0 },
      images: ['https://example.com/labcoat.jpg'],
      status: 'available',
      views: 8,
    },
    {
      title: 'Introduction to Psychology Textbook',
      description:
        'PSY101 textbook, 11th edition. Some highlighting but otherwise in great condition. Includes online access code (unused).',
      category: 'textbook',
      condition: 'good',
      price: { amount: 65.5 },
      images: ['https://example.com/psych-book.jpg'],
      status: 'available',
      views: 23,
    },
    {
      title: 'Mini Dorm Refrigerator',
      description:
        '3.3 cubic feet mini fridge. Perfect for dorm rooms. Energy efficient, works great. Graduating and need to sell.',
      category: 'electronics',
      condition: 'fair',
      price: { amount: 85.0 },
      images: ['https://example.com/fridge.jpg'],
      status: 'available',
      views: 67,
    },
    {
      title: 'Engineering Drafting Table',
      description:
        'Adjustable angle drafting table with parallel bar. Perfect for architecture and engineering students. Some wear but fully functional.',
      category: 'furniture',
      condition: 'good',
      price: { amount: 120.0 },
      images: ['https://example.com/drafting-table.jpg'],
      status: 'available',
      views: 45,
    },
    {
      title: 'Chemistry Lab Safety Goggles',
      description:
        'Required safety goggles for all lab courses. Used for one semester, sanitized and in perfect condition.',
      category: 'other',
      condition: 'like_new',
      price: { amount: 8.99 },
      images: ['https://example.com/goggles.jpg'],
      status: 'available',
      views: 15,
    },
    {
      title: 'Nursing Scrubs Set - Size L',
      description:
        'Two sets of navy blue scrubs. Required for nursing program. Worn only a few times, excellent condition.',
      category: 'clothing',
      condition: 'like_new',
      price: { amount: 35.0 },
      images: ['https://example.com/scrubs.jpg'],
      status: 'available',
      views: 28,
    },
    {
      title: 'Calculus: Early Transcendentals',
      description:
        '8th edition, James Stewart. Required for Calculus I-III. Some solved problems in pencil but clean overall.',
      category: 'textbook',
      condition: 'good',
      price: { amount: 82.5 },
      images: ['https://example.com/calculus-book.jpg'],
      status: 'available',
      views: 41,
    },
  ]

  try {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables')
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    console.log('Clearing existing items...')
    await Item.deleteMany({})

    console.log('Inserting new items...')
    const result = await Item.insertMany(items)

    console.log(`Successfully seeded ${result.length} items`)
    return result
  } catch (error) {
    console.error('Error seeding items:', error)
    throw error
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect()
      console.log('Disconnected from MongoDB')
    }
  }
}

;(async () => {
  try {
    await seedItems()
    process.exit(0)
  } catch (error) {
    console.error('Failed to seed:', error)
    process.exit(1)
  }
})()
