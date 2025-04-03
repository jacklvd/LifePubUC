'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getUserEvents } from '@/lib/actions/event-actions'
import {
  WelcomeHeader,
  StatsOverview,
  ActionButtons,
  EventsSection,
  ProductsSection,
  IndustryStats,
} from './components'
import Skeleton from 'react-loading-skeleton'
import { getTransactionsTotalSales } from '@/lib/actions/transaction-actions'

interface ProductData {
  title: string
  price: number
  sold: number
  imageUrl: string
  stock: number
}

const recentProducts: ProductData[] = [
  {
    title: 'Event Logo T-Shirt',
    price: 24.99,
    sold: 37,
    imageUrl: '/api/placeholder/400/220',
    stock: 120,
  },
  {
    title: 'VIP Experience Package',
    price: 99.99,
    sold: 12,
    imageUrl: '/api/placeholder/400/220',
    stock: 25,
  },
]

const OrganizationHome: React.FC = () => {
  const { data: session } = useSession()
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [salesSummary, setSalesSummary] = useState<any>({})
  const username = session?.user?.name || 'User'
  const userEmail = session?.user?.email || ''

  useEffect(() => {
    const fetchEvents = async () => {
      if (userEmail) {
        try {
          setIsLoading(true)

          const events = await getUserEvents(userEmail)
          const saleSummary = await getTransactionsTotalSales()

          setSalesSummary(saleSummary.data)

          setRecentEvents(events.slice(0, 2))

          setAllEvents(events)
        } catch (error) {
          console.error('Error fetching events:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchEvents()
  }, [userEmail])

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
          {/* Welcome Header */}
          <WelcomeHeader username={username} />

          {/* Stats Overview */}
          <StatsOverview events={allEvents} salesSummary={salesSummary} />

          {/* Action Buttons */}
          <ActionButtons />

          {/* Events Section */}
          <EventsSection events={recentEvents} isLoading={isLoading} />

          {/* Products Section */}
          <ProductsSection products={recentProducts} />

          {/* Industry Stats */}
          <IndustryStats />
        </div>
      </div>
    </>
  )
}

export default OrganizationHome
