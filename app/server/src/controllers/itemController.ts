import { Request, Response } from 'express'
import Item from '../models/itemSchema'
import { v2 as cloudinary } from 'cloudinary'

import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import User from '../models/userSchema'
import { CLOUDINARY_NAME } from '../../config/env'

interface StorageOptions {
  cloudinary: typeof cloudinary
  params: {
    resource_type?: string
    allowed_formats?: string[]
    public_id?: (req: Request, file: Express.Multer.File) => string
    transformation?: Array<Record<string, any>>
    // Add other properties you need
  }
}

export function createCloudinaryStorage() {
  cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  console.log('Cloudinary config:', {
    cloud_name: CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY?.substring(0, 3) + '...', // Don't log the full key
  })

  // Create storage
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'items',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [{ width: 1000, crop: 'limit' }],
    } as any,
  })

  // Return the middleware
  return multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  })
}

// Interface for query parameters
interface ItemQueryParams {
  category?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  status?: string
  sort?: string
  page?: number
  limit?: number
}

/***************************
 *  User Route
 ****************************/
export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      condition,
      minPrice,
      maxPrice,
      status = 'available',
      sort = '-createdAt',
      page = 1,
      limit = 10,
    } = req.query as unknown as ItemQueryParams

    // Build query
    const query: any = {}

    if (category) query.category = category
    if (condition) query.condition = condition
    if (status) query.status = status
    if (minPrice || maxPrice) {
      query['price.amount'] = {}
      if (minPrice) query['price.amount'].$gte = minPrice
      if (maxPrice) query['price.amount'].$lte = maxPrice
    }

    const skip = (page - 1) * limit

    const items = await Item.find(query).sort(sort).skip(skip).limit(limit)

    const total = await Item.countDocuments(query)

    res.status(200).json({
      message: 'Items retrieved successfully',
      data: items,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    })
  } catch (error) {
    console.error('Error fetching items:', error)
    res.status(500).json({ message: 'Error fetching items', error })
  }
}

// Get single item by ID
export const getItemById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params

    const item = await Item.findById(id)

    if (!item) {
      res.status(404).json({ message: 'Item not found' })
      return
    }

    // Increment views
    item.views += 1
    await item.save()

    res.status(200).json({
      message: 'Item retrieved successfully',
      data: item,
    })
  } catch (error) {
    console.error('Error fetching item:', error)
    res.status(500).json({ message: 'Error fetching item', error })
  }
}

/***************************
 *  Seller Route
 ****************************/

export const createItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, category, condition, price, images, userId } =
      req.body
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error('Missing Cloudinary credentials')
      // You might want to throw an error or use default values
    }
    console.log(process.env.CLOUDINARY_API_SECRET)

    // Validate required fields
    if (!title || !description || !category || !condition || !price) {
      res.status(400).json({
        message: 'Missing required fields',
        required: ['title', 'description', 'category', 'condition', 'price'],
      })
      return
    }

    if (price.amount < 0) {
      res.status(400).json({
        message: 'Price amount cannot be negative',
      })
      return
    }

    const seller = await User.findById(userId)

    console.log(seller, userId)
    if (!seller?.stripeConnectOnboardingComplete) {
      res.status(404).json({
        message: 'User is not a seller',
      })
      return
    }

    const imageUrls = req.files
      ? (req.files as Express.Multer.File[]).map(
          (file) => (file as any).path || (file as any).secure_url,
        )
      : []

    // Create new item
    const newItem = new Item({
      title,
      description,
      category,
      condition,
      price: {
        amount: price.amount,
      },
      seller: seller?._id || seller?.id,
      images: imageUrls || [],
      status: 'available',
      views: 0,
    })

    // Save the item
    await newItem.save()

    res.status(201).json({
      message: 'Item created successfully',
      data: newItem,
    })
  } catch (error) {
    console.error('Error creating item:', error)
    res.status(500).json({ message: 'Error creating item', error })
  }
}

export const updateItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params
    const updateData = req.body

    if (updateData.price && updateData.price.amount < 0) {
      res.status(400).json({
        message: 'Price amount cannot be negative',
      })
      return
    }

    const item = await Item.findById(id)

    if (!item) {
      res.status(404).json({ message: 'Item not found' })
      return
    }

    // Update the item
    Object.assign(item, updateData)
    await item.save()

    res.status(200).json({
      message: 'Item updated successfully',
      data: item,
    })
  } catch (error) {
    console.error('Error updating item:', error)
    res.status(500).json({ message: 'Error updating item', error })
  }
}

// Delete item
export const deleteItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params

    const item = await Item.findById(id)

    if (!item) {
      res.status(404).json({ message: 'Item not found' })
      return
    }

    await item.deleteOne()

    res.status(200).json({
      message: 'Item deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting item:', error)
    res.status(500).json({ message: 'Error deleting item', error })
  }
}

export const searchItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { q } = req.query

    if (!q) {
      res.status(400).json({ message: 'Search query is required' })
      return
    }

    const items = await Item.find(
      { $text: { $search: q as string } },
      { score: { $meta: 'textScore' } },
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)

    res.status(200).json({
      message: 'Search completed successfully',
      data: items,
    })
  } catch (error) {
    console.error('Error searching items:', error)
    res.status(500).json({ message: 'Error searching items', error })
  }
}

export const updateItemStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['available', 'sold', 'reserved'].includes(status)) {
      res.status(400).json({
        message: 'Invalid status',
        allowedValues: ['available', 'sold', 'reserved'],
      })
      return
    }

    const item = await Item.findById(id)

    if (!item) {
      res.status(404).json({ message: 'Item not found' })
      return
    }

    item.status = status
    await item.save()

    res.status(200).json({
      message: 'Item status updated successfully',
      data: item,
    })
  } catch (error) {
    console.error('Error updating item status:', error)
    res.status(500).json({ message: 'Error updating item status', error })
  }
}
