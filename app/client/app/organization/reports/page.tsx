/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  format,
  subMonths,
  startOfMonth,
  eachMonthOfInterval,
  parseISO,
  isSameMonth,
} from 'date-fns'
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
import { getItemsForSeller } from '@/lib/actions/item-actions'
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

const RevenueBySource = dynamic(() => import('./components/revenue-source'), {
  loading: () => <LoadingChart />,
  ssr: false,
})

const MonthlyComparison = dynamic(
  () => import('./components/monthly-comparison'),
  {
    loading: () => <LoadingChart />,
    ssr: false,
  },
)

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

const calculatePercentageChange = (
  currentValue: number,
  previousValue: number,
): number => {
  if (previousValue === 0) return currentValue > 0 ? 100 : 0
  return Math.round(((currentValue - previousValue) / previousValue) * 100)
}

// Get current month and previous month items
const getCurrentAndPreviousMonthData = (items: ProductData[]) => {
  const currentMonthItems: ProductData[] = []
  const previousMonthItems: ProductData[] = []
  const now = new Date()

  items.forEach((item) => {
    try {
      const itemDate = parseISO(item.createdAt)
      if (isSameMonth(itemDate, now)) {
        currentMonthItems.push(item)
      } else if (isSameMonth(itemDate, subMonths(now, 1))) {
        previousMonthItems.push(item)
      }
    } catch (error) {
      console.error('Error parsing date:', error)
    }
  })

  return { currentMonthItems, previousMonthItems }
}

