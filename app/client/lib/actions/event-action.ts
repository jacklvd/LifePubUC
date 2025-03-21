/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import axios from 'axios'
import { API_BASE_URL } from '@/constants'
// import { toast } from 'sonner'

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
    // console.log('CreateEvent response:', JSON.stringify(response.data.event._id, null, 2))

    return response.data.event
  } catch (error: any) {
    console.error('Error creating event:', error)
    throw new Error(
      error.response?.data?.message || 'An error occurred creating event.',
    )
  }
}

export const updateEvent = async (eventId: string, eventData: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/events/update-event/${eventId}`,
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

export const getEventById = async (eventId: any) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/events/get-event/${eventId}`,
    )

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
): Promise<PublishEventResponse> {
  try {
    console.log(`[CLIENT] Publishing event: ${eventId}`)

    const url = `${API_BASE_URL}/api/events/${eventId}/publish`
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

    if (error.response) {
      console.error(`[CLIENT] Status: ${error.response.status}`)
      console.error('[CLIENT] Data:', error.response.data)
    } else if (error.request) {
      console.error('[CLIENT] No response received')
    } else {
      console.error(`[CLIENT] Error message: ${error.message}`)
    }

    throw error.response?.data || error
  }
}
