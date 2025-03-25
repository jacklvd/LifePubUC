// app/components/landing/UpcomingTimeline.jsx
import React from 'react'
import { ArrowRight, Clock, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { eventsTemp } from '@/constants'

interface UpcomingTimelineProps {
    location: string
}

const UpcomingTimeline: React.FC<UpcomingTimelineProps> = ({ location }) => {
    const timeframes = ['Today', 'Tomorrow', 'This Weekend', 'Next Week']

    return (
        <div className="mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center">
                <span className="mr-2">📅</span> Coming up in {location}
            </h2>

            <div className="space-y-4">
                {timeframes.map((timeframe, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                            <h3 className="font-medium">{timeframe}</h3>
                            {/* <Link href={`/events?date=${timeframe.toLowerCase().replace(' ', '-')}`}>
                                <span className="text-blue-600 text-sm flex items-center hover:underline">
                                    View all <ArrowRight className="h-3 w-3 ml-1" />
                                </span>
                            </Link> */}
                            <Link href='/'>
                                <span className="text-blue-600 text-sm flex items-center hover:underline">
                                    View all <ArrowRight className="h-3 w-3 ml-1" />
                                </span>
                            </Link>
                        </div>

                        <div className="p-3">
                            <div className="flex overflow-x-auto gap-4 pb-2">
                                {/* Display 4 upcoming events for each timeframe */}
                                {eventsTemp.slice(0, 4).map((event, eventIndex) => (
                                    <div key={eventIndex} className="min-w-[200px] max-w-[200px]">
                                        <div className="relative rounded overflow-hidden mb-2 group">
                                            <Image
                                                width={200}
                                                height={100}
                                                src={event.image || '/api/placeholder/200/100'}
                                                alt={event.title}
                                                className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute top-0 right-0 p-1">
                                                <div className="bg-white/80 rounded-full h-6 w-6 flex items-center justify-center">
                                                    <Heart className="h-3 w-3 text-gray-600" />
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="font-medium text-sm line-clamp-2 mb-1">{event.title}</h4>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Clock className="h-3 w-3 mr-1" />
                                            <span>{event.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UpcomingTimeline