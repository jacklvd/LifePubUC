/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { format, subMonths, parseISO, isSameMonth } from 'date-fns'

interface ItemData {
    _id: string
    title: string
    price: {
        amount: number
    }
    status: string
    category: string
    images: string[]
    views: number
    createdAt: string
}

interface MonthlyComparisonProps {
    data: any[]
    items?: ItemData[]
}

const MonthlyComparison: React.FC<MonthlyComparisonProps> = ({ data, items = [] }) => {
    const comparisonData = useMemo(() => {
        // If we have real items data, use it
        if (items.length > 0) {
            const soldItems = items.filter(item => item.status === 'sold')

            if (soldItems.length === 0) {
                return []
            }

            // Get current month and previous month
            const today = new Date()
            const currentMonth = format(today, 'MMM yyyy')
            const previousMonth = format(subMonths(today, 1), 'MMM yyyy')

            // Calculate revenue for current and previous month
            let currentMonthRevenue = 0
            let previousMonthRevenue = 0

            soldItems.forEach(item => {
                try {
                    const saleDate = parseISO(item.createdAt)
                    const currentMonthDate = new Date()
                    const previousMonthDate = subMonths(new Date(), 1)

                    if (isSameMonth(saleDate, currentMonthDate)) {
                        currentMonthRevenue += item.price.amount
                    } else if (isSameMonth(saleDate, previousMonthDate)) {
                        previousMonthRevenue += item.price.amount
                    }
                } catch (error) {
                    console.error('Error parsing date:', error)
                }
            })

            return [
                {
                    name: previousMonth,
                    revenue: previousMonthRevenue
                },
                {
                    name: currentMonth,
                    revenue: currentMonthRevenue
                }
            ]
        }

        // Otherwise use synthetic data
        if (data.length >= 2) {
            return data.slice(-2).map(item => ({
                name: item.month,
                revenue: item.revenue
            }))
        }

        return []
    }, [data, items])

    // If no data, show placeholder
    if (comparisonData.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">No sales data available for comparison</p>
            </div>
        )
    }

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={comparisonData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default MonthlyComparison