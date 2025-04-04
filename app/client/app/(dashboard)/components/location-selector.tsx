// components/location-selector.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface LocationSelectorProps {
  location: string
  setLocation: (location: string) => void
  locations: string[]
  label?: string
}

// Helper functions for extracting city and state
const extractCity = (location: string): string => {
  const parts = location.split(',')
  if (parts.length > 0) {
    return parts[0].trim()
  }
  return location
}

const extractState = (location: string): string => {
  const parts = location.split(',')
  if (parts.length > 1) {
    return parts[parts.length - 1].trim()
  }
  return ''
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  location,
  setLocation,
  locations,
  label = "Browsing events in"
}) => {
  const [groupedLocations, setGroupedLocations] = useState<Record<string, string[]>>({})

  // Group locations by state for the select component
  useEffect(() => {
    const processLocations = () => {
      const grouped: Record<string, string[]> = {}

      locations.forEach(loc => {
        const state = extractState(loc) || 'Other'
        if (!grouped[state]) {
          grouped[state] = []
        }
        grouped[state].push(loc)
      })

      setGroupedLocations(grouped)
    }

    processLocations()
  }, [locations])

  // Format display location to show only City, State
  const formatDisplayLocation = (loc: string): string => {
    const city = extractCity(loc);
    const state = extractState(loc);

    if (city && state) {
      return `${city}, ${state}`;
    }

    return city || loc;
  };

  return (
    <div className="flex items-center mb-8">
      {label && <h2 className="text-base md:text-lg font-medium">{label}</h2>}
      <div className="ml-2 relative min-w-[200px]">
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              {location ? (
                <span>{formatDisplayLocation(location)}</span>
              ) : (
                <SelectValue placeholder="Select location" />
              )}
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white-100">
            {Object.entries(groupedLocations)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([state, stateLocations]) => (
                <SelectGroup key={state}>
                  <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                    {state}
                  </SelectLabel>
                  {stateLocations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {extractCity(loc)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default LocationSelector