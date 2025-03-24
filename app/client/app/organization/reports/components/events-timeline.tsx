/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface EventsTimelineProps {
    data: any[];
    isLoading: boolean;
}

const EventsTimeline: React.FC<EventsTimelineProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return <Skeleton className="w-full h-80" />
    }

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                        yAxisId="left"
                        dataKey="eventsCreated"
                        name="Events Created"
                        fill="#8884d8"
                    />
                    <Bar
                        yAxisId="right"
                        dataKey="eventsSold"
                        name="Tickets Sold"
                        fill="#82ca9d"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default EventsTimeline