import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import EventCard from './event-card'
import { toast } from 'sonner'

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
  searchQuery: string
  onSearch: (query: string) => void
}

const EventGrid: React.FC<EventGridProps> = ({
  events,
  loading,
  savedEvents,
  toggleSaveEvent,
  fetchEvents,
  hasMoreEvents,
  handleLoadMore,
  searchQuery,
  onSearch,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(localSearchQuery)
  }

  // Reset search function
  const handleResetSearch = () => {
    setLocalSearchQuery('')
    onSearch('')
    fetchEvents()
    toast.success('Search reset successfully')
  }

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">Discover Events</h2>

        {/* Search bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-3 md:mt-0 w-full md:w-auto"
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Search events..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 text-xs"
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Event Grid with Loading States */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Skeleton loading state
          Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden h-full"
            >
              <Skeleton className="w-full h-40" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </div>
            </div>
          ))
        ) : events && events.length > 0 ? (
          events.map((event, index) => (
            <EventCard
              key={event.eventId || index}
              event={event}
              isSaved={savedEvents.includes(event.eventId)}
              onToggleSave={toggleSaveEvent}
            />
          ))
        ) : (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 py-12 text-center">
            <div className="mb-4 text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-2" />
            </div>
            <h3 className="text-lg font-medium mb-1">No events found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? `No events match "${searchQuery}"`
                : 'Try adjusting your search or location'}
            </p>
            {searchQuery && (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleResetSearch}
              >
                Reset search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Load more button */}
      {events && events.length > 0 && hasMoreEvents && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50 px-6"
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
