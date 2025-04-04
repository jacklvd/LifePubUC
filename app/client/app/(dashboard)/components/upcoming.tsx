import React from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import EventSmallCard from './smaller-card'

interface UpcomingTimelineProps {
  upcomingEvents: {
    today: Event[];
    tomorrow: Event[];
    weekend: Event[];
    nextWeek: Event[];
  }
}

const UpcomingTimeline: React.FC<UpcomingTimelineProps> = ({
  upcomingEvents
}) => {
  // Define timeframes with display name, data, and URL parameter
  const timeframes = [
    { name: 'Today', events: upcomingEvents.today || [], param: 'today' },
    { name: 'Tomorrow', events: upcomingEvents.tomorrow || [], param: 'tomorrow' },
    { name: 'This Weekend', events: upcomingEvents.weekend || [], param: 'weekend' },
    { name: 'Next Week', events: upcomingEvents.nextWeek || [], param: 'next-week' },
  ]

  // Check if any of the timeframes have events
  const hasAnyEvents = timeframes.some(timeframe => timeframe.events.length > 0);

  if (!hasAnyEvents) {
    return null; // Don't render the component if there are no events
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center">
        <span className="mr-2">📅</span> Coming up
      </h2>

      <div className="space-y-4">
        {timeframes.map((timeframe, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
              <h3 className="font-medium">{timeframe.name}</h3>
              <Link href={`/events?dateFilter=${timeframe.param}`}>
                <span className="text-blue-600 text-sm flex items-center hover:underline">
                  View all <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              </Link>
            </div>

            <div className="p-3">
              {timeframe.events && timeframe.events.length > 0 ? (
                <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
                  {timeframe.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="min-w-[200px] max-w-[200px] flex-shrink-0">
                      <Link href={`/events/${event.eventId}`}>
                        <EventSmallCard event={event} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No events scheduled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingTimeline