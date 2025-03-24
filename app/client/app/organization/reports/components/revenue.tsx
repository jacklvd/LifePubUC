/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface RevenueOverviewProps {
    data: any[];
    isLoading: boolean;
}

const RevenueOverview: React.FC<RevenueOverviewProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return <Skeleton className="w-full h-80" />
    }

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
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