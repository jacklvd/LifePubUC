/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getUserEvents } from '@/lib/actions/event-actions'
import { getTransactionsTotalSales } from '@/lib/actions/transaction-actions'
import { getItemsForSeller } from '@/lib/actions/item-actions'
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
import { Button } from '@/components/ui/button'

const OrganizationHome: React.FC = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [recentProducts, setRecentProducts] = useState<ProductData[]>([])
  const [productStats, setProductStats] = useState({ count: 0, totalSales: 0 })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false)
  const [salesSummary, setSalesSummary] = useState<any>({})
  const username = session?.user?.name || 'User'
  const userEmail = session?.user?.email || ''

  useEffect(() => {
    const fetchData = async () => {
      if (userEmail && session?.user?.id) {
        try {
          setIsLoading(true)

          // Fetch events and products in parallel
          const [eventsResponse, productsResponse] = await Promise.all([
            getUserEvents(userEmail),
            getItemsForSeller({ limit: 3, sort: '-createdAt' })
          ])
          const saleSummary = await getTransactionsTotalSales()
          setSalesSummary(saleSummary)

          // Set events data
          setRecentEvents(eventsResponse.slice(0, 2))
          setAllEvents(eventsResponse)

          // Check if there's an onboarding error
          if (productsResponse.requiresOnboarding) {
            setNeedsOnboarding(true)
            setError("Please complete Stripe Connect onboarding to sell products")
          } else if (productsResponse.error) {
            setError(productsResponse.error)
          }

          // Set products data if available
          if (productsResponse.data) {
            setRecentProducts(productsResponse.data)

            // Calculate product stats
            const allProducts = productsResponse.data
            const soldProducts = allProducts.filter((p: { status: string }) => p.status === 'sold')
            const totalSales = soldProducts.reduce((sum: any, product: { price: { amount: any } }) => sum + product.price.amount, 0)

            setProductStats({
              count: allProducts.length,
              totalSales: totalSales
            })
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
  }, [userEmail, session?.user?.id])

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
    <>
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Onboarding Alert */}
          {needsOnboarding && (
            <Alert className="bg-amber-50 border-amber-200 mb-6">
              <AlertDescription className="text-amber-800 flex items-center justify-between">
                <span>To sell products, you need to complete Stripe Connect onboarding.</span>
                <Button
                  onClick={() => router.push('/organization/onboarding')}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Complete Onboarding
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && !needsOnboarding && (
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
          {!needsOnboarding ? (
            <ProductsSection initialProducts={recentProducts} />
          ) : (
            <div className="mb-8 p-6 border border-dashed border-amber-300 rounded-lg bg-amber-50">
              <h2 className="text-xl font-semibold text-amber-800 mb-3">Products Unavailable</h2>
              <p className="text-amber-700 mb-4">
                You need to complete Stripe Connect onboarding before you can sell products.
              </p>
              <Button
                onClick={() => router.push('/organization/onboarding')}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Complete Onboarding
              </Button>
            </div>
          )}

          {/* Industry Stats */}
          <IndustryStats />
        </div>
      </div>
    </>
  )
}

export default OrganizationHome
