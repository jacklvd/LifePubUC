/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface EventsOverviewProps {
  data: any[]
  isLoading: boolean
}

const EventsOverview: React.FC<EventsOverviewProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-80" />
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} tickMargin={10} />
          <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="eventsCreated"
            name="Events Created"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EventsOverview
