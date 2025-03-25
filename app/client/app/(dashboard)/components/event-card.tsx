/* eslint-disable @typescript-eslint/no-unused-vars */
// app/components/landing/EventCard.tsx
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Heart } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'

interface EventCardProps {
    event: Event
    isSaved: boolean
    onToggleSave: (id: string) => void
}

const EventCard: React.FC<EventCardProps> = ({ event, isSaved, onToggleSave }) => {
    // Handle date formatting safely
    const formatEventDate = (date: Date | string) => {
        try {
            // If date is already a string in a display format, just return it
            if (typeof date === 'string' && date.includes('-') === false && date.includes('/') === false) {
                return date;
            }

            // Handle ISO strings or properly formatted date strings
            if (typeof date === 'string') {
                // Check if it's a timestamp number stored as string
                if (/^\d+$/.test(date)) {
                    return format(new Date(parseInt(date)), "MMMM d, yyyy");
                }

                // Try to parse the date with different formats
                try {
                    return format(new Date(date), "MMMM d, yyyy");
                } catch (e) {
                    // If direct parsing fails, try alternative formats
                    const parts = date.split(/[-/]/);
                    if (parts.length === 3) {
                        // Try different date formats (MM-DD-YYYY, YYYY-MM-DD, etc.)
                        const possibleDate = new Date(
                            parseInt(parts[2].length === 4 ? parts[2] : parts[0]),
                            parseInt(parts[1]) - 1,
                            parseInt(parts[2].length === 4 ? parts[0] : parts[2])
                        );

                        if (!isNaN(possibleDate.getTime())) {
                            return format(possibleDate, "MMMM d, yyyy");
                        }
                    }
                }
            } else if (date instanceof Date && !isNaN(date.getTime())) {
                return format(date, "MMMM d, yyyy");
            }

            // If we get here, we couldn't parse the date
            return 'Date unavailable';
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date unavailable'; // Fallback
        }
    };

    return (
        <Card className="h-full overflow-hidden border group cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="relative">
                <Image
                    width={400}
                    height={200}
                    src={event.media || '/api/placeholder/400/320'}
                    alt={event.title}
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                    className={`absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${isSaved
                        ? 'bg-red-500 text-white'
                        : 'bg-white/70 hover:bg-white text-gray-600'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(event.eventId);
                    }}
                    aria-label={isSaved ? "Unsave event" : "Save event"}
                >
                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
                </button>
            </div>
            <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-base h-12 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {event.title}
                </h3>
                <div className="flex items-center text-sm mb-1 text-gray-600">
                    <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>
                        {/* Add debugging to see what the date actually contains */}
                        {typeof event.date === 'object' ? formatEventDate(event.date) :
                            typeof event.date === 'string' ? formatEventDate(event.date) :
                                'Invalid date'} • {event.startTime}
                    </span>
                </div>
                <div className="flex items-center text-sm mb-2 text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                </div>
                <div className="flex justify-between items-center">
                    {/* Show remaining tickets if available */}
                    {event.tickets && (
                        <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                            <span>{event.tickets.length} tickets left</span>
                        </div>
                    )}
                </div>

                {/* Commented out organizer section */}
                {/* {event.organizer && (
                    <div className="flex items-center mt-3 text-xs text-gray-500">
                        <Image
                            src="/api/placeholder/24/24"
                            width={24}
                            height={24}
                            alt="Organizer"
                            className="w-5 h-5 rounded-full mr-1"
                        />
                        {event.organizer}
                        {event.followers && (
                            <span className="flex items-center ml-2">
                                <Users className="h-3 w-3 mr-1" />
                                {event.followers}
                            </span>
                        )}
                    </div>
                )} */}
            </CardContent>
        </Card>
    )
}

export default EventCard