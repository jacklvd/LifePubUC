import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icon } from '@/components/icons'
import { Skeleton } from '@/components/ui/skeleton'
interface EventsSectionProps {
  events: Event[]
  isLoading: boolean
}

// Event Card Component
const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const statusMap = {
    draft: { label: 'Draft', className: 'bg-amber-100 text-amber-800' },
    'on sale': { label: 'Live', className: 'bg-green-100 text-green-800' },
  }

  const status = event.status || 'draft'
  const statusInfo = statusMap[status]
  const formattedDate = event.date
    ? format(new Date(event.date), 'MMM d, yyyy')
    : 'No date'
  const attendees =
    event.tickets?.reduce((sum, ticket) => sum + (ticket.sold || 0), 0) || 0

  return (
    <Card className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={event.media || '/api/placeholder/400/220'}
            alt={event.title}
            className="w-full h-44 object-cover"
            width={400}
            height={220}
          />
          <div
            className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
          >
            {statusInfo.label}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
            {event.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <Icon name="Calendar" className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Icon name="UserIcon" className="h-4 w-4 mr-1" />
            <span>{attendees} attendees</span>
          </div>
          <div className="flex justify-between mt-4">
            <Link href={`/organization/events/${event.eventId}/edit`} passHref>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <Link href={`/organization/events/${event.eventId}`} passHref>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton for Event Card
const EventCardSkeleton: React.FC = () => (
  <Card className="overflow-hidden border-gray-200">
    <CardContent className="p-0">
      <Skeleton className="w-full h-44" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3 mb-4" />
        <div className="flex justify-between mt-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
)

// Create Event Card
const CreateEventCard: React.FC = () => (
  <Link href="/organization/events/create" passHref>
    <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center h-full min-h-60 cursor-pointer">
      <CardContent className="p-6 text-center">
        <div className="rounded-full bg-gray-100 p-3 mx-auto mb-4 w-fit">
          <Icon name="Plus" className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-1">
          Create New Event
        </h3>
        <p className="text-sm text-gray-500">
          Add your next event to start selling tickets
        </p>
      </CardContent>
    </Card>
  </Link>
)

// Empty State Component
const EmptyState: React.FC = () => (
  <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400">
    <CardContent className="p-12 text-center">
      <div className="rounded-full bg-gray-100 p-4 mx-auto mb-4 w-fit">
        <Icon name="Calendar" className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">No Events Yet</h3>
      <p className="text-gray-500 mb-6">
        Create your first event to start selling tickets
      </p>
      <Link href="/organization/events/create" passHref>
        <Button>
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </Link>
    </CardContent>
  </Card>
)

// Main Component
const EventsSection: React.FC<EventsSectionProps> = ({ events, isLoading }) => {
  return (
    <div className="mb-8">
      <Tabs defaultValue="events" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="events">My Events</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Link href="/organization/events" passHref>
              <Button variant="ghost" size="sm">
                See All
              </Button>
            </Link>
          </div>
        </div>

        <TabsContent value="events" className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.eventId} event={event} />
              ))}
              <CreateEventCard />
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EventsSection
