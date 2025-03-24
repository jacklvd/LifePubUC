import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface EventsByStatusProps {
  draft: number
  live: number
  isLoading: boolean
}

const COLORS = ['#FFBB28', '#00C49F']

const EventsByStatus: React.FC<EventsByStatusProps> = ({
  draft,
  live,
  isLoading,
}) => {
  const data = [
    { name: 'Draft', value: draft },
    { name: 'Live', value: live },
  ]

  if (isLoading) {
    return <Skeleton className="w-full h-80" />
  }

  // Handle case with no events
  if (draft === 0 && live === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-gray-500">No events to display</p>
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} events`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EventsByStatus
