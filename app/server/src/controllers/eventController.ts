import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import Event from '../models/eventSchema'

export const createEvent = async (req: any, res: any) => {
  try {
    // console.log('🔍 Received event data:', JSON.stringify(req.body, null, 2));

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: 'Request body is empty or invalid' })
    }

    const eventData = req.body

    // Generate a unique eventId
    const eventId = uuidv4().replace(/\-/g, '')

    const newEvent = new Event({
      _id: new mongoose.Types.ObjectId(),
      eventId: eventId,
      ...eventData,
      agenda:
        eventData.agenda?.map((agenda: { items: any[] }) => ({
          ...agenda,
          items: agenda.items.map(
            (item: {
              description: any
              host: any
              startTime: any
              endTime: any
            }) => ({
              ...item,
              description: item.description || '',
              host: item.host || '',
              startTime: item.startTime || '',
              endTime: item.endTime || '',
            }),
          ),
        })) || [],
      tickets: eventData.tickets || [],
      createdAt: new Date(),
    })

    await newEvent.save()

    return res.status(201).json({
      message: '✅ Event created successfully',
      event: newEvent,
    })
  } catch (error) {
    console.error('❌ Server error creating event:', error)

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map((e) => e.message),
      })
    }

    return res.status(500).json({
      message: 'Error creating event',
      error: (error as Error).message,
    })
  }
}

export const updateEvent = async (req: any, res: any) => {
  const { eventId } = req.params
  const updateData = req.body

  try {
    // Find event by eventId instead of _id
    const updatedEvent = await Event.findOneAndUpdate(
      { eventId: eventId },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' })
    }

    return res.status(200).json({
      message: '✅ Event updated successfully',
      event: updatedEvent,
    })
  } catch (error: any) {
    console.error('❌ Error updating event:', error)
    return res.status(500).json({
      message: 'Error updating event',
      error: error.message,
    })
  }
}

export const getEventById = async (req: any, res: any) => {
  const { eventId } = req.params

  try {
    // Find event by eventId
    const event = await Event.findOne({ eventId: eventId })
    console.log('🔍 Event found:', event ? 'Yes' : 'No')

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    return res.status(200).json({ event })
  } catch (error: any) {
    console.error('❌ Error fetching event:', error)
    return res.status(500).json({
      message: 'Error fetching event',
      error: error.message,
    })
  }
}

export const createEventTicket = async (req: any, res: any) => {
  const { eventId } = req.params
  const ticketData = req.body

  try {
    if (!ticketData || Object.keys(ticketData).length === 0) {
      return res
        .status(400)
        .json({ message: 'Ticket data is empty or invalid' })
    }

    // Generate a unique ID for the ticket
    const ticketId = new mongoose.Types.ObjectId().toString()

    // Add the ID to the ticket data
    const ticketWithId = {
      ...ticketData,
      id: ticketId,
    }

    // Find event by eventId
    const event = await Event.findOne({ eventId: eventId })

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Validate that the saleEnd date is not after the event date
    const eventDate = new Date(event.date)
    const saleEndDate = new Date(ticketData.saleEnd)

    if (saleEndDate > eventDate) {
      return res
        .status(400)
        .json({
          message: 'Ticket sale end date cannot be after the event date',
        })
    }

    // Add the ticket to the event
    if (!event.tickets) {
      event.tickets = []
    }

    event.tickets.push(ticketWithId)

    // Update the total capacity if specified
    if (ticketData.updateTotalCapacity && event.totalCapacity !== undefined) {
      event.totalCapacity += ticketData.capacity
    } else if (
      ticketData.updateTotalCapacity &&
      event.totalCapacity === undefined
    ) {
      event.totalCapacity = ticketData.capacity
    }

    // Save the updated event
    await event.save()

    return res.status(201).json({
      message: '✅ Ticket created successfully',
      ticket: ticketWithId,
    })
  } catch (error: any) {
    console.error('❌ Error creating ticket:', error)

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map((e) => e.message),
      })
    }

    return res.status(500).json({
      message: 'Error creating ticket',
      error: error.message,
    })
  }
}

