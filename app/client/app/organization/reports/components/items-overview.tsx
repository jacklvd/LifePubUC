import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface Product {
    title: string;
    price: number;
    sold: number;
    imageUrl: string;
    stock: number;
    totalRevenue: number;
    category: string;
}

interface ItemsOverviewProps {
    products: Product[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A267AC', '#6C5B7B'];

const ItemsOverview: React.FC<ItemsOverviewProps> = ({ products }) => {
    const categoryData = useMemo(() => {
        const categories: Record<string, number> = {};

        // Group products by category and sum their sales
        products.forEach(product => {
            const { category, sold } = product;
            if (categories[category]) {
                categories[category] += sold;
            } else {
                categories[category] = sold;
            }
        });

        // Convert to array format for chart
        return Object.entries(categories).map(([name, value]) => ({
            name,
            value
        }));
    }, [products]);

    // Handle case with no products
    if (products.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">No products to display</p>
            </div>
        )
    }

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
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} items sold`, 'Sales']} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ItemsOverview