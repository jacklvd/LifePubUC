/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import axios from 'axios'
import { API_BASE_URL } from '@/constants'
// Remove the import from server component
// import useEventStore from '@/store/useEventStore'

export const createEvent = async (eventData: EventData) => {
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

    return response.data.event
  } catch (error: any) {
    console.error('Error creating event:', error)
    throw new Error(
      error.response?.data?.message || 'An error occurred creating event.',
    )
  }
}

export const updateEvent = async (eventId: string, eventData: any, email?: string) => {
  try {
    let url = `${API_BASE_URL}/api/events/update-event/${eventId}`
    
    // Add email as query parameter if provided
    if (email) {
      url += `?email=${encodeURIComponent(email)}`
    }
    
    const response = await axios.put(
      url,
      eventData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status !== 200) {
      throw new Error(`Failed to update event. Status: ${response.status}`)
    }

    return response.data.event
  } catch (error: any) {
    console.error('Error updating event:', error)
    throw new Error(
      error.response?.data?.message || 'An error occurred updating event.',
    )
  }
}


export const getEventById = async (eventId: any, email?: string) => {
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

    return response.data.event
  } catch (error: any) {
    console.error('Error fetching event:', error)
    throw new Error(
      error.response?.data?.message || 'An error occurred fetching event.',
    )
  }
}

export async function publishEvent(
  eventId: string,
  email?: string
): Promise<PublishEventResponse> {
  try {
    console.log(`[CLIENT] Publishing event: ${eventId}`)

    let url = `${API_BASE_URL}/api/events/${eventId}/publish`
    
    // Add email as query parameter if provided
    if (email) {
      url += `?email=${encodeURIComponent(email)}`
    }
    
    console.log(`[CLIENT] Making request to: ${url}`)

    const response = await axios.post<PublishEventResponse>(
      url,
      {}, // Empty body
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    console.log(`[CLIENT] Publish response status: ${response.status}`)
    return response.data
  } catch (error: any) {
    console.error('[CLIENT] Error publishing event:')
    // Error handling...
    throw error.response?.data || error
  }
}

// Add the new function to get user events

// Modified getUserEvents - no longer updates Zustand store directly
export const getUserEvents = async (email: string, status?: string): Promise<Event[]> => {
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
    
    // Just return the events, don't try to update Zustand here
    return response.data.events || []
  } catch (error: any) {
    console.error('Error fetching user events:', error)
    throw new Error(
      error.response?.data?.message ||
        'An error occurred fetching user events.',
    )
  }
}

// Add a function to delete an event
export const deleteEvent = async (eventId: string, email?: string): Promise<void> => {
  try {
    let url = `${API_BASE_URL}/api/events/${eventId}/delete`
    
    // Add email as query parameter if provided
    if (email) {
      url += `?email=${encodeURIComponent(email)}`
    }
    
    const response = await axios.delete(
      url,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status !== 200) {
      throw new Error(`Failed to delete event. Status: ${response.status}`)
    }
  } catch (error: any) {
    console.error('Error deleting event:', error)
    throw new Error(
      error.response?.data?.message || 'An error occurred deleting event.',
    )
  }
}
