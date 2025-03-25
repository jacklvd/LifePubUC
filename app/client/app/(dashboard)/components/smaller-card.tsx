import React from 'react'
import { Clock, Heart } from 'lucide-react'
import Image from 'next/image'

interface EventSmallCardProps {
    event: Event
}

const EventSmallCard: React.FC<EventSmallCardProps> = ({ event }) => {
    return (
        <div className="min-w-[200px] max-w-[200px]">
            <div className="relative rounded overflow-hidden mb-2 group">
                <Image
                    width={200}
                    height={100}
                    src={event.media || '/api/placeholder/200/100'}
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
                <span>{event.startTime}</span>
            </div>
        </div>
    )
}

export default EventSmallCard