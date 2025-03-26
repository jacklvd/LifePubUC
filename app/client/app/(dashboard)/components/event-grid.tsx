import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from 'lucide-react'
import EventCard from './event-card'
import { landingPageIcons, eventTabs } from '@/constants'

interface EventGridProps {
  events: Event[]
  loading: boolean
  activeTab: number
  activeCategory: number | null
  setActiveCategory: (index: number | null) => void
  savedEvents: string[]
  toggleSaveEvent: (id: string) => void
  fetchEvents: () => void
  hasMoreEvents: boolean
  handleLoadMore: () => void
  searchQuery?: string
}

const EventGrid: React.FC<EventGridProps> = ({
  events,
  loading,
  activeTab,
  activeCategory,
  setActiveCategory,
  savedEvents,
  toggleSaveEvent,
  fetchEvents,
  hasMoreEvents,
  handleLoadMore,
  searchQuery,
}) => {
  // Filter events by search query if needed
  const filteredEvents = searchQuery
    ? events.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : events

  return (
    <div className="mb-12">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center">
        <span className="mr-2">🎭</span>{' '}
        {eventTabs[activeTab] === 'For you'
          ? 'Our top picks for you'
          : `${eventTabs[activeTab]} events`}
        {activeCategory !== null && (
          <Badge
            className="ml-3 bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
            onClick={() => setActiveCategory(null)}
          >
            {landingPageIcons[activeCategory].title} ×
          </Badge>
        )}
      </h2>

      {/* Event Grid with Loading States */}
      <div className="flex flex-wrap -mx-2">
        {loading ? (
          // Skeleton loading state
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <div className="border rounded-lg overflow-hidden h-full">
                <Skeleton className="w-full h-40" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/4 mt-2" />
                </div>
              </div>
            </div>
          ))
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-6">
              <EventCard
                event={event}
                isSaved={savedEvents.includes(event.eventId)}
                onToggleSave={toggleSaveEvent}
              />
            </div>
          ))
        ) : (
          <div className="w-full py-12 text-center">
            <div className="mb-4 text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-2" />
            </div>
            <h3 className="text-lg font-medium mb-1">No events found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setActiveCategory(null)
                fetchEvents()
              }}
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>

      {/* Load more button */}
      {filteredEvents.length > 0 && hasMoreEvents && (
        <div className="text-center mt-8">
          <Button
            className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 px-6"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load more events'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default EventGrid
