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
import Image from 'next/image'

// Determine badge styling based on event status
const getStatusBadge = (status?: string) => {
    switch (status) {
        case 'on sale':
            return <Badge className="bg-green-500 text-white">On Sale</Badge>
        case 'draft':
            return <Badge className="bg-gray-500 text-white">Draft</Badge>
        default:
            return <Badge className="bg-blue-500 text-white">{status || 'Unknown'}</Badge>
    }
}

// Function to calculate total tickets sold
const calculateTicketsSold = (tickets?: Ticket[]) => {
    if (!tickets || !tickets.length) return 0
    return tickets.reduce((total, ticket) => total + ticket.sold, 0)
}

// Function to calculate total capacity
const calculateTotalCapacity = (tickets?: Ticket[]) => {
    if (!tickets || !tickets.length) return 0
    return tickets.reduce((total, ticket) => total + ticket.capacity, 0)
}

interface EventCardProps {
    event: Event;
    onDelete: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onDelete }) => {
    const ticketsSold = calculateTicketsSold(event.tickets)
    const totalCapacity = calculateTotalCapacity(event.tickets)

    return (
        <div className="bg-white-100 rounded-lg shadow-md border border-gray-200 overflow-hidden mb-3">
            <div className="flex flex-col sm:flex-row">
                {/* Event image */}
                <div className="sm:w-1/5 h-24 sm:h-auto bg-blue-100 relative">
                    {event.media ? (
                        <Image
                            src={event.media}
                            alt={event.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 20vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Icon name="Calendar" className="h-12 w-12 text-blue-500" />
                        </div>
                    )}
                </div>

                {/* Event details */}
                <div className="sm:w-4/5 p-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-purple-950 mb-1 line-clamp-1">{event.title}</h3>
                            <p className="text-gray-500 text-xs mb-2 line-clamp-1">{event.summary}</p>
                        </div>

                        {/* Actions dropdown menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Icon name="MoreVertical" className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-white-100">
                                <DropdownMenuItem asChild>
                                    <Link href={`/organization/events/${event._id}`}>
                                        <Icon name="Eye" className="h-4 w-4 mr-2" /> View
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/organization/events/edit/${event._id}`}>
                                        <Icon name="Edit" className="h-4 w-4 mr-2" /> Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete(event._id)}
                                    className="text-red-500 focus:text-red-500"
                                >
                                    <Icon name="Trash" className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Event metadata */}
                    <div className="mt-2 grid grid-cols-2 gap-y-1 gap-x-2 text-xs">
                        <div className="flex items-center gap-1">
                            <Icon name="MapPin" className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-700 truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Icon name="Calendar" className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-700">{formatDate(String(event.date), 'display')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Icon name="Clock" className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-700">{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Icon name="Ticket" className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-700">{ticketsSold} / {totalCapacity}</span>
                        </div>
                    </div>

                    {/* Status badge */}
                    <div className="mt-2 flex justify-between items-center">
                        {getStatusBadge(event.status)}

                        {/* Progress bar for ticket sales */}
                        <div className="flex items-center gap-1 w-1/2">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className="bg-blue-600 h-1.5 rounded-full"
                                    style={{ width: `${totalCapacity > 0 ? (ticketsSold / totalCapacity) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-600">
                                {totalCapacity > 0 ? Math.round((ticketsSold / totalCapacity) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard