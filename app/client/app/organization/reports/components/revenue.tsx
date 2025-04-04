/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface RevenueOverviewProps {
  data: any[]
  isLoading: boolean
  // Can add optional real items data to process
  items?: Array<{
    _id: string
    status: string
    price: { amount: number }
    createdAt: string
  }>
}

const RevenueOverview: React.FC<RevenueOverviewProps> = ({
  data,
  isLoading,
  items = []
}) => {
  // Process real items data if available
  const revenueData = useMemo(() => {
    if (items.length === 0) {
      // If no real items data is provided, use the synthetic data
      return data
    }

    // Group items by month and calculate revenue
    const months: Record<string, number> = {}

    items.forEach(item => {
      if (item.status === 'sold') {
        const date = new Date(item.createdAt)
        const monthKey = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short'
        })

        if (!months[monthKey]) {
          months[monthKey] = 0
        }

        months[monthKey] += item.price.amount
      }
    })

    // Convert to array for chart
    return Object.entries(months)
      .map(([month, revenue]) => ({
        month,
        revenue
      }))
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.month)
        const dateB = new Date(b.month)
        return dateA.getTime() - dateB.getTime()
      })
  }, [data, items])

  if (isLoading) {
    return <Skeleton className="w-full h-80" />
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={revenueData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} tickMargin={10} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickMargin={10}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueOverview
