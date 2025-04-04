/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Clock, Heart } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { extractCity } from '@/lib/utils'

interface EventSmallCardProps {
  event: Event;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

const EventSmallCard: React.FC<EventSmallCardProps> = ({
  event,
  isSaved = false,
  onToggleSave
}) => {
  // Format the time display
  const formatTime = (time: string | undefined) => {
    if (!time) return '';

    // If time is already in AM/PM format, return as is
    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }

    // Try to format 24h time to 12h time
    try {
      const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

      if (isNaN(hours) || isNaN(minutes)) {
        return time;
      }

      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

      return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error: any) {
      console.error('Error formatting time:', error);
      return time;
    }
  };

  // Extract location city only
  const getLocationCity = (location: string | undefined) => {
    if (!location) return '';

    // Check if we have access to venue mapping
    const venueMapping = typeof window !== 'undefined' ? (window as any).venueToStandardLocation : null;
    if (venueMapping && venueMapping[location]) {
      // Use the mapped city instead of the venue name
      return extractCity(venueMapping[location]);
    }

    // Handle venues directly
    const city = extractCity(location);

    // Check if this is likely a venue rather than a city
    const isVenue = /^\d+/.test(city) ||
      city.includes('Museum') ||
      city.includes('Hotel') ||
      city.includes('Center') ||
      city.includes('Plaza') ||
      city.includes('Bar') ||
      city.includes('Restaurant');

    if (isVenue) {
      // Try to extract the actual city from known venues
      if (venueToCity[city]) {
        return venueToCity[city];
      }

      // If we can't map it, just return the venue name
      return city;
    }

    return city;
  };

  // Map of known venues to their cities
  const venueToCity: Record<string, string> = {
    'Museum of Science': 'Boston',
    'New England Aquarium': 'Boston',
    'Hilton Boston Park Plaza': 'Boston',
    'Let\'s Go Racing': 'Boston',
    '3206 Colerain Avenue': 'Cincinnati',
    'Far Out Ice Cream Express': 'Portland',
    'Hopewell Bar & Kitchen': 'Allston',
    'IUE-CWA Local 201': 'Lynn',
    // Add more mappings as needed
  };

  // Safely handle event properties
  const { eventId, title, media, startTime, location } = event || {};
  const cityName = location ? getLocationCity(location) : '';

  // Handle save toggle
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (onToggleSave && eventId) {
      onToggleSave(eventId);
    }
  };

  return (
    <div className="min-w-[200px] max-w-[200px] group">
      <div className="relative rounded overflow-hidden mb-2">
        <Image
          width={200}
          height={100}
          src={media || '/api/placeholder/200/100'}
          alt={title || 'Event'}
          className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {onToggleSave && (
          <div className="absolute top-0 right-0 p-1">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 rounded-full h-6 w-6 flex items-center justify-center hover:bg-white transition-colors p-0"
              onClick={handleSaveClick}
            >
              <Heart
                className={cn(
                  "h-3 w-3 transition-colors",
                  isSaved ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                )}
              />
            </Button>
          </div>
        )}
      </div>

      <h4 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
        {title || 'Untitled Event'}
      </h4>

      <div className="flex items-center text-xs text-gray-500 mb-1">
        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
        <span>{formatTime(startTime) || 'Time TBD'}</span>
      </div>

      {cityName && (
        <div className="text-xs text-gray-500 truncate">
          {cityName}
        </div>
      )}
    </div>
  )
}

export default EventSmallCard