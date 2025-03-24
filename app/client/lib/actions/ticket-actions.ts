/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { toast } from 'sonner'
import axios from 'axios'
import { API_BASE_URL as API_URL } from '@/constants'

export async function getEventTickets(eventId: string): Promise<any> {
  try {
    console.log(
      `Fetching tickets from: ${API_URL}/api/events/${eventId}/tickets`,
    )

    const response = await axios.get(
      `${API_URL}/api/events/${eventId}/tickets`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    // console.log('Tickets response:', response.data);
    return response.data
  } catch (error: any) {
    console.error('Error fetching tickets:', error)
    console.error('Error details:', error.response || error.message)
    toast.error(error.response?.data?.message || 'Failed to load tickets')

    // Return empty data structure instead of throwing
    return { tickets: [], totalCapacity: 0 }
  }
}

export async function createTicket(
  eventId: string,
  ticketData: TicketFormData,
): Promise<Ticket> {
  try {
    // console.log(`Creating ticket at: ${API_URL}/api/events/${eventId}/tickets`);
    // console.log('Ticket data:', ticketData);

    const response = await axios.post(
      `${API_URL}/api/events/${eventId}/tickets`,
      ticketData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    // console.log('Create ticket response:', response.data);
    toast.success('Ticket created successfully')
    return response.data.ticket
  } catch (error: any) {
    console.error('Error creating ticket:', error)
    console.error('Error details:', error.response || error.message)
    toast.error(error.response?.data?.message || 'Failed to create ticket')
    throw error
  }
}

export async function updateTicket(
  eventId: string,
  ticketId: string,
  ticketData: Partial<TicketFormData>,
): Promise<Ticket> {
  try {
    // Format dates if they are Date objects
    const formattedData = { ...ticketData }

    const requestData: any = { ...formattedData }

    // Format dates for the API request without changing the type on formattedData
    if (formattedData.saleStart instanceof Date) {
      requestData.saleStart = formattedData.saleStart.toISOString()
    }

    if (formattedData.saleEnd instanceof Date) {
      requestData.saleEnd = formattedData.saleEnd.toISOString()
    }

    console.log('Sending ticket update data:', formattedData)

    const response = await axios.put(
      `${API_URL}/api/events/${eventId}/tickets/${ticketId}`,
      formattedData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    console.log('Update response:', response.data)
    return response.data.ticket
  } catch (error: any) {
    console.error('Error updating ticket:', error)
    const errorMessage =
      error.response?.data?.message || 'Failed to update ticket'
    toast.error(errorMessage)
    throw error
  }
}

export async function deleteTicket(
  eventId: string,
  ticketId: string,
): Promise<void> {
  try {
    await axios.delete(`${API_URL}/api/events/${eventId}/tickets/${ticketId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    toast.success('Ticket deleted successfully')
  } catch (error: any) {
    console.error('Error deleting ticket:', error)
    toast.error(error.response?.data?.message || 'Failed to delete ticket')
    throw error
  }
}

export async function updateEventTotalCapacity(
  eventId: string,
  totalCapacity: number,
): Promise<void> {
  try {
    await axios.put(
      `${API_URL}/api/events/${eventId}`,
      { totalCapacity },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    toast.success('Event capacity updated successfully')
  } catch (error: any) {
    console.error('Error updating capacity:', error)
    toast.error(error.response?.data?.message || 'Failed to update capacity')
    throw error
  }
}