export const updateEventTicket = async (req: any, res: any) => {
  const { eventId, ticketId } = req.params
  const updateData = req.body

  try {
    // Find event by eventId
    const event = await Event.findOne({ eventId: eventId })

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Find the ticket in the event
    if (!event.tickets || event.tickets.length === 0) {
      return res
        .status(404)
        .json({ message: 'No tickets found for this event' })
    }

    const ticketIndex = event.tickets.findIndex(
      (ticket) => ticket.id === ticketId,
    )
    // console.log('🔍 Ticket index found:', ticketIndex)
    if (ticketIndex === -1) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Validate that the saleEnd date is not after the event date
    if (updateData.saleEnd) {
      const eventDate = new Date(event.date)
      const saleEndDate = new Date(updateData.saleEnd)

      if (saleEndDate > eventDate) {
        return res
          .status(400)
          .json({
            message: 'Ticket sale end date cannot be after the event date',
          })
      }
    }

    // Get the current ticket
    const currentTicket = event.tickets[ticketIndex]

    // Ensure all required fields are preserved
    const updatedTicket = {
      id: currentTicket.id,
      name:
        updateData.name !== undefined ? updateData.name : currentTicket.name,
      sold: currentTicket.sold || 0,
      capacity:
        updateData.capacity !== undefined
          ? updateData.capacity
          : currentTicket.capacity,
      type: updateData.type || currentTicket.type,
      price:
        updateData.type === 'Free'
          ? undefined
          : updateData.price !== undefined
            ? updateData.price
            : currentTicket.price,
      saleStart: updateData.saleStart || currentTicket.saleStart,
      saleEnd: updateData.saleEnd || currentTicket.saleEnd,
      startTime: updateData.startTime || currentTicket.startTime,
      endTime: updateData.endTime || currentTicket.endTime,
      minPerOrder:
        updateData.minPerOrder !== undefined
          ? updateData.minPerOrder
          : currentTicket.minPerOrder,
      maxPerOrder:
        updateData.maxPerOrder !== undefined
          ? updateData.maxPerOrder
          : currentTicket.maxPerOrder,
    }

    // Update the ticket
    event.tickets[ticketIndex] = updatedTicket

    // Update the total capacity if needed
    if (
      updateData.capacity !== undefined &&
      event.totalCapacity !== undefined &&
      updateData.updateTotalCapacity
    ) {
      const oldCapacity = currentTicket.capacity
      const capacityDiff = updateData.capacity - oldCapacity
      event.totalCapacity += capacityDiff
    }

    // Save the updated event
    await event.save()

    return res.status(200).json({
      message: '✅ Ticket updated successfully',
      ticket: event.tickets[ticketIndex],
    })
  } catch (error: any) {
    console.error('❌ Error updating ticket:', error)
    return res.status(500).json({
      message: 'Error updating ticket',
      error: error.message,
    })
  }
}

export const deleteEventTicket = async (req: any, res: any) => {
  const { eventId, ticketId } = req.params

  try {
    // Find event by eventId
    const event = await Event.findOne({ eventId: eventId })

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Find the ticket in the event
    if (!event.tickets || event.tickets.length === 0) {
      return res
        .status(404)
        .json({ message: 'No tickets found for this event' })
    }

    const ticketIndex = event.tickets.findIndex(
      (ticket) => ticket.id === ticketId,
    )

    if (ticketIndex === -1) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Get the ticket capacity before removing
    const removedTicketCapacity = event.tickets[ticketIndex].capacity

    // Remove the ticket
    event.tickets.splice(ticketIndex, 1)

    // Update the total capacity
    if (event.totalCapacity !== undefined) {
      event.totalCapacity -= removedTicketCapacity
    }

    // Save the updated event
    await event.save()

    return res.status(200).json({
      message: '✅ Ticket deleted successfully',
    })
  } catch (error: any) {
    console.error('❌ Error deleting ticket:', error)
    return res.status(500).json({
      message: 'Error deleting ticket',
      error: error.message,
    })
  }
}

export const getEventTickets = async (req: any, res: any) => {
  const { eventId } = req.params

  // console.log('🔍 Fetching tickets for event:', eventId)

  try {
    // Find event by eventId
    const event = await Event.findOne({ eventId: eventId })

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    return res.status(200).json({
      tickets: event.tickets || [],
      totalCapacity: event.totalCapacity,
    })
  } catch (error: any) {
    console.error('❌ Error fetching tickets:', error)
    return res.status(500).json({
      message: 'Error fetching tickets',
      error: error.message,
    })
  }
}

export const publishEvent = async (req: any, res: any) => {
  const { eventId } = req.params

  try {
    // Find the event by eventId
    const event = await Event.findOne({ eventId: eventId })

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Update event status to published
    event.status = 'on sale'
    event.publishedAt = new Date()

    // Save the updated event
    await event.save()

    return res.status(200).json({
      message: '✅ Event published successfully',
      event: event,
    })
  } catch (error: any) {
    console.error('[SERVER] Error publishing event:', error)
    console.error('[SERVER] Error stack:', error.stack)

    return res.status(500).json({
      message: 'Error publishing event',
      error: error.message,
      // Only include stack trace in development
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    })
  }
}