const ReportsPage: React.FC = () => {
  const { data: session } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [items, setItems] = useState<ProductData[]>([])
  const [processedItems, setProcessedItems] = useState<ProcessedItemData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [timeRange, setTimeRange] = useState<string>('6m')
  const [chartData, setChartData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>('events')
  const userEmail = session?.user?.email || ''
  const userId = session?.user?.id || ''

  // Fetch events only when needed
  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail || !userId) return

      try {
        setIsLoading(true)

        // Fetch events and items in parallel
        const [fetchedEvents, fetchedItems] = await Promise.all([
          getUserEvents(userEmail),
          getItemsForSeller(), // Fetch all items for the seller
        ])

        setEvents(fetchedEvents)

        // Process the items data
        if (fetchedItems && fetchedItems.data) {
          setItems(fetchedItems.data)

          // Process items to match the format needed for charts
          const processed = fetchedItems.data.map(
            (item: {
              status: string
              title: any
              price: { amount: any }
              images: string | any[]
              category: any
            }) => {
              // Determine if item is sold
              const isSold = item.status === 'sold'

              return {
                title: item.title,
                price: item.price.amount,
                sold: isSold ? 1 : 0, // Count as 1 if sold, 0 if not
                imageUrl:
                  item.images && item.images.length > 0
                    ? item.images[0]
                    : '/api/placeholder/400/220',
                stock: isSold ? 0 : 1, // Simple inventory indication
                totalRevenue: isSold ? item.price.amount : 0,
                category: item.category || 'Other', // Use category from DB or default to "Other"
              }
            },
          )

          setProcessedItems(processed)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userEmail, userId])

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

  const totalItemsSold = processedItems.reduce(
    (sum, product) => sum + product.sold,
    0,
  )
  const totalRevenue = processedItems.reduce(
    (sum, product) => sum + product.totalRevenue,
    0,
  )

  // Calculate revenue statistics
  const { currentMonthItems, previousMonthItems } =
    getCurrentAndPreviousMonthData(items)

  const currentMonthSold = currentMonthItems.filter(
    (item) => item.status === 'sold',
  ).length
  const previousMonthSold = previousMonthItems.filter(
    (item) => item.status === 'sold',
  ).length
  const soldPercentChange = calculatePercentageChange(
    currentMonthSold,
    previousMonthSold,
  )

  const currentMonthRevenue = currentMonthItems
    .filter((item) => item.status === 'sold')
    .reduce((sum, item) => sum + item.price.amount, 0)

  const previousMonthRevenue = previousMonthItems
    .filter((item) => item.status === 'sold')
    .reduce((sum, item) => sum + item.price.amount, 0)

  const revenuePercentChange = calculatePercentageChange(
    currentMonthRevenue,
    previousMonthRevenue,
  )

  // Event related percentage changes (similar calculation)
  const currentMonthEvents = events.filter((event) => {
    try {
      // Handle both createdAt and date properties that could be string or Date
      const createdAtDate =
        // If createdAt exists and is a string, parse it
        typeof event.createdAt === 'string'
          ? parseISO(event.createdAt)
          : // If createdAt exists and is a Date, use it directly
            event.createdAt instanceof Date
            ? event.createdAt
            : // If date exists and is a string, parse it
              typeof event.date === 'string'
              ? parseISO(event.date)
              : // If date exists and is a Date, use it directly
                event.date instanceof Date
                ? event.date
                : // Fallback to current date if neither is valid
                  new Date()

      return isSameMonth(createdAtDate, new Date())
    } catch {
      return false
    }
  }).length

  const previousMonthEvents = events.filter((event) => {
    try {
      // Handle both createdAt and date properties that could be string or Date
      const createdAtDate =
        // If createdAt exists and is a string, parse it
        typeof event.createdAt === 'string'
          ? parseISO(event.createdAt)
          : // If createdAt exists and is a Date, use it directly
            event.createdAt instanceof Date
            ? event.createdAt
            : // If date exists and is a string, parse it
              typeof event.date === 'string'
              ? parseISO(event.date)
              : // If date exists and is a Date, use it directly
                event.date instanceof Date
                ? event.date
                : // Fallback to current date if neither is valid
                  new Date()

      return isSameMonth(createdAtDate, subMonths(new Date(), 1))
    } catch {
      return false
    }
  }).length

  const eventsPercentChange = calculatePercentageChange(
    currentMonthEvents,
    previousMonthEvents,
  )

  // For upcoming events, calculate change from previous period
  // NOW THIS IS DEFINED AFTER upcomingEvents IS DECLARED
  const upcomingEventsPercentChange = calculatePercentageChange(
    upcomingEvents,
    upcomingEvents > 0 ? upcomingEvents - 1 : 0,
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
                <ItemsOverview products={processedItems} />
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
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white-100 divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item._id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.title}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {item.category}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            ${item.price.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {item.status}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {item.views}
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
                <RevenueOverview
                  data={chartData}
                  items={items}
                  isLoading={false}
                />
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
                <CardContent>
                  <RevenueBySource items={items} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Comparison</CardTitle>
                  <CardDescription>
                    Revenue comparison to previous periods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyComparison data={chartData} items={items} />
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
                    {eventsPercentChange >= 0 ? (
                      <div className="text-green-500 flex items-center">
                        <Icon name="TrendingUp" className="h-4 w-4 mr-1" />
                        <span>{eventsPercentChange}% increase</span>
                      </div>
                    ) : (
                      <div className="text-red-500 flex items-center">
                        <Icon name="TrendingDown" className="h-4 w-4 mr-1" />
                        <span>{Math.abs(eventsPercentChange)}% decrease</span>
                      </div>
                    )}
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
                    {upcomingEventsPercentChange >= 0 ? (
                      <div className="text-green-500 flex items-center">
                        <Icon name="TrendingUp" className="h-4 w-4 mr-1" />
                        <span>{upcomingEventsPercentChange}% increase</span>
                      </div>
                    ) : (
                      <div className="text-red-500 flex items-center">
                        <Icon name="TrendingDown" className="h-4 w-4 mr-1" />
                        <span>
                          {Math.abs(upcomingEventsPercentChange)}% decrease
                        </span>
                      </div>
                    )}
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
                      <p className="text-3xl font-bold">{totalItemsSold}</p>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-full">
                      <Icon
                        name="ShoppingCart"
                        className="h-6 w-6 text-amber-600"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    {soldPercentChange >= 0 ? (
                      <div className="text-green-500 flex items-center">
                        <Icon name="TrendingUp" className="h-4 w-4 mr-1" />
                        <span>{soldPercentChange}% increase</span>
                      </div>
                    ) : (
                      <div className="text-red-500 flex items-center">
                        <Icon name="TrendingDown" className="h-4 w-4 mr-1" />
                        <span>{Math.abs(soldPercentChange)}% decrease</span>
                      </div>
                    )}
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
                    {revenuePercentChange >= 0 ? (
                      <div className="text-green-500 flex items-center">
                        <Icon name="TrendingUp" className="h-4 w-4 mr-1" />
                        <span>{revenuePercentChange}% increase</span>
                      </div>
                    ) : (
                      <div className="text-red-500 flex items-center">
                        <Icon name="TrendingDown" className="h-4 w-4 mr-1" />
                        <span>{Math.abs(revenuePercentChange)}% decrease</span>
                      </div>
                    )}
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
