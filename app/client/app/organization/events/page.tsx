'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/icons'
import EventCalendar from '@/app/organization/events/components/event-calendar'
import EventList from '@/app/organization/events/components/event-list'
import { toast } from 'sonner'
import {
  getUserEvents,
  deleteEvent as apiDeleteEvent,
} from '@/lib/actions/event-actions'
import { useSession } from 'next-auth/react'
import useEventStore from '@/store/eventStore'
import useEventProcessing from '@/hooks/use-eventprocessing'

const EventsPage = () => {
  // Get session
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()

  // Get state from Zustand store
  const {
    viewMode,
    filterValue,
    searchQuery,
    setEvents,
    setIsLoading,
    setViewMode,
    setFilterValue,
    setSearchQuery,
  } = useEventStore()

  // Use the event processing hook for efficient filtering
  const { filteredEvents, isLoading, deleteEvent } = useEventProcessing(
    user?.email,
  )

  // Fetch events - only when user changes
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.email) return

      setIsLoading(true)

      try {
        // Fetch events from the server
        const events = await getUserEvents(user.email)

        // Update the store on the client side
        setEvents(events)
      } catch (error) {
        console.error('Error fetching events:', error)
        toast.error('Failed to fetch events')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [user?.email, setIsLoading, setEvents])

  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    const success = await deleteEvent(eventId, apiDeleteEvent)

    if (success) {
      toast.success('Event deleted successfully')
    } else {
      toast.error('Failed to delete event')
    }
  }

  return (
    <div className="container mx-auto max-w-6xl py-6 px-4 sm:py-8 mb-10">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-950 mb-4 sm:mb-6">
        Events
      </h1>

      {/* Controls Row - Optimized for mobile */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-10">
        {/* Search Box - Full width on mobile */}
        <div className="w-full">
          <div className="relative">
            <Icon
              name="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            />
            <Input
              placeholder="Search events"
              className="pl-10 bg-white-100 border-gray-300 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter controls - Wrapped properly for small screens */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* View toggle */}
          <div className="flex h-10">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className={`rounded-l-md rounded-r-none px-3 sm:px-4 ${viewMode === 'list'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'border-r-0'
                }`}
            >
              <Icon name="LayoutList" className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">List</span>
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
              className={`rounded-r-md rounded-l-none px-3 sm:px-4 ${viewMode === 'calendar' ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
            >
              <Icon name="Calendar" className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Calendar</span>
            </Button>
          </div>

          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-blue-600 text-white-100 hover:bg-blue-700 hover:text-white-100 h-10"
              >
                <span className="hidden sm:inline">
                  {filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}{' '}
                  events
                </span>
                <span className="sm:hidden">
                  {filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}
                </span>
                <Icon name="ChevronDown" className="ml-1 sm:ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white-100 overflow-auto">
              <DropdownMenuItem onClick={() => setFilterValue('upcoming')}>
                Upcoming events
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterValue('past')}>
                Past events
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterValue('draft')}>
                Draft events
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterValue('all')}>
                All events
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create button - Grows to fill space on mobile */}
          <Button
            className="bg-green-400 hover:bg-green-500 text-white-100 ml-auto h-10"
            onClick={() => router.push('/organization/events/create')}
          >
            <Icon name="Plus" className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Create Event</span>
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : /* Calendar or List View */
        viewMode === 'calendar' ? (
          <EventCalendar events={filteredEvents} />
        ) : (
          <EventList events={filteredEvents} onDelete={handleDeleteEvent} />
        )}
    </div>
  )
}

// Export a memoized version to prevent unnecessary re-renders
export default React.memo(EventsPage)
