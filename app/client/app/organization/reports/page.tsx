/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { format, subMonths, startOfMonth, eachMonthOfInterval } from 'date-fns'
import dynamic from 'next/dynamic'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUserEvents } from '@/lib/actions/event-actions'
import { Icon } from '@/components/icons'

// Lazy load chart components
const EventsOverview = dynamic(() => import('./components/events-overview'), {
  loading: () => <LoadingChart />,
  ssr: false, // Disable server-side rendering to reduce initial bundle size
})

const EventsByStatus = dynamic(() => import('./components/events-status'), {
  loading: () => <LoadingChart />,
  ssr: false,
})

const EventsTimeline = dynamic(() => import('./components/events-timeline'), {
  loading: () => <LoadingChart />,
  ssr: false,
})

const ItemsOverview = dynamic(() => import('./components/items-overview'), {
  loading: () => <LoadingChart />,
  ssr: false,
})

const RevenueOverview = dynamic(() => import('./components/revenue'), {
  loading: () => <LoadingChart />,
  ssr: false,
})

// Custom loading component with animation
const LoadingChart: React.FC = () => (
  <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-md animate-pulse">
    <div className="flex flex-col items-center space-y-2">
      <Icon name="BarChart" className="h-8 w-8 text-gray-300 animate-bounce" />
      <p className="text-gray-500">Loading chart data...</p>
    </div>
  </div>
)

// Loading summary card
const LoadingSummaryCard: React.FC = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="animate-pulse flex items-center justify-between">
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-16 bg-gray-300 rounded"></div>
        </div>
        <div className="p-2 bg-gray-200 rounded-full h-10 w-10"></div>
      </div>
      <div className="mt-4 animate-pulse">
        <div className="h-4 w-36 bg-gray-200 rounded"></div>
      </div>
    </CardContent>
  </Card>
)

// Mock data for products
const mockProducts = [
  {
    title: 'Event Logo T-Shirt',
    price: 24.99,
    sold: 37,
    imageUrl: '/api/placeholder/400/220',
    stock: 120,
    totalRevenue: 924.63,
    category: 'Apparel',
  },
  {
    title: 'VIP Experience Package',
    price: 99.99,
    sold: 12,
    imageUrl: '/api/placeholder/400/220',
    stock: 25,
    totalRevenue: 1199.88,
    category: 'Experience',
  },
  {
    title: 'Commemorative Poster',
    price: 19.99,
    sold: 28,
    imageUrl: '/api/placeholder/400/220',
    stock: 72,
    totalRevenue: 559.72,
    category: 'Merchandise',
  },
  {
    title: 'Digital Album Download',
    price: 12.99,
    sold: 65,
    imageUrl: '/api/placeholder/400/220',
    stock: Infinity,
    totalRevenue: 844.35,
    category: 'Digital',
  },
]

// Interface for time period options
interface TimeRange {
  label: string
  value: string
  months: number
}

// Time period options for filtering
const timeRanges: TimeRange[] = [
  { label: 'Last 30 Days', value: '30d', months: 1 },
  { label: 'Last 3 Months', value: '3m', months: 3 },
  { label: 'Last 6 Months', value: '6m', months: 6 },
  { label: 'Last 12 Months', value: '12m', months: 12 },
  { label: 'All Time', value: 'all', months: 36 },
]

// Generate monthly data - memoized to prevent recreating on every render
const generateMonthlyData = (months: number) => {
  const now = new Date()
  const result = []

  // Get all months in the range
  const monthsArray = eachMonthOfInterval({
    start: subMonths(startOfMonth(now), months - 1),
    end: startOfMonth(now),
  })

  for (let i = 0; i < monthsArray.length; i++) {
    const month = monthsArray[i]
    const monthLabel = format(month, 'MMM yyyy')

    // Generate some random but reasonable data
    const eventsCreated = Math.floor(Math.random() * 5) + 1 // 1-5 events per month
    const eventsSold = Math.floor(Math.random() * eventsCreated * 50) + 10 // 10-?? tickets sold
    const revenue = eventsSold * (Math.random() * 50 + 20) // $20-70 per ticket average

    result.push({
      month: monthLabel,
      eventsCreated,
      eventsSold,
      revenue: Math.round(revenue),
    })
  }

  return result
}

