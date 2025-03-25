import express from 'express'
import {
  createEvent,
  updateEvent,
  getEventById,
  publishEvent,
  createEventTicket,
  updateEventTicket,
  deleteEventTicket,
  getEventTickets,
  getUserEvents,
  deleteEvent,
  getAllEvents
} from '../controllers/eventController'

const router = express.Router()

// Event routes
router.post('/create-event', createEvent)
router.put('/update-event/:eventId', updateEvent)
router.get('/get-event/:eventId', getEventById)
router.post('/:eventId/publish', publishEvent)
router.get('/user-events', getUserEvents)
router.delete('/:eventId/delete', deleteEvent)
router.get('/all-events', getAllEvents)

// Ticket routes
router.post('/:eventId/tickets', createEventTicket)
router.put('/:eventId/tickets/:ticketId', updateEventTicket)
router.delete('/:eventId/tickets/:ticketId', deleteEventTicket)
router.get('/:eventId/tickets', getEventTickets)

export default router
