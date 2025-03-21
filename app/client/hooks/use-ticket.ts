/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-ticket.ts
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { toast } from 'sonner'
import { getEventById } from '@/lib/actions/event-action'
import {
  getEventTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from '@/lib/actions/ticket-actions'
import { EventStep } from '@/components/event-ui/event-leftside-bar' // Import the EventStep type
import { format } from 'date-fns'

export const useTicketManagement = (
  eventId: string,
  markStepCompleted: (step: EventStep) => void,
) => {
  const [activeTab, setActiveTab] = useState('admission')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [totalCapacity, setTotalCapacity] = useState(0)
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCapacityDialogOpen, setIsCapacityDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [startDateCalendarOpen, setStartDateCalendarOpen] = useState(false)
  const [endDateCalendarOpen, setEndDateCalendarOpen] = useState(false)

  // Form states
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const [ticketType, setTicketType] = useState<'Free' | 'Paid' | 'Donation'>(
    'Free',
  )
  const [ticketName, setTicketName] = useState('')
  const [ticketCapacity, setTicketCapacity] = useState(100)
  const [ticketPrice, setTicketPrice] = useState<number | undefined>(undefined)
  const [saleStartDate, setSaleStartDate] = useState<Date | undefined>(
    new Date(),
  )
  const [saleEndDate, setSaleEndDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState('08:00 AM')
  const [endTime, setEndTime] = useState('05:00 PM')
  const [minPerOrder, setMinPerOrder] = useState(1)
  const [maxPerOrder, setMaxPerOrder] = useState(10)

  // Refs for tracking initialization
  const dataFetchedRef = useRef(false)
  const formInitializedRef = useRef(false)

  const generateTimeOptions = useMemo(() => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const h = hour % 12 || 12
        const period = hour < 12 ? 'AM' : 'PM'
        const formattedHour = h.toString().padStart(2, '0')
        const formattedMinute = minute.toString().padStart(2, '0')
        const time = `${formattedHour}:${formattedMinute} ${period}`
        options.push(time)
      }
    }
    return options
  }, [])

  const parsedEventDate = useMemo(() => {
    if (event && event.date) {
      return new Date(event.date)
    }
    return undefined
  }, [event])

  // Fetch event and tickets data

  const fetchData = useCallback(async () => {
    if (dataFetchedRef.current) return

    try {
      setLoading(true)

      // Fetch event details
      const eventData = await getEventById(eventId)
      setEvent(eventData)

      // Fetch tickets
      const ticketsData = await getEventTickets(eventId)
      setTickets(ticketsData.tickets || [])
      setTotalCapacity(ticketsData.totalCapacity || 0)

      // If tickets exist, mark tickets step as completed
      if (ticketsData.tickets && ticketsData.tickets.length > 0) {
        markStepCompleted('tickets')
      }

      dataFetchedRef.current = true
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load event data')
    } finally {
      setLoading(false)
    }
  }, [eventId, markStepCompleted])

  // Reset form when opening add dialog
  //   const resetForm = useCallback(() => {
  //     console.log('Resetting form');
  //     setTicketType("Free");
  //     setTicketName("");
  //     setTicketCapacity(100);
  //     setTicketPrice(undefined);

  //     // Create new Date objects to ensure they trigger proper re-renders
  //     const today = new Date();
  //     console.log('Setting start date to:', today);
  //     setSaleStartDate(today);

  //     if (parsedEventDate) {
  //       const dayBefore = new Date(parsedEventDate);
  //       dayBefore.setDate(dayBefore.getDate() - 1);
  //       console.log('Setting end date to:', dayBefore);
  //       setSaleEndDate(dayBefore);
  //     } else {
  //       const futureDate = new Date();
  //       futureDate.setDate(futureDate.getDate() + 30);
  //       console.log('Setting end date to:', futureDate);
  //       setSaleEndDate(futureDate);
  //     }

  //     setStartTime("08:00 AM");
  //     setEndTime("05:00 PM");
  //     setMinPerOrder(1);
  //     setMaxPerOrder(10);
  //   }, [parsedEventDate]);

  const resetForm = useCallback(() => {
    console.log('Resetting form')

    // Use setTimeout to break potential render cycles
    setTimeout(() => {
      setTicketType('Free')
      setTicketName('')
      setTicketCapacity(100)
      setTicketPrice(undefined)

      // Force new date objects with current timestamps
      const now = Date.now()
      const today = new Date(now)
      const futureDate = parsedEventDate
        ? new Date(
            Math.min(parsedEventDate.getTime() - 86400000, now + 2592000000),
          )
        : new Date(now + 2592000000)

      console.log('Setting dates to:', today, futureDate)
      setSaleStartDate(today)
      setSaleEndDate(futureDate)

      setStartTime('08:00 AM')
      setEndTime('05:00 PM')
      setMinPerOrder(1)
      setMaxPerOrder(10)
    }, 0)
  }, [parsedEventDate])

  //   const openAddDialog = useCallback(() => {
  //     // First close any other open dialogs to prevent conflicts
  //     setIsEditDialogOpen(false);
  //     setIsDeleteDialogOpen(false);
  //     setIsCapacityDialogOpen(false);

  //     // Reset form with a slight delay to ensure UI has updated
  //     setTimeout(() => {
  //       resetForm();
  //       // Use a short delay before opening the dialog
  //       setTimeout(() => {
  //         console.log("Opening add dialog with dates:", saleStartDate, saleEndDate);
  //         setIsAddDialogOpen(true);
  //       }, 50);
  //     }, 50);
  //   }, [resetForm]);

  const isEndDateDisabled = useCallback(
    (date: Date) => {
      if (!event || !event.date) return false
      const eventDate = new Date(event.date)
      return date > eventDate
    },
    [event],
  )

  // Set form values when editing a ticket
  const setFormForEdit = useCallback(() => {
    if (!currentTicket) return

    console.log('Setting form for edit with ticket:', currentTicket)
    setTicketType(currentTicket.type)
    setTicketName(currentTicket.name)
    setTicketCapacity(currentTicket.capacity)
    setTicketPrice(currentTicket.price)

    // Create new Date objects to ensure they trigger proper re-renders
    const startDate = new Date(currentTicket.saleStart)
    const endDate = new Date(currentTicket.saleEnd)

    console.log('Setting edit dates:', startDate, endDate)
    setSaleStartDate(startDate)
    setSaleEndDate(endDate)

    setStartTime(currentTicket.startTime)
    setEndTime(currentTicket.endTime)
    setMinPerOrder(currentTicket.minPerOrder || 1)
    setMaxPerOrder(currentTicket.maxPerOrder || 10)
  }, [currentTicket])

  // Handle form submission for adding a ticket
  const handleAddTicket = useCallback(async () => {
    try {
      console.log(
        'Add ticket submission with dates:',
        saleStartDate,
        saleEndDate,
      )

      if (!ticketName) {
        toast.error('Ticket name is required')
        return
      }

      if (!saleStartDate || !saleEndDate) {
        toast.error('Sale start and end dates are required')
        return
      }

      // Ensure sale end date is not after event date
      if (parsedEventDate && saleEndDate > parsedEventDate) {
        toast.error('Sale end date cannot be after the event date')
        return
      }

      const ticketData = {
        name: ticketName,
        capacity: ticketCapacity,
        type: ticketType,
        price: ticketType === 'Free' ? undefined : ticketPrice,
        saleStart: saleStartDate,
        saleEnd: saleEndDate,
        startTime,
        endTime,
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

      setIsAddDialogOpen(false)
      toast.success('Ticket created successfully')
    } catch (error) {
      console.error('Error adding ticket:', error)
      toast.error('Failed to add ticket')
    }
  }, [
    eventId,
    parsedEventDate,
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
    markStepCompleted,
  ])

  // Handle updating ticket

  const handleUpdateTicket = useCallback(async () => {
    try {
      if (!currentTicket) return

      if (!ticketName) {
        toast.error('Ticket name is required')
        return
      }

      if (!saleStartDate || !saleEndDate) {
        toast.error('Sale start and end dates are required')
        return
      }

      // Ensure sale end date is not after event date
      if (event && event.date) {
        const eventDate = new Date(event.date)
        if (saleEndDate > eventDate) {
          toast.error('Sale end date cannot be after the event date')
          return
        }
      }

      // Ensure all required fields are included
      const ticketData: Partial<TicketFormData> = {
        name: ticketName,
        capacity: ticketCapacity,
        type: ticketType,
        price: ticketType === 'Free' ? undefined : ticketPrice,
        saleStart: saleStartDate,
        saleEnd: saleEndDate,
        startTime,
        endTime,
        minPerOrder,
        maxPerOrder,
        updateTotalCapacity: true,
      }

      console.log('Updating ticket with data:', ticketData)

      const updatedTicket = await updateTicket(
        eventId,
        currentTicket.id,
        ticketData,
      )

      // Update tickets list
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === currentTicket.id ? updatedTicket : ticket,
      )

      setTickets(updatedTickets)

      // Calculate capacity difference for total capacity update
      const capacityDiff = ticketCapacity - currentTicket.capacity
      setTotalCapacity((prev) => prev + capacityDiff)

      setIsEditDialogOpen(false)
      toast.success('Ticket updated successfully')
    } catch (error) {
      console.error('Error updating ticket:', error)
      toast.error('Failed to update ticket')
    }
  }, [
    currentTicket,
    eventId,
    event,
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
    tickets,
  ])

  // Handle delete ticket
  const handleDeleteTicket = useCallback(async () => {
    try {
      if (!currentTicket) return

      await deleteTicket(eventId, currentTicket.id)

      // Update tickets list
      const filteredTickets = tickets.filter(
        (ticket) => ticket.id !== currentTicket.id,
      )
      setTickets(filteredTickets)

      // Update total capacity
      setTotalCapacity((prev) => prev - currentTicket.capacity)

      setIsDeleteDialogOpen(false)
      toast.success('Ticket deleted successfully')
    } catch (error) {
      console.error('Error deleting ticket:', error)
      toast.error('Failed to delete ticket')
    }
  }, [currentTicket, eventId, tickets])

  // Handle update capacity
  const handleUpdateCapacity = useCallback(async () => {
    try {
      await getEventById(eventId)
      setIsCapacityDialogOpen(false)
      toast.success('Event capacity updated successfully')
    } catch (error) {
      console.error('Error updating capacity:', error)
      toast.error('Failed to update capacity')
    }
  }, [eventId])

  // Optimized useEffects
  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (isAddDialogOpen && !formInitializedRef.current) {
      resetForm()
      formInitializedRef.current = true
    } else if (!isAddDialogOpen) {
      // Reset the ref when dialog closes
      formInitializedRef.current = false
    }
  }, [isAddDialogOpen, resetForm])

  useEffect(() => {
    if (currentTicket && isEditDialogOpen) {
      setFormForEdit()
    }
  }, [currentTicket, isEditDialogOpen, setFormForEdit])

  // Utility function to format ticket dates
  const formatTicketDate = useMemo(
    () => (date: Date) => {
      return format(new Date(date), 'MMM dd, yyyy')
    },
    [],
  )

  const formatEventDate = useMemo(
    () =>
      (date: string | Date | undefined): string => {
        if (!date) return ''
        return new Date(date).toLocaleDateString()
      },
    [],
  )

  //   useEffect(() => {
  //     if (isAddDialogOpen) {
  //       // Always reset the form when the dialog opens
  //       resetForm();
  //     //   console.log('Add dialog opened, dates are:', saleStartDate, saleEndDate);
  //     }
  //   }, [isAddDialogOpen, resetForm]);

  return {
    // State
    activeTab,
    tickets,
    totalCapacity,
    event,
    loading,
    isEditDialogOpen,
    isCapacityDialogOpen,
    isAddDialogOpen,
    isDeleteDialogOpen,
    currentTicket,
    ticketType,
    ticketName,
    ticketCapacity,
    ticketPrice,
    saleStartDate,
    saleEndDate,
    startTime,
    endTime,
    minPerOrder,
    maxPerOrder,

    // Setters
    setActiveTab,
    setIsEditDialogOpen,
    setIsCapacityDialogOpen,
    setIsAddDialogOpen,
    setIsDeleteDialogOpen,
    setCurrentTicket,
    setTicketType,
    setTicketName,
    setTicketCapacity,
    setTicketPrice,
    setSaleStartDate,
    setSaleEndDate,
    setStartTime,
    setEndTime,
    setMinPerOrder,
    setMaxPerOrder,
    setTotalCapacity,

    // Handlers
    handleAddTicket,
    handleUpdateTicket,
    handleDeleteTicket,
    handleUpdateCapacity,
    resetForm,
    formatTicketDate,
    formatEventDate,

    // Utility functions
    generateTimeOptions,
    // openAddDialog

    startDateCalendarOpen,
    setStartDateCalendarOpen,
    endDateCalendarOpen,
    setEndDateCalendarOpen,
    isEndDateDisabled,
  }
}
