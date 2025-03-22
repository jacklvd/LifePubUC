'use client'
import React, { useState, useEffect } from 'react'
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
import EventCalendar from '@/components/event-ui/event-calendar'
import EventList from '@/components/event-ui/event-list'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/use-debouce'
import { getUserEvents, deleteEvent } from '@/lib/actions/event-action'
import { useSession } from 'next-auth/react'

// You'll need to get the user's email from your auth system
// This is just a placeholder - replace with your actual auth implementation

const EventsPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [filterValue, setFilterValue] = useState<'upcoming' | 'past' | 'draft' | 'all'>('upcoming')
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.email) return // Don't fetch if we don't have the user's email

      setIsLoading(true)
      try {
        // Get events for the current user
        let userEvents = await getUserEvents(user.email)

        // Filter events based on filterValue
        const today = new Date()
        switch (filterValue) {
          case 'upcoming':
            userEvents = userEvents.filter(event => new Date(String(event.date)) >= today)
            break
          case 'past':
            userEvents = userEvents.filter(event => new Date(String(event.date)) < today)
            break
          case 'draft':
            userEvents = userEvents.filter(event => event.status === 'draft')
            break
          // 'all' doesn't need filtering
        }

        // Filter events based on search query
        if (debouncedSearch.trim()) {
          const searchLower = debouncedSearch.toLowerCase()
          userEvents = userEvents.filter(event =>
            event.title.toLowerCase().includes(searchLower) ||
            event.summary.toLowerCase().includes(searchLower) ||
            event.location.toLowerCase().includes(searchLower)
          )
        }

        setEvents(userEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
        toast.error('Failed to fetch events')
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [filterValue, debouncedSearch, user?.email])

  // Delete event handler
  const handleDeleteEvent = async (eventId: string) => {
    try {
      // Call API to delete the event
      await deleteEvent(eventId)

      // Remove the event from state
      setEvents(events.filter(event => event._id !== eventId && event.eventId !== eventId))
      toast.success('Event deleted successfully')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold text-purple-950 mb-6">Events</h1>

      {/* Controls Row */}
      <div className="flex flex-col md:flex-row justify-between mb-10 gap-4">
        <div className="flex-1 md:max-w-xs">
          <div className="relative">
            <Icon
              name="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            />
            <Input
              placeholder="Search events"
              className="pl-10 bg-white-100 border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className={`rounded-l-md rounded-r-none px-4 ${viewMode === 'list'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'border-r-0'
                }`}
            >
              <Icon name="LayoutList" className="h-5 w-5 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
              className={`rounded-r-md rounded-l-none px-4 ${viewMode === 'calendar' ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
            >
              <Icon name="Calendar" className="h-5 w-5 mr-2" />
              Calendar
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-blue-600 text-white-100 hover:bg-blue-700 hover:text-white-100"
              >
                {filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}{' '}
                events
                <Icon name="ChevronDown" className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white-100">
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

          <Button
            className="bg-green-400 hover:bg-green-500 text-white-100"
            type="submit"
            onClick={() => router.push('/organization/events/create')}
          >
            Create Event
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        /* Calendar or List View */
        viewMode === 'calendar' ? (
          <EventCalendar events={events} />
        ) : (
          <EventList events={events} onDelete={handleDeleteEvent} />
        )
      )}
    </div>
  )
}

export default EventsPage