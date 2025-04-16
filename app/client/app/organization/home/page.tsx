/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getUserEvents } from '@/lib/actions/event-actions'
import { getTransactionsTotalSales } from '@/lib/actions/transaction-actions'
import { getItemsForSeller } from '@/lib/actions/item-actions'
import { useOnboarding } from '@/context/onboarding'
import {
  WelcomeHeader,
  StatsOverview,
  ActionButtons,
  EventsSection,
  ProductsSection,
  IndustryStats,
} from './components'
import Skeleton from 'react-loading-skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

const OrganizationHome: React.FC = () => {
  const { data: session } = useSession()
  const { isOnboarded } = useOnboarding()
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [recentProducts, setRecentProducts] = useState<ProductData[]>([])
  const [productStats, setProductStats] = useState({ count: 0, totalSales: 0 })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [salesSummary, setSalesSummary] = useState<any>({})
  const username = session?.user?.name || 'User'
  const userEmail = session?.user?.email || ''

  useEffect(() => {
    const fetchData = async () => {
      if (userEmail && session?.user?.id) {
        try {
          setIsLoading(true)

          // Fetch events
          const eventsResponse = await getUserEvents(userEmail)

          // Set events data
          setRecentEvents(eventsResponse.slice(0, 2))
          setAllEvents(eventsResponse)

          // Since the user has completed onboarding to reach this page,
          // we can safely fetch products and transactions
          try {
            // Fetch products and sales data
            const [productsResponse, saleSummary] = await Promise.all([
              getItemsForSeller({ limit: 3, sort: '-createdAt' }),
              getTransactionsTotalSales(),
            ])

            setSalesSummary(saleSummary)

            // Set products data if available
            if (productsResponse.data) {
              setRecentProducts(productsResponse.data)

              // Calculate product stats
              const allProducts = productsResponse.data
              const soldProducts = allProducts.filter(
                (p: { status: string }) => p.status === 'sold',
              )
              const totalSales = soldProducts.reduce(
                (sum: any, product: { price: { amount: any } }) =>
                  sum + product.price.amount,
                0,
              )

              setProductStats({
                count: allProducts.length,
                totalSales: totalSales,
              })
            }
          } catch (err) {
            console.error('Error fetching product data:', err)
            // Don't show error for product/sales data, continue showing events
          }
        } catch (error: any) {
          console.error('Error fetching data:', error)
          setError('Failed to load dashboard data')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [userEmail, session?.user?.id, isOnboarded])

  if (isLoading) {
    return (
      <div className="flex-1 justify-center items-center">
        <Skeleton count={5} className="w-full h-12 mb-4" />
        <Skeleton count={3} className="w-full h-12 mb-4" />
        <Skeleton count={2} className="w-full h-12 mb-4" />
        <Skeleton count={1} className="w-full h-12 mb-4" />
      </div>
    )
  }

  return (
    // <ProtectedRoute requireOnboarding={isOnboarded}>
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Error Alert */}
        {error && (
          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Header */}
        <WelcomeHeader username={username} />

        {/* Stats Overview */}
        <StatsOverview
          events={allEvents}
          productCount={productStats.count}
          totalSales={salesSummary?.totalSales || productStats.totalSales}
        />

        {/* Action Buttons */}
        <ActionButtons />

        {/* Events Section */}
        <EventsSection events={recentEvents} isLoading={isLoading} />

        {/* Products Section */}
        <ProductsSection initialProducts={recentProducts} />

        {/* Industry Stats */}
        <IndustryStats />
      </div>
    </div>
    // </ProtectedRoute>
  )
}

export default OrganizationHome
