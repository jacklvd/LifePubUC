/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-ticket.ts
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useReducer,
} from 'react'
import { toast } from 'sonner'
import { getEventById } from '@/lib/actions/event-action'
import {
  getEventTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from '@/lib/actions/ticket-actions'
import { EventStep } from '@/components/event-ui/event-leftside-bar'
import { format } from 'date-fns'

// Types
type TicketType = 'Free' | 'Paid' | 'Donation'
type DialogType = 'add' | 'edit' | 'delete' | 'capacity' | null
type CalendarType = 'start' | 'end' | null

interface TicketState {
  ticketType: TicketType
  ticketName: string
  ticketCapacity: number
  ticketPrice: number | undefined
  saleStartDate: Date | undefined
  saleEndDate: Date | undefined
  startTime: string
  endTime: string
  minPerOrder: number
  maxPerOrder: number
}

// Action types for reducer
type TicketAction =
  | { type: 'RESET_FORM'; payload: { eventDate?: Date; eventEndTime?: string } }
  | {
      type: 'SET_FOR_ADD'
      payload: { eventDate?: Date; eventEndTime?: string }
    }
  | {
      type: 'SET_FOR_EDIT'
      payload: { ticket: Ticket; eventDate?: Date; eventEndTime?: string }
    }
  | { type: 'UPDATE_FIELD'; payload: { field: keyof TicketState; value: any } }

// Initial state for ticket form
const initialTicketState: TicketState = {
  ticketType: 'Free',
  ticketName: '',
  ticketCapacity: 100,
  ticketPrice: undefined,
  saleStartDate: new Date(),
  saleEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now (will be adjusted based on event date)
  startTime: '08:00 AM',
  endTime: '05:00 PM', // Will be adjusted based on event time
  minPerOrder: 1,
  maxPerOrder: 10,
}

// Helper function to extract time components
const getTimeComponents = (timeStr: string) => {
  const [timePart, period] = timeStr.split(' ')
  const [hourStr, minuteStr] = timePart.split(':')
  let hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)

  // Convert to 24-hour format
  if (period === 'PM' && hour < 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0

  return { hour, minute }
}

// Helper function to format time (24hr -> 12hr with AM/PM)
const formatTime = (hour: number, minute: number) => {
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  const hourStr = hour12.toString().padStart(2, '0')
  const minuteStr = minute.toString().padStart(2, '0')
  return `${hourStr}:${minuteStr} ${period}`
}

// Reducer to manage ticket form state
const ticketReducer = (
  state: TicketState,
  action: TicketAction,
): TicketState => {
  switch (action.type) {
    case 'RESET_FORM': {
      const today = new Date()
      let endDate = new Date()
      let endTime = '05:00 PM' // Default end time

      // Handle event date and time if available
      if (action.payload.eventDate) {
        // Set end date to SAME DAY as event (not day before)
        endDate = new Date(action.payload.eventDate)

        // If event has an end time, use it (minus 1 hour)
        if (action.payload.eventEndTime) {
          const { hour, minute } = getTimeComponents(
            action.payload.eventEndTime,
          )

          // Set end time to 1 hour before event end time
          const adjustedHour = hour > 0 ? hour - 1 : 23
          endTime = formatTime(adjustedHour, minute)
        }
      } else {
        endDate.setDate(endDate.getDate() + 30) // Default to 30 days later if no event date
      }

      return {
        ...initialTicketState,
        saleStartDate: today,
        saleEndDate: endDate,
        endTime,
      }
    }

    case 'SET_FOR_ADD':
      return ticketReducer(state, {
        type: 'RESET_FORM',
        payload: {
          eventDate: action.payload.eventDate,
          eventEndTime: action.payload.eventEndTime,
        },
      })

    case 'SET_FOR_EDIT': {
      const ticket = action.payload.ticket
      const { eventDate, eventEndTime } = action.payload

      // Start with the ticket's current values
      const formState = {
        ticketType: ticket.type,
        ticketName: ticket.name,
        ticketCapacity: ticket.capacity,
        ticketPrice: ticket.price,
        saleStartDate: new Date(ticket.saleStart),
        saleEndDate: new Date(ticket.saleEnd),
        startTime: ticket.startTime,
        endTime: ticket.endTime,
        minPerOrder: ticket.minPerOrder || 1,
        maxPerOrder: ticket.maxPerOrder || 10,
      }

      // If we have event data, ensure the sale end date/time is valid
      if (eventDate) {
        const eventDateObj = new Date(eventDate)

        // Ensure sale end date is not after event date
        if (formState.saleEndDate > eventDateObj) {
          formState.saleEndDate = eventDateObj
        }

        // Adjust end time if needed
        if (eventEndTime) {
          const { hour, minute } = getTimeComponents(eventEndTime)
          const ticketEndTime = getTimeComponents(ticket.endTime)

          // If ticket end time is after event end time, adjust it
          if (
            ticketEndTime.hour > hour ||
            (ticketEndTime.hour === hour && ticketEndTime.minute >= minute)
          ) {
            // Set to 1 hour before event end
            const adjustedHour = hour > 0 ? hour - 1 : 23
            formState.endTime = formatTime(adjustedHour, minute)
          }
        }
      }

      return formState
    }

    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      }

    default:
      return state
  }
}

