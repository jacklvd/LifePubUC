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
  const { email } = req.query // Get email from query params

  try {
    // Create query with eventId and email (if provided)
    const query: any = { eventId: eventId }
    if (email) {
      query.email = email
    }

    const updatedEvent = await Event.findOneAndUpdate(
      query,
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
  const { email } = req.query // Get email from query params

  try {
    // Find event by eventId and email (if provided)
    const query: any = { eventId: eventId }
    if (email) {
      query.email = email
    }

    const event = await Event.findOne(query)
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

export const getUserEvents = async (req: any, res: any) => {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' })
    }

    // Fetch events where the email matches
    const events = await Event.find({ email: email }).sort({ createdAt: -1 }) // Sort by creation date, newest first

    // Optional: add filter for event status if provided in query params
    const { status } = req.query
    let filteredEvents = events

    if (status) {
      filteredEvents = events.filter((event) => event.status === status)
    }

    return res.status(200).json({
      events: filteredEvents,
      count: filteredEvents.length,
    })
  } catch (error: any) {
    console.error('❌ Error fetching user events:', error)
    return res.status(500).json({
      message: 'Error fetching user events',
      error: error.message,
    })
  }
}

export const deleteEvent = async (req: any, res: any) => {
  const { eventId } = req.params
  const { email } = req.query // Get email from query params
  console.log('🔍 Deleting event with eventId:', eventId)

  try {
    // Find and delete the event by eventId and email (if provided)
    const query: any = { eventId: eventId }
    if (email) {
      query.email = email
    }

    const deletedEvent = await Event.findOneAndDelete(query)

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' })
    }

    return res.status(200).json({
      message: '✅ Event deleted successfully',
    })
  } catch (error: any) {
    console.error('❌ Error deleting event:', error)
    return res.status(500).json({
      message: 'Error deleting event',
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
      return res.status(400).json({
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
        return res.status(400).json({
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
  const { email } = req.query // Get email from query params

  try {
    // Create query with eventId and email (if provided)
    const query: any = { eventId: eventId }
    if (email) {
      query.email = email
    }

    // Find the event by eventId and email
    const event = await Event.findOne(query)

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

export const getAllEvents = async (req: any, res: any) => {
  try {
    // Extract query parameters
    const {
      category,
      status = 'on sale', // Default to published events
      limit = 20,
      sort = 'newest',
      date,
      location,
      search,
    } = req.query

    // Build query object
    let query: any = {}
    
    // Only return published events by default
    query.status = status
    
    // Add category filter if provided
    if (category) {
      query.category = category
    }
    
    // Add location filter if provided
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }
    
    // Add date filtering
    if (date) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      switch (date) {
        case 'today':
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          query.date = { $gte: today, $lt: tomorrow }
          break
        case 'weekend':
          // Calculate weekend dates
          let daysUntilWeekend = 5 - today.getDay() // Friday is 5
          if (daysUntilWeekend < 0) daysUntilWeekend += 7
          
          const friday = new Date(today)
          friday.setDate(today.getDate() + daysUntilWeekend)
          
          const sunday = new Date(friday)
          sunday.setDate(friday.getDate() + 2)
          
          query.date = { $gte: friday, $lt: sunday }
          break
        case 'upcoming':
          query.date = { $gte: today }
          break
      }
    }
    
    // Add search functionality
    if (search) {
      // Search across multiple fields
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ]
    }
    
    // Set sort order based on parameter
    let sortOrder: any = { date: -1 } // Default to newest first
    if (sort === 'oldest') {
      sortOrder = { date: 1 }
    } else if (sort === 'price-low') {
      sortOrder = { 'tickets.price': 1 }
    } else if (sort === 'price-high') {
      sortOrder = { 'tickets.price': -1 }
    }
    
    // Convert limit to number
    const limitNum = parseInt(limit)

    // Execute query with pagination
    const events = await Event.find(query)
      .sort(sortOrder)
      .limit(limitNum)
      
    // Count total matches (without limit)
    const totalCount = await Event.countDocuments(query)
      
    return res.status(200).json({
      events,
      count: events.length,
      totalCount,
      hasMore: totalCount > events.length
    })
  } catch (error: any) {
    console.error('❌ Error fetching events:', error)
    return res.status(500).json({
      message: 'Error fetching events',
      error: error.message,
    })
  }
}