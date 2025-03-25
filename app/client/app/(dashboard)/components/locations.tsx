import React, { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Icon } from '@/components/icons'

// Define the props for the LocationSelector component
interface LocationSelectorProps {
    location: string
    setLocation: (location: string) => void
    locations: string[]
}
const LocationSelector: React.FC<LocationSelectorProps> = ({ location, setLocation, locations }) => {
    const [showLocationDropdown, setShowLocationDropdown] = useState(false)

    return (
        <div className="flex items-center mb-8 relative">
            <h2 className="text-base md:text-lg font-medium">Browsing events in</h2>
            <div
                className="ml-2 bg-white border rounded-md px-3 py-2 flex items-center cursor-pointer text-blue-600 hover:border-blue-400 transition-all"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            >
                <MapPin className="h-4 w-4 mr-1" />
                <span>{location}</span>
                <Icon name="ChevronDown" className={`h-4 w-4 ml-1 transition-transform duration-300 ${showLocationDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* Location dropdown menu */}
            {showLocationDropdown && (
                <div className="absolute top-full left-[7.5rem] mt-1 bg-white border rounded-md shadow-lg z-20 w-48">
                    {locations.map((loc, index) => (
                        <div
                            key={index}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                            onClick={() => {
                                setLocation(loc)
                                setShowLocationDropdown(false)
                            }}
                        >
                            <div className="flex items-center">
                                <MapPin className={`h-4 w-4 mr-2 ${loc === location ? 'text-blue-500' : 'text-gray-400'}`} />
                                <span className={loc === location ? 'font-medium text-blue-500' : ''}>{loc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LocationSelector