export const useTicketManagement = (
  eventId: string,
  markStepCompleted: (step: EventStep) => void,
) => {
  // App state
  const [activeTab, setActiveTab] = useState('admission')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [totalCapacity, setTotalCapacity] = useState(0)
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)

  // Use a single state for all dialogs to prevent multiple dialogs being open
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [activeCalendar, setActiveCalendar] = useState<CalendarType>(null)

  // Use reducer for form state management
  const [formState, dispatch] = useReducer(ticketReducer, initialTicketState)

  // Memoize the parsed event date
  const parsedEventDate = useMemo(() => {
    if (event?.date) {
      return new Date(event.date)
    }
    return undefined
  }, [event?.date])

  // Refs for tracking initialization
  const dataFetchedRef = useRef(false)

  // Get the event end time
  const eventEndTime = useMemo(() => {
    if (event?.endTime) return event.endTime
    if (event?.time) return event.time // Fallback to main event time
    return '11:59 PM' // Default if no time found
  }, [event])

  // Memoize time options with limit to event end time
  const generateTimeOptions = useMemo(() => {
    const options = []
    const { hour: eventEndHour, minute: eventEndMinute } =
      getTimeComponents(eventEndTime)

    // Calculate maximum time (1 hour before event end)
    const maxHour = eventEndHour > 0 ? eventEndHour - 1 : 23
    const maxMinute = eventEndMinute

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Skip times that are after or equal to max time
        if (hour > maxHour || (hour === maxHour && minute > maxMinute)) {
          continue
        }

        const h = hour % 12 || 12
        const period = hour < 12 ? 'AM' : 'PM'
        const formattedHour = h.toString().padStart(2, '0')
        const formattedMinute = minute.toString().padStart(2, '0')
        const time = `${formattedHour}:${formattedMinute} ${period}`
        options.push(time)
      }
    }

    // Ensure we always have at least one option
    if (options.length === 0) {
      const h = maxHour % 12 || 12
      const period = maxHour < 12 ? 'AM' : 'PM'
      const formattedHour = h.toString().padStart(2, '0')
      const formattedMinute = maxMinute.toString().padStart(2, '0')
      options.push(`${formattedHour}:${formattedMinute} ${period}`)
    }

    return options
  }, [eventEndTime])

  // Fetch event and tickets data
  const fetchData = useCallback(async () => {
    if (dataFetchedRef.current) return

    try {
      setLoading(true)

      // Fetch event details
      const eventData = await getEventById(eventId)
      if (!eventData || eventData.error) {
        setError(eventData?.error || 'Event not found')
        setLoading(false)
        return
      }
      setEvent(eventData)

      // Fetch tickets
      const ticketsData = await getEventTickets(eventId)
      setTickets(ticketsData.tickets || [])
      setTotalCapacity(ticketsData.totalCapacity || 0)

      // If tickets exist, mark tickets step as completed
      if (ticketsData.tickets?.length > 0) {
        markStepCompleted('tickets')
      }

      dataFetchedRef.current = true
    } catch (error: any) {
      console.error('Error fetching data:', error)
      setError(error?.message || 'Failed to load event data')
    } finally {
      setLoading(false)
    }
  }, [eventId, markStepCompleted])

  // Field update handlers (simplified to dispatch)
  const updateField = useCallback(
    <T extends keyof TicketState>(field: T, value: TicketState[T]) => {
      dispatch({ type: 'UPDATE_FIELD', payload: { field, value } })
    },
    [],
  )

  // Date validation
  const isEndDateDisabled = useCallback(
    (date: Date) => {
      if (!parsedEventDate) return false
      return date > parsedEventDate
    },
    [parsedEventDate],
  )

  // Dialog control functions
  const openAddDialog = useCallback(() => {
    // Then set up the form
    setCurrentTicket(null)
    dispatch({
      type: 'SET_FOR_ADD',
      payload: {
        eventDate: parsedEventDate,
        eventEndTime: eventEndTime,
      },
    })

    // Close any open calendars first
    setActiveCalendar(null)

    // Then open the dialog
    setActiveDialog('add')
  }, [parsedEventDate, eventEndTime])

  const openEditDialog = useCallback(
    (ticket: Ticket) => {
      setCurrentTicket(ticket)
      dispatch({
        type: 'SET_FOR_EDIT',
        payload: {
          ticket,
          eventDate: parsedEventDate,
          eventEndTime: eventEndTime,
        },
      })
      setActiveDialog('edit')
    },
    [parsedEventDate, eventEndTime],
  )

  const openDeleteDialog = useCallback((ticket: Ticket) => {
    setCurrentTicket(ticket)
    setActiveDialog('delete')
  }, [])

  const closeAllDialogs = useCallback(() => {
    setActiveDialog(null)
    setActiveCalendar(null)
  }, [])

  // Handle form submission for adding a ticket
  const handleAddTicket = useCallback(async () => {
    try {
      const {
        ticketName,
        ticketCapacity,
        ticketType,
        ticketPrice,
        saleStartDate,
        saleEndDate,
        startTime,
        endTime,
        minPerOrder,
        maxPerOrder,
      } = formState

      // Validate form
      if (!ticketName) {
        toast.error('Ticket name is required')
        return
      }

      if (!saleStartDate || !saleEndDate) {
        toast.error('Sale start and end dates are required')
        return
      }

      // Automatically ensure sale end date and time are valid
      let adjustedSaleEndDate = new Date(saleEndDate)
      let adjustedEndTime = endTime

      // If we have event date, ensure sale ends on or before event date
      if (parsedEventDate) {
        if (adjustedSaleEndDate > parsedEventDate) {
          adjustedSaleEndDate = new Date(parsedEventDate)
        }

        // If on the same day as the event, ensure end time is before event
        if (
          adjustedSaleEndDate.toDateString() === parsedEventDate.toDateString()
        ) {
          const endTimeComponents = getTimeComponents(endTime)
          const eventEndComponents = getTimeComponents(eventEndTime)

          // If ticket sale ends after event starts, adjust it
          if (endTimeComponents.hour >= eventEndComponents.hour - 1) {
            // Set to 1 hour before event end time
            const adjustedHour =
              eventEndComponents.hour > 0 ? eventEndComponents.hour - 1 : 23
            adjustedEndTime = formatTime(
              adjustedHour,
              eventEndComponents.minute,
            )
          }
        }
      }

      const ticketData = {
        name: ticketName,
        capacity: ticketCapacity,
        type: ticketType,
        price: ticketType === 'Free' ? undefined : ticketPrice,
        saleStart: saleStartDate,
        saleEnd: adjustedSaleEndDate, // Use adjusted date
        startTime,
        endTime: adjustedEndTime, // Use adjusted time
        minPerOrder,
        maxPerOrder,
        updateTotalCapacity: true,
      }

      const newTicket = await createTicket(eventId, ticketData)

      // Update tickets list
      setTickets((prev) => [...prev, newTicket])

      // Update total capacity
      setTotalCapacity((prev) => prev + ticketCapacity)

      // Mark tickets step as completed
      markStepCompleted('tickets')

      closeAllDialogs()
      toast.success('Ticket created successfully')
    } catch (error) {
      console.error('Error adding ticket:', error)
      toast.error('Failed to add ticket')
    }
  }, [
    closeAllDialogs,
    eventEndTime,
    eventId,
    formState,
    markStepCompleted,
    parsedEventDate,
  ])

  // Handle updating ticket
  const handleUpdateTicket = useCallback(async () => {
    try {
      if (!currentTicket) return

      const {
        ticketName,
        ticketCapacity,
        ticketType,
        ticketPrice,
        saleStartDate,
        saleEndDate,
        startTime,
        endTime,
        minPerOrder,
        maxPerOrder,
      } = formState

      // Validate form
      if (!ticketName) {
        toast.error('Ticket name is required')
        return
      }

      if (!saleStartDate || !saleEndDate) {
        toast.error('Sale start and end dates are required')
        return
      }

      // Automatically adjust sale end date and time to be valid
      let adjustedSaleEndDate = new Date(saleEndDate)
      let adjustedEndTime = endTime

      // If we have event date, ensure sale ends on or before event date
      if (parsedEventDate) {
        if (adjustedSaleEndDate > parsedEventDate) {
          toast.info('Adjusting sale end date to match event date')
          adjustedSaleEndDate = new Date(parsedEventDate)
        }

        // If on the same day as the event, ensure end time is before event
        if (
          adjustedSaleEndDate.toDateString() === parsedEventDate.toDateString()
        ) {
          const endTimeComponents = getTimeComponents(endTime)
          const eventEndComponents = getTimeComponents(eventEndTime)

          // If ticket sale ends after or too close to event start, adjust it
          if (endTimeComponents.hour >= eventEndComponents.hour - 1) {
            // Set to 1 hour before event end time
            const adjustedHour =
              eventEndComponents.hour > 0 ? eventEndComponents.hour - 1 : 23
            adjustedEndTime = formatTime(
              adjustedHour,
              eventEndComponents.minute,
            )
            toast.info('Adjusting sale end time to 1 hour before event')
          }
        }
      }

      // Ensure all required fields are included
      const ticketData: Partial<TicketFormData> = {
        name: ticketName,
        capacity: ticketCapacity,
        type: ticketType,
        price: ticketType === 'Free' ? undefined : ticketPrice,
        saleStart: saleStartDate,
        saleEnd: adjustedSaleEndDate, // Use adjusted date
        startTime,
        endTime: adjustedEndTime, // Use adjusted time
        minPerOrder,
        maxPerOrder,
        updateTotalCapacity: true,
      }

      const updatedTicket = await updateTicket(
        eventId,
        currentTicket.id,
        ticketData,
      )

      // Update tickets list
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === currentTicket.id ? updatedTicket : ticket,
        ),
      )

      // Calculate capacity difference for total capacity update
      const capacityDiff = ticketCapacity - currentTicket.capacity
      setTotalCapacity((prev) => prev + capacityDiff)

      closeAllDialogs()
      toast.success('Ticket updated successfully')
    } catch (error) {
      console.error('Error updating ticket:', error)
      toast.error('Failed to update ticket')
    }
  }, [
    closeAllDialogs,
    currentTicket,
    eventEndTime,
    eventId,
    formState,
    parsedEventDate,
  ])

  // Handle delete ticket
  const handleDeleteTicket = useCallback(async () => {
    try {
      if (!currentTicket) return

      await deleteTicket(eventId, currentTicket.id)

      // Update tickets list
      setTickets((prev) =>
        prev.filter((ticket) => ticket.id !== currentTicket.id),
      )

      // Update total capacity
      setTotalCapacity((prev) => prev - currentTicket.capacity)

      closeAllDialogs()
      toast.success('Ticket deleted successfully')
    } catch (error) {
      console.error('Error deleting ticket:', error)
      toast.error('Failed to delete ticket')
    }
  }, [closeAllDialogs, currentTicket, eventId])

  // Handle update capacity
  const handleUpdateCapacity = useCallback(async () => {
    try {
      await getEventById(eventId)
      closeAllDialogs()
      toast.success('Event capacity updated successfully')
    } catch (error) {
      console.error('Error updating capacity:', error)
      toast.error('Failed to update capacity')
    }
  }, [closeAllDialogs, eventId])

  // Memoize date formatting functions
  const formatTicketDate = useCallback((date: Date) => {
    return format(new Date(date), 'MMM dd, yyyy')
  }, [])

  const formatEventDate = useCallback(
    (date: string | Date | undefined): string => {
      if (!date) return ''
      return new Date(date).toLocaleDateString()
    },
    [],
  )

  // Effects
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Apply edit form values when currentTicket changes
  useEffect(() => {
    if (currentTicket && activeDialog === 'edit') {
      dispatch({ type: 'SET_FOR_EDIT', payload: { ticket: currentTicket } })
    }
  }, [currentTicket, activeDialog])

  // Memoize the max possible sale end date (event date) for UI feedback
  const maxSaleEndDate = useMemo(() => {
    return parsedEventDate || undefined
  }, [parsedEventDate])

  return {
    // Main state
    activeTab,
    tickets,
    totalCapacity,
    event,
    loading,
    error,

    // Dialog states
    isEditDialogOpen: activeDialog === 'edit',
    isCapacityDialogOpen: activeDialog === 'capacity',
    isAddDialogOpen: activeDialog === 'add',
    isDeleteDialogOpen: activeDialog === 'delete',
    currentTicket,

    // Form state
    ...formState,

    // Calendar states
    startDateCalendarOpen: activeCalendar === 'start',
    endDateCalendarOpen: activeCalendar === 'end',

    // Additional helper properties
    maxSaleEndDate,
    eventEndTime,

    // Setters
    setActiveTab,
    setIsEditDialogOpen: (open: boolean) =>
      setActiveDialog(open ? 'edit' : null),
    setIsCapacityDialogOpen: (open: boolean) =>
      setActiveDialog(open ? 'capacity' : null),
    setIsAddDialogOpen: (open: boolean) => setActiveDialog(open ? 'add' : null),
    setIsDeleteDialogOpen: (open: boolean) =>
      setActiveDialog(open ? 'delete' : null),
    setCurrentTicket,
    setTicketType: (value: TicketType) => updateField('ticketType', value),
    setTicketName: (value: string) => updateField('ticketName', value),
    setTicketCapacity: (value: number) => updateField('ticketCapacity', value),
    setTicketPrice: (value: number | undefined) =>
      updateField('ticketPrice', value),
    setSaleStartDate: (value: Date | undefined) =>
      updateField('saleStartDate', value),
    setSaleEndDate: (value: Date | undefined) =>
      updateField('saleEndDate', value),
    setStartTime: (value: string) => updateField('startTime', value),
    setEndTime: (value: string) => updateField('endTime', value),
    setMinPerOrder: (value: number) => updateField('minPerOrder', value),
    setMaxPerOrder: (value: number) => updateField('maxPerOrder', value),
    setTotalCapacity,
    setStartDateCalendarOpen: (open: boolean) =>
      setActiveCalendar(open ? 'start' : null),
    setEndDateCalendarOpen: (open: boolean) =>
      setActiveCalendar(open ? 'end' : null),

    // Handlers
    handleAddTicket,
    handleUpdateTicket,
    handleDeleteTicket,
    handleUpdateCapacity,
    resetForm: () =>
      dispatch({ type: 'RESET_FORM', payload: { eventDate: parsedEventDate } }),
    formatTicketDate,
    formatEventDate,

    // Utility functions
    generateTimeOptions,
    isEndDateDisabled,

    // Dialog helpers
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    closeAllDialogs,
  }
}
