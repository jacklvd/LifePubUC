import { Request, Response } from 'express'
import Item from '../models/itemSchema'

export const getItemsForSeller = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { sellerId } = req.params

    if (!sellerId) {
      res.status(400).json({
        message: 'Error creating shit',
        data: {},
      })
      return
    }

    console.log(sellerId)
    const {
      status = 'all',
      sort = '-createdAt',
      page = 1,
      limit = 10,
    } = req.query as unknown as {
      status?: string
      sort?: string
      page?: number
      limit?: number
    }

    const query: any = { seller: sellerId }

    // Only filter by status if not 'all'
    if (status !== 'all') {
      query.status = status
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    const items = await Item.find(query).sort(sort).skip(skip).limit(limit)

    const total = await Item.countDocuments(query)

    const analytics = {
      totalActive: await Item.countDocuments({
        seller: sellerId,
        status: 'available',
      }),
      totalSold: await Item.countDocuments({
        seller: sellerId,
        status: 'sold',
      }),
      totalViews: await Item.aggregate([
        { $match: { seller: sellerId } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } },
      ]).then((result) => result[0]?.totalViews || 0),
    }

    res.status(200).json({
      message: 'Seller items retrieved successfully',
      data: items,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      analytics,
    })
  } catch (error) {
    console.error('Error fetching seller items:', error)
    res.status(500).json({ message: 'Error fetching seller items', error })
  }
}
