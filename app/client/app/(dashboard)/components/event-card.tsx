import React from 'react'
import Image from 'next/image'
import { Calendar, Clock, MapPin, Heart } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EventCardProps {
  event: Event
  isSaved: boolean
  onToggleSave: (id: string) => void
}

const EventCard: React.FC<EventCardProps> = ({ event, isSaved, onToggleSave }) => {
  // Format date to display in readable format
  const formatDate = (dateString: string | Date): string => {
    if (!dateString) return 'TBD'

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'TBD'

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  // Format time to AM/PM
  const formatTime = (time: string): string => {
    if (!time) return 'TBD'

    // If already in AM/PM format, return as is
    if (time.includes('AM') || time.includes('PM')) {
      return time
    }

    try {
      const [hours, minutes] = time.split(':').map(num => parseInt(num, 10))

      if (isNaN(hours) || isNaN(minutes)) {
        return time
      }

      const period = hours >= 12 ? 'PM' : 'AM'
      const formattedHours = hours % 12 || 12 // Convert 0 to 12 for 12 AM

      return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`
    } catch (error) {
      console.error('Error formatting time:', error)
      return time
    }
  }

  // Get the lowest ticket price
  const getLowestPrice = (): string => {
    if (!event.tickets || event.tickets.length === 0) {
      return 'Free'
    }

    // Filter out free tickets
    const paidTickets = event.tickets.filter(ticket => ticket.price && ticket.price > 0)

    if (paidTickets.length === 0) {
      return 'Free'
    }

    // Find the lowest price
    const lowestPrice = Math.min(...paidTickets.map(ticket => ticket.price || 0))

    return `${lowestPrice.toFixed(2)}`
  }

  // Handle save button click
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleSave(event.eventId)
  }

  return (
    <Link
      href={`organization/events/${event.eventId}`}
      className="border rounded-lg overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-300"
    >
      {/* Event image */}
      <div className="relative">
        <Image
          src={event.media || '/api/placeholder/400/200'}
          alt={event.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />

        {/* Save button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white p-0"
          onClick={handleSaveClick}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isSaved ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
            )}
          />
        </Button>
      </div>

      {/* Event details */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>

        {/* Date */}
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span>{formatDate(event.date)}</span>
        </div>

        {/* Time */}
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span>{formatTime(event.startTime)}</span>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-start text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 translate-y-0.5" />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        {/* Summary */}
        {event.summary && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-grow">
            {event.summary}
          </p>
        )}

        {/* Price tag */}
        <div className="mt-auto">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded">
            {getLowestPrice()}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default EventCard