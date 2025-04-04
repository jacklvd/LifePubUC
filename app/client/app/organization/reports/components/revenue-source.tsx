import React, { useMemo } from 'react'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts'

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

interface RevenueBySourceProps {
    items: ItemData[]
}

const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#A267AC',
    '#6C5B7B',
]

const RevenueBySource: React.FC<RevenueBySourceProps> = ({ items }) => {
    const categoryData = useMemo(() => {
        // Only consider sold items for revenue
        const soldItems = items.filter(item => item.status === 'sold')

        if (soldItems.length === 0) {
            return [{
                name: 'No Sales',
                value: 1
            }]
        }

        const categories: Record<string, number> = {}

        // Group items by category and sum their revenue
        soldItems.forEach((item) => {
            const { category, price } = item
            if (categories[category]) {
                categories[category] += price.amount
            } else {
                categories[category] = price.amount
            }
        })

        // Convert to array format for chart
        return Object.entries(categories).map(([name, value]) => ({
            name,
            value,
        }))
    }, [items])

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                    >
                        {categoryData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default RevenueBySource