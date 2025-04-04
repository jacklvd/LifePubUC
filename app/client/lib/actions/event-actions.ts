/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/actions/event-actions.ts
'use server'
import axios from 'axios'
import { revalidatePath } from 'next/cache'
import { API_BASE_URL } from '@/constants'
/**
 * Get all events based on various filter parameters
 */
export async function getAllEvents(
  params: GetAllEventsParams,
): Promise<Event[]> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams()

    if (params.category) queryParams.append('category', params.category)
    if (params.status) queryParams.append('status', params.status)
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.search) queryParams.append('search', params.search)
    if (params.isOnline !== undefined)
      queryParams.append('isOnline', params.isOnline.toString())

    const queryString = queryParams.toString()
    const url = `${API_BASE_URL}/api/events/all-events?${queryString}`

    const response = await axios.get(url)

    if (response.status !== 200) {
      throw new Error(`Failed to fetch events. Status: ${response.status}`)
    }

    if (!response.data || !response.data.events) {
      return []
    }

    let events = response.data.events

    // Apply client-side filtering based on dateFilter
    if (params.dateFilter) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      switch (params.dateFilter) {
        case 'today': {
          // Events happening today
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)

          events = events.filter((event: Event) => {
            const eventDate = new Date(event.date)
            return eventDate >= today && eventDate < tomorrow
          })
          break
        }

        case 'this-week': {
          // Events happening this week (Sunday to Saturday)
          const startOfWeek = new Date(today)
          const currentDay = today.getDay() // 0 = Sunday, 6 = Saturday
          startOfWeek.setDate(today.getDate() - currentDay) // Go back to Sunday

          const endOfWeek = new Date(startOfWeek)
          endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday + 6 = Saturday
          endOfWeek.setHours(23, 59, 59, 999)

          events = events.filter((event: Event) => {
            const eventDate = new Date(event.date)
            return eventDate >= today && eventDate <= endOfWeek
          })
          break
        }

        case 'this-month': {
          // Events happening this month
          // const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
          const endOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0,
          )
          endOfMonth.setHours(23, 59, 59, 999)

          events = events.filter((event: Event) => {
            const eventDate = new Date(event.date)
            return eventDate >= today && eventDate <= endOfMonth
          })
          break
        }

        case 'upcoming': {
          // Events happening more than a month ahead
          const oneMonthLater = new Date(today)
          oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

          events = events.filter((event: Event) => {
            const eventDate = new Date(event.date)
            return eventDate >= oneMonthLater
          })
          break
        }
      }
    }

    return events
  } catch (error: any) {
    console.error('Error fetching events:', error)
    throw error
  }
}

/**
 * Get events for specific timeframes
 */
export async function getEventsByTimeframe(
  timeframe: string,
  limit: number = 4,
): Promise<Event[]> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get all events first
    const allEvents = await getAllEvents({
      status: 'on sale',
      limit: 50, // Higher limit to ensure we have enough after filtering
    })

    // Apply timeframe filtering
    let timeframeFiltered = allEvents

    switch (timeframe) {
      case 'today': {
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        timeframeFiltered = allEvents.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= today && eventDate < tomorrow
        })
        break
      }

      case 'tomorrow': {
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const dayAfterTomorrow = new Date(tomorrow)
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1)

        timeframeFiltered = allEvents.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= tomorrow && eventDate < dayAfterTomorrow
        })
        break
      }

      case 'weekend': {
        // Calculate weekend dates (Friday to Sunday)
        const currentDay = today.getDay() // 0 = Sunday, 6 = Saturday
        let daysUntilFriday = 5 - currentDay // Friday is 5
        if (daysUntilFriday < 0) daysUntilFriday += 7

        const friday = new Date(today)
        friday.setDate(today.getDate() + daysUntilFriday)

        const monday = new Date(friday)
        monday.setDate(friday.getDate() + 3) // Friday + 3 = Monday

        timeframeFiltered = allEvents.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= friday && eventDate < monday
        })
        break
      }

      case 'next-week': {
        // Next week = Next Monday to Next Sunday
        const currentDay = today.getDay()
        let daysUntilNextMonday = 8 - currentDay // Next Monday
        if (currentDay === 1) daysUntilNextMonday = 7 // If today is Monday, use next Monday

        const nextMonday = new Date(today)
        nextMonday.setDate(today.getDate() + daysUntilNextMonday)

        const nextSunday = new Date(nextMonday)
        nextSunday.setDate(nextMonday.getDate() + 6)

        timeframeFiltered = allEvents.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= nextMonday && eventDate < nextSunday
        })
        break
      }

      default:
        break
    }

    // Sort by date ascending
    timeframeFiltered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })

    // Apply limit
    return timeframeFiltered.slice(0, limit)
  } catch (error: any) {
    console.error(`Error fetching events for timeframe ${timeframe}:`, error)
    return []
  }
}
/**
 * Create new event
 */
