/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import { formatDate } from '@/lib/date-formatter'
import { formatTime } from '@/lib/time-formatter'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface CalendarEventPopupProps {
  event: Event
  onClose: () => void
  position?: {
    top: number | string
    left: number | string
  }
}

const CalendarEventPopup: React.FC<CalendarEventPopupProps> = ({
  event,
  onClose,
  position,
}) => {
  if (!event) return null

  // Calculate ticket statistics
  const ticketsSold =
    event.tickets?.reduce((total, ticket) => total + ticket.sold, 0) || 0
  const totalCapacity =
    event.tickets?.reduce((total, ticket) => total + ticket.capacity, 0) || 0

  // Get status badge styling
  const getStatusColor = (status: any) => {
    switch (status) {
      case 'on sale':
        return 'bg-green-500'
      case 'draft':
        return 'bg-gray-500'
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <div
      className="absolute z-50 bg-white-100 rounded-lg shadow-xl border border-gray-200 w-72 p-4 event-popup-content"
      style={{
        top: position?.top || '50%',
        left: position?.left || '50%',
        transform: position ? 'none' : 'translate(-50%, -50%)',
      }}
    >
      {/* Header with close button */}
      <div className="flex justify-between items-start mb-3">
        <Badge className={`${getStatusColor(event.status)} text-white`}>
          {event.status?.charAt(0).toUpperCase() + event.status?.slice(1) ||
            'Draft'}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="-mt-2 -mr-2"
        >
          <Icon name="X" className="h-4 w-4" />
        </Button>
      </div>

      {/* Event title and summary */}
      <h3 className="text-lg font-semibold text-purple-950 mb-1">
        {event.title}
      </h3>
      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{event.summary}</p>

      {/* Event info */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Icon name="MapPin" className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span className="text-gray-700 truncate">{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon
            name="Calendar"
            className="h-4 w-4 text-gray-500 flex-shrink-0"
          />
          <span className="text-gray-700">
            {formatDate(String(event.date))}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Clock" className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span className="text-gray-700">
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Ticket" className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700">
                {ticketsSold} / {totalCapacity} tickets sold
              </span>
              <span className="text-xs text-gray-600">
                {totalCapacity > 0
                  ? Math.round((ticketsSold / totalCapacity) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{
                  width: `${totalCapacity > 0 ? (ticketsSold / totalCapacity) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/organization/events/${event._id}`}>
            <Icon name="Eye" className="h-4 w-4 mr-1" /> View
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/organization/events/edit/${event._id}`}>
            <Icon name="Edit" className="h-4 w-4 mr-1" /> Edit
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="MoreVertical" className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={() => onClose()}
            >
              <Icon name="Trash" className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default CalendarEventPopup
