/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/actions/location-actions.ts
'use server'
import axios from 'axios'
import { API_BASE_URL } from '@/constants'

// Extract state from location string
const extractState = (location: string): string => {
  const parts = location.split(',')
  if (parts.length > 1) {
    // Get the last part and trim it
    return parts[parts.length - 1].trim()
  }
  return '' // Return empty string instead of default 'USA'
}

// Extract city from location string
const extractCity = (location: string): string => {
  const parts = location.split(',')
  if (parts.length > 0) {
    return parts[0].trim()
  }
  return location
}

// Normalize a location to City, State format
const normalizeLocation = (location: string): string => {
  const city = extractCity(location)
  const state = extractState(location)

  if (!state) {
    return city
  }

  return `${city}, ${state}`
}

/**
 * Determines if a venue location matches a selected city/state filter
 * This helps with more flexible matching for location filtering
 */
export async function matchesLocation(
  eventLocation: string,
  filterLocation: string,
): Promise<boolean> {
  if (!eventLocation || !filterLocation) return false

  // Extract components from both locations
  const eventCity = extractCity(eventLocation)
  const eventState = extractState(eventLocation)
  const filterCity = extractCity(filterLocation)
  const filterState = extractState(filterLocation)

  // Match by state only if filterCity is empty
  if (!filterCity && filterState && eventState) {
    return eventState.toLowerCase() === filterState.toLowerCase()
  }

  // Match by both city and state
  if (filterCity && filterState) {
    // Check if city and state both match (case insensitive)
    return (
      eventCity.toLowerCase().includes(filterCity.toLowerCase()) &&
      eventState.toLowerCase() === filterState.toLowerCase()
    )
  }

  // If we only have a city to filter by
  if (filterCity && !filterState) {
    return eventCity.toLowerCase().includes(filterCity.toLowerCase())
  }

  return false
}

/**
 * Map specific venues to their corresponding cities
 * This helps with standardizing location data
 */
const venueToCity: Record<string, string> = {
  'Museum of Science': 'Boston',
  'New England Aquarium': 'Boston',
  'Hilton Boston Park Plaza': 'Boston',
  "Let's Go Racing": 'Boston',
  '3206 Colerain Avenue': 'Cincinnati',
  'Far Out Ice Cream Express': 'Portland',
  'Hopewell Bar & Kitchen': 'Allston',
  'IUE-CWA Local 201': 'Lynn',
  // Add more mappings as needed
}

/**
 * Attempt to standardize a location to City, State format
 */
const standardizeLocation = (location: string): string | null => {
  if (!location) return null

  const state = extractState(location)
  if (!state) return null

  const rawCity = extractCity(location)

  // Check if this is a known venue and map it to the right city
  if (venueToCity[rawCity]) {
    return `${venueToCity[rawCity]}, ${state}`
  }

  // Check if this looks like a venue/address
  const isVenue =
    /^\d+/.test(rawCity) ||
    rawCity.includes('Museum') ||
    rawCity.includes('Hotel') ||
    rawCity.includes('Center') ||
    rawCity.includes('Plaza') ||
    rawCity.includes('Bar') ||
    rawCity.includes('Restaurant')

  if (isVenue) {
    // Try to extract city information from the full location
    // This is a simplified example and might need enhancement
    const parts = location.split(',')
    if (parts.length > 2) {
      // If there are multiple commas, the city might be the second-to-last part
      const possibleCity = parts[parts.length - 2].trim()

      // Check if this looks like a city (not a venue, not a street address)
      if (
        !/^\d+/.test(possibleCity) &&
        !possibleCity.includes('St') &&
        !possibleCity.includes('Street') &&
        !possibleCity.includes('Avenue') &&
        !possibleCity.includes('Road')
      ) {
        return `${possibleCity}, ${state}`
      }
    }

    return null // Can't reliably determine city
  }

  // This looks like a regular city
  return `${rawCity}, ${state}`
}

/**
 * Fetch all available event locations and standardize to City, State format
 */
