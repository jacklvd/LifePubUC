/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useEffect } from 'react'
import { eventsTemp, landingPageIcons, eventTabs } from '@/constants'
// import SearchBar from './components/search-bar'
import FeaturedCarousel from './components/carousel'
import CategoryIcons from './components/category-icons'
import LocationSelector from './components/locations'
import EventTabs from './components/event-tabs'
import EventGrid from './components/event-grid'
import PopularCategories from './components/popular'
import UpcomingTimeline from './components/upcoming'
import Newsletter from './components/newletter'
import CreatorCTA from './components/creatorcta'
import { getAllEvents } from '@/lib/actions/event-actions'

import ShopMakerCommunities from '@/components/shop-maker'

const LandingPage = () => {
  // Updated state with proper types
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<number>(1) // "For you" tab active by default
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [hasMoreEvents, setHasMoreEvents] = useState<boolean>(false)
  const [location, setLocation] = useState<string>('Cincinnati')
  const [sortOption, setSortOption] = useState<string>('newest')
  const [savedEvents, setSavedEvents] = useState<string[]>([])

  // Fetch events based on active tab and filters
  useEffect(() => {
    fetchEvents()
  }, [activeTab, activeCategory, location, sortOption])

  // Function to fetch events from API
  const fetchEvents = async (): Promise<void> => {
    setLoading(true)
    try {
      // Create params object that matches GetAllEventsParams
      const params: GetAllEventsParams = {
        limit: 8,
        sort: sortOption as 'newest' | 'oldest' | 'price-low' | 'price-high',
        location: location
      }

      if (activeCategory !== null) {
        params.category = landingPageIcons[activeCategory].title.toLowerCase()
      }

      // Handle different tabs
      if (eventTabs[activeTab] === 'Today') {
        params.date = 'today'
      } else if (eventTabs[activeTab] === 'This weekend') {
        params.date = 'weekend'
      } else if (eventTabs[activeTab] === 'For you') {
        // For "For you" tab, you might want to add a special parameter
        params.status = 'on sale' // Adjust according to your API
      }

      // Use getAllEvents for all queries
      const fetchedEvents = await getAllEvents(params)
      setEvents(fetchedEvents)
      setHasMoreEvents(fetchedEvents.length >= 8)
      setLoading(false)

      // For demo purposes only - using mock data
      // Comment this out when you have real API integration
      setTimeout(() => {
        // Type assertion to ensure temp data matches your Event type
        const tempEventsTyped = eventsTemp as unknown as Event[]
        setEvents(tempEventsTyped)
        setHasMoreEvents(true)
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error('Error fetching events:', error)
      // Type assertion for fallback
      const tempEventsTyped = eventsTemp as unknown as Event[]
      setEvents(tempEventsTyped)
      setLoading(false)
    }
  }

  const handleLoadMore = async (): Promise<void> => {
    setLoading(true)
    try {
      // For real implementation, pass an offset/page parameter
      const params: GetAllEventsParams = {
        limit: 8,
        sort: sortOption as 'newest' | 'oldest' | 'price-low' | 'price-high',
        location: location
      }

      if (activeCategory !== null) {
        params.category = landingPageIcons[activeCategory].title.toLowerCase()
      }

      // You would also add an offset/page parameter here
      const moreEvents = await getAllEvents(params)
      setEvents([...events, ...moreEvents])
      setLoading(false)

      // For demo, add more mock events
      setTimeout(() => {
        const tempEventsTyped = eventsTemp as unknown as Event[]
        setEvents([...events, ...tempEventsTyped])
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error('Error loading more events:', error)
      setLoading(false)
    }
  }

  const toggleSaveEvent = (eventId: string): void => {
    if (savedEvents.includes(eventId)) {
      setSavedEvents(savedEvents.filter(id => id !== eventId))
    } else {
      setSavedEvents([...savedEvents, eventId])
    }
    // In a real app, you would also sync this with the backend/database
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      <FeaturedCarousel />

      <CategoryIcons
        icons={landingPageIcons}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <LocationSelector
        location={location}
        setLocation={setLocation}
        locations={['Cincinnati', 'New York', 'Los Angeles', 'Chicago', 'Miami']}
      />

      <EventTabs
        tabs={eventTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <EventGrid
        events={events}
        loading={loading}
        activeTab={activeTab}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        savedEvents={savedEvents}
        toggleSaveEvent={toggleSaveEvent}
        fetchEvents={fetchEvents}
        hasMoreEvents={hasMoreEvents}
        handleLoadMore={handleLoadMore}
        searchQuery={searchQuery}
      />

      <PopularCategories
        setActiveCategory={setActiveCategory}
        setActiveTab={setActiveTab}
      />

      <UpcomingTimeline
        location={location}
      />

      <Newsletter />

      <CreatorCTA />

      <ShopMakerCommunities />
    </div>
  )
}

export default LandingPage