const ReportsPage: React.FC = () => {
  const { data: session } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [timeRange, setTimeRange] = useState<string>('6m')
  const [chartData, setChartData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>('events')
  const userEmail = session?.user?.email || ''

  // Fetch events only when needed
  useEffect(() => {
    const fetchEvents = async () => {
      if (!userEmail) return

      try {
        setIsLoading(true)
        const fetchedEvents = await getUserEvents(userEmail)
        setEvents(fetchedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [userEmail])

  // Generate chart data only when time range changes
  useEffect(() => {
    // Find the selected time range
    const selectedRange =
      timeRanges.find((r) => r.value === timeRange) || timeRanges[2]

    // Generate chart data for the selected range (using a web worker would be better)
    // Using setTimeout to prevent blocking the main thread with data generation
    const timer = setTimeout(() => {
      const data = generateMonthlyData(selectedRange.months)
      setChartData(data)
    }, 0)

    return () => clearTimeout(timer)
  }, [timeRange])

  // Lazy compute statistics based on events
  const totalEvents = events.length

  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate > new Date() && event.status === 'on sale'
  }).length

  const draftEvents = events.filter((event) => event.status === 'draft').length
  const liveEvents = events.filter((event) => event.status === 'on sale').length

  // Calculate revenue data from mock products
  // const totalProducts = mockProducts.length
  const totalProductsSold = mockProducts.reduce(
    (sum, product) => sum + product.sold,
    0,
  )
  const totalRevenue = mockProducts.reduce(
    (sum, product) => sum + product.totalRevenue,
    0,
  )

  // Only render the active tab content
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <LoadingChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <LoadingChart />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingChart />
            </CardContent>
          </Card>
        </>
      )
    }

    switch (activeTab) {
      case 'events':
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Events Overview Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Events Overview</CardTitle>
                  <CardDescription>
                    Number of events created over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EventsOverview data={chartData} isLoading={false} />
                </CardContent>
              </Card>

              {/* Events by Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Events by Status</CardTitle>
                  <CardDescription>
                    Distribution of your events by status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EventsByStatus
                    draft={draftEvents}
                    live={liveEvents}
                    isLoading={false}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Events Timeline */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Events Timeline</CardTitle>
                <CardDescription>
                  Monthly breakdown of your events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventsTimeline data={chartData} isLoading={false} />
              </CardContent>
            </Card>
          </>
        )

      case 'items':
        return (
          <>
            {/* Items Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Items Overview</CardTitle>
                <CardDescription>
                  Sales breakdown by product category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItemsOverview products={mockProducts} />
              </CardContent>
            </Card>

            {/* Product Performance Table */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>
                  Detailed breakdown of product sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sold
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          In Stock
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white-100 divide-y divide-gray-200">
                      {mockProducts.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.title}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product.category}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product.sold}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            ${product.totalRevenue.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product.stock === Infinity
                              ? 'Unlimited'
                              : product.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )

      case 'revenue':
        return (
          <>
            {/* Revenue Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Total revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueOverview data={chartData} isLoading={false} />
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Source</CardTitle>
                  <CardDescription>
                    Breakdown of revenue sources
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Revenue Breakdown Chart</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Comparison</CardTitle>
                  <CardDescription>
                    Revenue comparison to previous periods
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Monthly Comparison Chart</p>
                </CardContent>
              </Card>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Analytics Dashboard
          </h1>
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Time Period:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent className="bg-white-100">
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            <>
              <LoadingSummaryCard />
              <LoadingSummaryCard />
              <LoadingSummaryCard />
              <LoadingSummaryCard />
            </>
          ) : (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Events
                      </p>
                      <p className="text-3xl font-bold">{totalEvents}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Icon name="Calendar" className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <div className="text-green-500 flex items-center">
                      <Icon name="TrendingUp" className="h-4 w-4 mr-1" />
                      <span>12% increase</span>
                    </div>
                    <span className="text-gray-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Upcoming Events
                      </p>
                      <p className="text-3xl font-bold">{upcomingEvents}</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Icon name="Clock" className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <div className="text-green-500 flex items-center">
                      <Icon name="TrendingUp" className="h-4 w-4 mr-1" />
                      <span>5% increase</span>
                    </div>
                    <span className="text-gray-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Products Sold
                      </p>
                      <p className="text-3xl font-bold">{totalProductsSold}</p>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-full">
                      <Icon
                        name="ShoppingCart"
                        className="h-6 w-6 text-amber-600"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <div className="text-green-500 flex items-center">
                      <Icon name="TrendingUp" className="h-4 w-4 mr-1" />
                      <span>18% increase</span>
                    </div>
                    <span className="text-gray-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Revenue
                      </p>
                      <p className="text-3xl font-bold">
                        ${totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <Icon
                        name="DollarSign"
                        className="h-6 w-6 text-green-600"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <div className="text-green-500 flex items-center">
                      <Icon name="TrendingUp" className="h-4 w-4 mr-1" />
                      <span>24% increase</span>
                    </div>
                    <span className="text-gray-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <Tabs
          defaultValue="events"
          className="w-full mb-8"
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          {/* Render only the content for the active tab */}
          {renderTabContent()}
        </Tabs>
      </div>
    </div>
  )
}

export default ReportsPage
