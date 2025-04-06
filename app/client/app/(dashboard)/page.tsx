'use client'

import React, { useState, useEffect } from 'react'
import { getAllEvents, getEventsByTimeframe } from '@/lib/actions/event-actions'
import { toast } from 'sonner'
import EventGrid from './components/event-grid'
import UpcomingTimeline from './components/upcoming'
import Newsletter from './components/newletter'
import CreatorCTA from './components/creatorcta'
import ShopMakerCommunities from '@/components/shop-maker'
import EventCarousel from './components/carousel'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Calendar } from 'lucide-react'

const LandingPage = () => {
  // State with proper types
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [hasMoreEvents, setHasMoreEvents] = useState<boolean>(false)
  const [dateFilter, setDateFilter] = useState<
    'all' | 'today' | 'this-week' | 'this-month' | 'upcoming'
  >('all')
  const [savedEvents, setSavedEvents] = useState<string[]>([])
  const [page, setPage] = useState<number>(1)
  const [upcomingEvents, setUpcomingEvents] = useState<{
    today: Event[]
    tomorrow: Event[]
    weekend: Event[]
    nextWeek: Event[]
  }>({
    today: [],
    tomorrow: [],
    weekend: [],
    nextWeek: [],
  })

  // Date filter options - simplified to 4 options plus default
  const dateFilterOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'upcoming', label: 'Future Events' },
  ]

  // Fetch events based on date filter
  useEffect(() => {
    fetchEvents()
  }, [dateFilter])

  // Fetch upcoming events for different timeframes
  useEffect(() => {
    fetchUpcomingEvents()
  }, [])

  // Function to fetch upcoming events for different timeframes
  const fetchUpcomingEvents = async (): Promise<void> => {
    try {
      // Reset state
      setUpcomingEvents({
        today: [],
        tomorrow: [],
        weekend: [],
        nextWeek: [],
      })

      // Fetch events for each timeframe
      const [todayEvents, tomorrowEvents, weekendEvents, nextWeekEvents] =
        await Promise.all([
          getEventsByTimeframe('today', 4),
          getEventsByTimeframe('tomorrow', 4),
          getEventsByTimeframe('weekend', 4),
          getEventsByTimeframe('next-week', 4),
        ])

      // Update state with fetched events
      setUpcomingEvents({
        today: todayEvents || [],
        tomorrow: tomorrowEvents || [],
        weekend: weekendEvents || [],
        nextWeek: nextWeekEvents || [],
      })
    } catch (error) {
      console.error('Error fetching upcoming events:', error)
      toast.error("Couldn't fetch upcoming events. Please try again later.")
    }
  }

  // Function to fetch events from API
  const fetchEvents = async (): Promise<void> => {
    setLoading(true)
    try {
      // Reset page when filters change
      setPage(1)

      // Create params object
      const params: GetAllEventsParams = {
        limit: dateFilter === 'all' ? 10 : 12,
      }

      // Add date filter if not "all"
      if (dateFilter !== 'all') {
        params.dateFilter = dateFilter
      }

      if (searchQuery) {
        params.search = searchQuery
      }

      // Use getAllEvents for all queries
      const fetchedEvents = await getAllEvents(params)

      // Update state with fetched events
      setEvents(fetchedEvents || [])
      setHasMoreEvents(
        (fetchedEvents?.length || 0) >= (dateFilter === 'all' ? 10 : 12),
      )
      setLoading(false)
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([])
      setLoading(false)
      toast.error("Couldn't fetch events. Please try again later.")
    }
  }

  const handleLoadMore = async (): Promise<void> => {
    setLoading(true)
    try {
      const nextPage = page + 1

      // Create params object
      const params: GetAllEventsParams = {
        limit: dateFilter === 'all' ? 10 : 12,
        page: nextPage,
      }

      // Add date filter if not "all"
      if (dateFilter !== 'all') {
        params.dateFilter = dateFilter
      }

      if (searchQuery) {
        params.search = searchQuery
      }

      const moreEvents = await getAllEvents(params)

      if (moreEvents && moreEvents.length > 0) {
        setEvents((prevEvents) => [...prevEvents, ...moreEvents])
        setPage(nextPage)
        setHasMoreEvents(moreEvents.length >= (dateFilter === 'all' ? 10 : 12))
      } else {
        setHasMoreEvents(false)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading more events:', error)
      setLoading(false)
      toast.error("Couldn't load more events. Please try again later.")
    }
  }

  const toggleSaveEvent = (eventId: string): void => {
    setSavedEvents((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId)
      } else {
        return [...prev, eventId]
      }
    })
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchEvents()
  }

  // Handle date filter change
  const handleDateFilterChange = (value: string) => {
    setDateFilter(
      value as 'all' | 'today' | 'this-week' | 'this-month' | 'upcoming',
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <EventCarousel />

      {/* Date Filter Selector */}
      <div className="flex items-center mb-8">
        <h2 className="text-base md:text-lg font-medium">
          Browse events by date
        </h2>
        <div className="ml-2 relative min-w-[200px]">
          <Select value={dateFilter} onValueChange={handleDateFilterChange}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  {dateFilterOptions.find(
                    (option) => option.value === dateFilter,
                  )?.label || 'All Events'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white-100">
              {dateFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Event Grid */}
      <EventGrid
        events={events}
        loading={loading}
        activeTab={0}
        activeCategory={null}
        setActiveCategory={() => {}}
        savedEvents={savedEvents}
        toggleSaveEvent={toggleSaveEvent}
        fetchEvents={fetchEvents}
        hasMoreEvents={hasMoreEvents}
        handleLoadMore={handleLoadMore}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      {/* Upcoming Events Timeline */}
      <UpcomingTimeline upcomingEvents={upcomingEvents} />

      <CreatorCTA />

      <ShopMakerCommunities />

      <Newsletter />
    </div>
  )
}

export default LandingPage