export async function createEvent(
  eventData: EventData,
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/events/create-event`,
      eventData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status !== 201) {
      throw new Error(`Failed to create event. Status: ${response.status}`)
    }

    // Revalidate the events page
    revalidatePath('/events')

    return { success: true, eventId: response.data.event.eventId }
  } catch (error: any) {
    console.error('Error creating event:', error)
    return {
      success: false,
      error:
        error.response?.data?.message || 'An error occurred creating event.',
    }
  }
}

/**
 * Update existing event
 */
export async function updateEvent(
  eventId: string,
  eventData: Partial<EventData>,
  email?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let url = `${API_BASE_URL}/api/events/update-event/${eventId}`

    // Add email as query parameter if provided
    if (email) {
      url += `?email=${encodeURIComponent(email)}`
    }

    const response = await axios.put(url, eventData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status !== 200) {
      throw new Error(`Failed to update event. Status: ${response.status}`)
    }

    // Revalidate the events page
    revalidatePath('/events')
    revalidatePath(`/events/${eventId}`)

    return { success: true }
  } catch (error: any) {
    console.error('Error updating event:', error)
    return {
      success: false,
      error:
        error.response?.data?.message || 'An error occurred updating event.',
    }
  }
}

/**
 * Publish an event
 */
export async function publishEvent(
  eventId: string,
  email?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let url = `${API_BASE_URL}/api/events/${eventId}/publish`

    // Add email as query parameter if provided
    if (email) {
      url += `?email=${encodeURIComponent(email)}`
    }

    const response = await axios.post(
      url,
      {}, // Empty body
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status !== 200) {
      throw new Error(`Failed to publish event. Status: ${response.status}`)
    }

    // Revalidate the events page
    revalidatePath('/events')
    revalidatePath(`/events/${eventId}`)

    return { success: true }
  } catch (error: any) {
    console.error('Error publishing event:', error)
    return {
      success: false,
      error:
        error.response?.data?.message || 'An error occurred publishing event.',
    }
  }
}

/**
 * Delete event
 */
export async function deleteEvent(
  eventId: string,
  email?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let url = `${API_BASE_URL}/api/events/${eventId}/delete`

    // Add email as query parameter if provided
    if (email) {
      url += `?email=${encodeURIComponent(email)}`
    }

    const response = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status !== 200) {
      throw new Error(`Failed to delete event. Status: ${response.status}`)
    }

    // Revalidate the events page
    revalidatePath('/events')

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting event:', error)
    return {
      success: false,
      error:
        error.response?.data?.message || 'An error occurred deleting event.',
    }
  }
}

/**
 * Get single event by ID
 */
export async function getEventById(
  eventId: string,
  email?: string,
): Promise<Event | null> {
  try {
    let url = `${API_BASE_URL}/api/events/get-event/${eventId}`

    // Add email as query parameter if provided
    if (email) {
      url += `?email=${encodeURIComponent(email)}`
    }

    const response = await axios.get(url)

    if (response.status !== 200) {
      throw new Error(`Failed to fetch event. Status: ${response.status}`)
    }

    return response.data.event || null
  } catch (error: any) {
    console.error('Error fetching event:', error)
    return null
  }
}

/**
 * Get events for a specific user
 */
export async function getUserEvents(
  email: string,
  status?: string,
): Promise<Event[]> {
  try {
    // Build query string with email and optional status
    let url = `${API_BASE_URL}/api/events/user-events?email=${encodeURIComponent(email)}`
    if (status) {
      url += `&status=${encodeURIComponent(status)}`
    }

    const response = await axios.get(url)

    if (response.status !== 200) {
      throw new Error(`Failed to fetch user events. Status: ${response.status}`)
    }

    return response.data.events || []
  } catch (error: any) {
    console.error('Error fetching user events:', error)
    return []
  }
}
