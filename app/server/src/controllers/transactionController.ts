import { Request, Response } from 'express'
import Transaction from '../models/transactionSchema'
import User from '../models/userSchema'

import mongoose from 'mongoose'

export const getSalesSummaryByType = async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params

    // Count total number of sales by this seller
    const totalSalesCount = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $unwind: '$items' },
      { $match: { 'items.sellerId': new mongoose.Types.ObjectId(sellerId) } },
      { $count: 'totalCount' },
    ])

    // Get total revenue by this seller
    const totalSalesRevenue = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $unwind: '$items' },
      { $match: { 'items.sellerId': new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$items.total' },
        },
      },
      {
        $project: {
          totalRevenue: 1,
          _id: 0,
        },
      },
    ])

    // Get sales breakdown by type for this seller
    const salesByType = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $unwind: '$items' },
      { $match: { 'items.sellerId': sellerId } },
      {
        $group: {
          _id: '$items.type',
          count: { $count: {} },
          revenue: { $sum: '$items.total' },
        },
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ])

    // Extract values or use defaults
    const totalCount = totalSalesCount[0]?.totalCount || 0
    const revenue = totalSalesRevenue[0]?.totalRevenue || 0

    res.status(200).json({
      message: 'Sales summary retrieved successfully',
      data: {
        salesByType,
        totalCount,
        totalRevenue: revenue,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve sales summary' })
    console.log('Get sales summary failed: ', error)
    return
  }
}