export async function getEventLocations(): Promise<string[]> {
  try {
    // Fetch events with a high limit to get a good sample of locations
    const response = await axios.get(
      `${API_BASE_URL}/api/events/all-events?limit=300&status=on sale`,
    )

    if (response.status !== 200) {
      throw new Error(`Failed to fetch locations. Status: ${response.status}`)
    }

    if (!response.data.events || response.data.events.length === 0) {
      return []
    }

    // Extract locations
    const rawLocations = response.data.events.map(
      (event: Event) => event.location || '',
    )

    // Process locations to standardize format and remove duplicates
    const cityStateMap = new Map<string, Set<string>>()

    // Also maintain the original venue mapping for filtering
    const venueMapping: Record<string, string> = {}

    rawLocations.forEach((loc: string) => {
      if (!loc) return

      // Try to standardize to City, State format
      const standardized = standardizeLocation(loc)

      if (!standardized) return // Skip if we can't standardize

      const state = extractState(standardized)
      const city = extractCity(standardized)

      // Store mapping of original venue to standardized city
      venueMapping[loc] = standardized

      if (!cityStateMap.has(state)) {
        cityStateMap.set(state, new Set())
      }

      cityStateMap.get(state)?.add(city)
    })

    // Convert the map to an array of "City, State" strings
    const standardizedLocations: string[] = []

    cityStateMap.forEach((cities, state) => {
      cities.forEach((city) => {
        standardizedLocations.push(`${city}, ${state}`)
      })
    })

    // Sort by state first, then by city
    standardizedLocations.sort((a, b) => {
      const stateA = extractState(a)
      const stateB = extractState(b)

      if (stateA !== stateB) {
        return stateA.localeCompare(stateB)
      }

      return extractCity(a).localeCompare(extractCity(b))
    })

    // Store the venue mappings in a global variable or context for filtering
    // This could be enhanced with a more robust state management solution
    ;(window as any).venueToStandardLocation = venueMapping

    return standardizedLocations
  } catch (error: any) {
    console.error('Error fetching locations:', error)
    return []
  }
}

/**
 * Get popular locations (by state and city)
 */
export async function getPopularLocations(
  limit: number = 5,
): Promise<string[]> {
  try {
    // Fetch a large number of events to get location data
    const response = await axios.get(
      `${API_BASE_URL}/api/events/all-events?limit=200&status=on sale`,
    )

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch events for popular locations. Status: ${response.status}`,
      )
    }

    const data = response.data

    if (!data.events || data.events.length === 0) {
      return []
    }

    // Count city, state occurrences
    const locationCount: Record<string, number> = {}

    for (const event of data.events) {
      if (!event.location) continue

      const normalized = normalizeLocation(event.location)
      // Skip locations without state
      if (!extractState(normalized)) continue

      locationCount[normalized] = (locationCount[normalized] || 0) + 1
    }

    // Sort locations by count and return the top ones
    return Object.entries(locationCount)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, limit)
      .map(([location]) => location)
  } catch (error: any) {
    console.error('Error determining popular locations:', error)
    return []
  }
}

/**
 * Get locations with events in a specific timeframe
 */
export async function getLocationsWithEvents(
  timeframe?: string,
): Promise<string[]> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams()
    queryParams.append('limit', '100')
    queryParams.append('status', 'on sale')

    if (timeframe) {
      queryParams.append(
        'date',
        timeframe === 'next-week' ? 'upcoming' : timeframe,
      )
    }

    const queryString = queryParams.toString()
    const url = `${API_BASE_URL}/api/events/all-events?${queryString}`

    const response = await axios.get(url)

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch events for locations. Status: ${response.status}`,
      )
    }

    // Extract and filter locations based on timeframe if needed
    let events = response.data.events || []

    if (timeframe === 'next-week') {
      const today = new Date()
      const nextWeekStart = new Date(today)
      nextWeekStart.setDate(today.getDate() + 7 - today.getDay()) // Next week's Sunday

      const nextWeekEnd = new Date(nextWeekStart)
      nextWeekEnd.setDate(nextWeekStart.getDate() + 7)

      events = events.filter((event: Event) => {
        const eventDate = new Date(event.date)
        return eventDate >= nextWeekStart && eventDate < nextWeekEnd
      })
    }

    // Process and standardize locations
    const cityStateMap = new Map<string, Set<string>>()

    events.forEach((event: Event) => {
      if (!event.location) return

      const state = extractState(event.location)
      // Skip if no state is found
      if (!state) return

      const city = extractCity(event.location)

      if (!cityStateMap.has(state)) {
        cityStateMap.set(state, new Set())
      }

      cityStateMap.get(state)?.add(city)
    })

    // Convert the map to an array of "City, State" strings
    const standardizedLocations: string[] = []

    cityStateMap.forEach((cities, state) => {
      cities.forEach((city) => {
        standardizedLocations.push(`${city}, ${state}`)
      })
    })

    // Sort by state first, then by city
    standardizedLocations.sort((a, b) => {
      const stateA = extractState(a)
      const stateB = extractState(b)

      if (stateA !== stateB) {
        return stateA.localeCompare(stateB)
      }

      return extractCity(a).localeCompare(extractCity(b))
    })

    return standardizedLocations
  } catch (error: any) {
    console.error('Error fetching locations with events:', error)
    return []
  }
}
