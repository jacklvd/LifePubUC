/* eslint-disable @typescript-eslint/no-explicit-any */
// store/ticketStore.ts
/**
 * Ticket Store using Zustand
 *
 * For optimal performance, use individual selectors for each piece of state:
 *
 * @example
 * // RECOMMENDED: Use individual selectors
 * const tickets = useTicketStore((state) => state.tickets)
 * const addTicket = useTicketStore((state) => state.addTicket)
 *
 * // AVOID: Using object destructuring with multiple properties
 * // This can cause infinite loops and performance issues
 * const { tickets, addTicket } = useTicketStore((state) => ({
 *   tickets: state.tickets,
 *   addTicket: state.addTicket
 * }))
 *
 * // If you must use object destructuring, use the useShallow middleware from zustand/shallow:
 * // import { shallow } from 'zustand/shallow'
 * // const { tickets, addTicket } = useTicketStore(
 * //   (state) => ({ tickets: state.tickets, addTicket: state.addTicket }),
 * //   shallow
 * // )
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { unstable_batchedUpdates } from 'react-dom'

import {
  getEventTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from '@/lib/actions/ticket-actions'

import { getEventById } from '@/lib/actions/event-actions'

// Helper functions
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

const formatTime = (hour: number, minute: number) => {
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  const hourStr = hour12.toString().padStart(2, '0')
  const minuteStr = minute.toString().padStart(2, '0')
  return `${hourStr}:${minuteStr} ${period}`
}

const generateTimeOptions = (eventEndTime: string) => {
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
}

// Initial state for ticket form
const initialFormState: TicketFormState = {
  ticketType: 'Free',
  ticketName: '',
  ticketCapacity: 100,
  ticketPrice: undefined,
  saleStartDate: new Date(),
  saleEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  startTime: '08:00 AM',
  endTime: '05:00 PM',
  minPerOrder: 1,
  maxPerOrder: 10,
}

/**
 * Ticket Store using Zustand
 *
 * For optimal performance, use individual selectors for each piece of state:
 *
 * @example
 * // RECOMMENDED: Use individual selectors
 * const tickets = useTicketStore((state) => state.tickets)
 * const addTicket = useTicketStore((state) => state.addTicket)
 *
 * // AVOID: Using object destructuring with multiple properties
 * // This can cause infinite loops and performance issues
 * const { tickets, addTicket } = useTicketStore((state) => ({
 *   tickets: state.tickets,
 *   addTicket: state.addTicket
 * }))
 *
 * // If you must use object destructuring, use the useShallow middleware from zustand/shallow:
 * // import { shallow } from 'zustand/shallow'
 * // const { tickets, addTicket } = useTicketStore(
 * //   (state) => ({ tickets: state.tickets, addTicket: state.addTicket }),
 * //   shallow
 * // )
 */

// Define selector types to ensure type safety
// type TicketStoreSelector<T> = (state: TicketState) => T

// Create the store with suggested usage patterns for performance
export const useTicketStore = create<TicketState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // UI State
        activeTab: 'admission',
        activeDialog: null,
        activeCalendar: null,

        // Data State
        eventId: null,
        tickets: [],
        totalCapacity: 0,
        event: null,
        loading: true,
        error: null,
        currentTicket: null,
        timeOptions: [],
        isSubmitting: false,

        // Form State
        form: { ...initialFormState },

        // Initialize store with event data
        initialize: async (eventId, userEmail, markStepCompleted) => {
          if (!eventId) {
            set((state) => {
              state.error = 'Event ID is required'
              state.loading = false
            })
            return
          }

          try {
            set((state) => {
              state.loading = true
              state.eventId = eventId
              state.error = null
            })

            // Fetch event details
            const eventData = await getEventById(eventId, userEmail)
            if (!eventData || eventData.error) {
              set((state) => {
                state.error = eventData?.error || 'Event not found'
                state.loading = false
              })
              return
            }

            // Fetch tickets
            const ticketsData = await getEventTickets(eventId)

            // Calculate event end time
            const eventEndTime =
              eventData.endTime || eventData.time || '11:59 PM'

            // Generate time options
            const options = generateTimeOptions(eventEndTime)

            // Use batched updates for smoother UI updates
            unstable_batchedUpdates(() => {
              set((state) => {
                state.event = eventData
                state.tickets = ticketsData.tickets || []
                state.totalCapacity = ticketsData.totalCapacity || 0
                state.timeOptions = options
                state.loading = false
              })

              // Mark tickets step as completed if tickets exist
              if (ticketsData.tickets?.length > 0) {
                markStepCompleted('tickets')
              }
            })
          } catch (error: any) {
            console.error('Error initializing ticket store:', error)
            set((state) => {
              state.error = error?.message || 'Failed to load event data'
              state.loading = false
            })
          }
        },

        // Set active tab
        setActiveTab: (tab) =>
          set((state) => {
            state.activeTab = tab
          }),

        // Dialog & Calendar Controls
        openAddDialog: () => {
          set((state) => {
            state.currentTicket = null
            state.activeDialog = 'add'
            state.activeCalendar = null
          })
          get().resetFormForAdd()
        },

        openEditDialog: (ticket) => {
          set((state) => {
            state.currentTicket = ticket
            state.activeDialog = 'edit'
            state.activeCalendar = null
          })
          get().setFormForEdit(ticket)
        },

        openDeleteDialog: (ticket) =>
          set((state) => {
            state.currentTicket = ticket
            state.activeDialog = 'delete'
          }),

        closeAllDialogs: () =>
          set((state) => {
            state.activeDialog = null
            state.activeCalendar = null
          }),

        setCalendar: (calendar) =>
          set((state) => {
            state.activeCalendar = calendar
          }),

        // Form Updates
        updateFormField: (field, value) =>
          set((state) => {
            state.form[field] = value
          }),

        resetFormForAdd: () => {
          const { event } = get()
          const today = new Date()
          let endDate = new Date()
          let endTime = '05:00 PM' // Default end time

          // Handle event date and time if available
          if (event?.date) {
            // Set end date to the event day
            endDate = new Date(event.date)

            // Ensure the end date isn't after the event date
            if (endDate > new Date(event.date)) {
              endDate = new Date(event.date)
            }

            // If event has an end time, use it (minus 1 hour)
            const eventEndTime = event.endTime || '11:59 PM'
            if (eventEndTime) {
              const { hour, minute } = getTimeComponents(eventEndTime)

              // Set end time to 1 hour before event end time
              const adjustedHour = hour > 0 ? hour - 1 : 23
              endTime = formatTime(adjustedHour, minute)
            }
          } else {
            endDate.setDate(endDate.getDate() + 30) // Default to 30 days later if no event date
          }

          // Ensure the start date isn't after the event date either
          let startDate = today
          if (event?.date && startDate > new Date(event.date)) {
            startDate = new Date(event.date)
          }

          set((state) => {
            state.form = {
              ...initialFormState,
              saleStartDate: startDate,
              saleEndDate: endDate,
              endTime,
            }
          })
        },

        setFormForEdit: (ticket) => {
          const { event } = get()

          // Start with the ticket's current values
          let saleStartDate = new Date(ticket.saleStart)

          // If we have event data, ensure the sale start date is valid
          if (event?.date) {
            const eventDate = new Date(event.date)

            // Ensure sale start date is not after event date
            if (saleStartDate > eventDate) {
              saleStartDate = eventDate
            }
          }

          const formData = {
            ticketType: ticket.type,
            ticketName: ticket.name,
            ticketCapacity: ticket.capacity,
            ticketPrice: ticket.price,
            saleStartDate: saleStartDate,
            saleEndDate: new Date(ticket.saleEnd),
            startTime: ticket.startTime,
            endTime: ticket.endTime,
            minPerOrder: ticket.minPerOrder || 1,
            maxPerOrder: ticket.maxPerOrder || 10,
          }

          // If we have event data, ensure the sale end date/time is valid
          if (event?.date) {
            const eventDate = new Date(event.date)

            // Ensure sale end date is not after event date
            if (formData.saleEndDate > eventDate) {
              formData.saleEndDate = eventDate
            }

            // Adjust end time if needed
            const eventEndTime = event.endTime || '11:59 PM'
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
                formData.endTime = formatTime(adjustedHour, minute)
              }
            }
          }

          set((state) => {
            state.form = formData
          })
        },

        // CRUD Operations
        addTicket: async () => {
          const { eventId, form, event } = get()

          try {
            if (!eventId) {
              toast.error('Event ID is missing')
              return
            }

            // Set submitting state
            set((state) => {
              state.isSubmitting = true
            })

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
            } = form

            // Validate form
            if (!ticketName) {
              toast.error('Ticket name is required')
              set((state) => {
                state.isSubmitting = false
              })
              return
            }

            if (!saleStartDate || !saleEndDate) {
              toast.error('Sale start and end dates are required')
              set((state) => {
                state.isSubmitting = false
              })
              return
            }

            // Automatically ensure sale end date and time are valid
            let adjustedSaleEndDate = new Date(saleEndDate)
            let adjustedEndTime = endTime

            // If we have event date, ensure sale ends on or before event date
            if (event?.date) {
              const eventDate = new Date(event.date)
              if (adjustedSaleEndDate > eventDate) {
                adjustedSaleEndDate = new Date(eventDate)
              }

              // If on the same day as the event, ensure end time is before event
              if (
                adjustedSaleEndDate.toDateString() === eventDate.toDateString()
              ) {
                const eventEndTime = event.endTime || '11:59 PM'
                const endTimeComponents = getTimeComponents(endTime)
                const eventEndComponents = getTimeComponents(eventEndTime)

                // If ticket sale ends after event starts, adjust it
                if (endTimeComponents.hour >= eventEndComponents.hour - 1) {
                  // Set to 1 hour before event end time
                  const adjustedHour =
                    eventEndComponents.hour > 0
                      ? eventEndComponents.hour - 1
                      : 23
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

            // Use batched updates for smoother UI
            unstable_batchedUpdates(() => {
              set((state) => {
                state.tickets.push(newTicket)
                state.totalCapacity += ticketCapacity
                state.isSubmitting = false
                state.activeDialog = null // Close dialog after successful submission
              })

              toast.success('Ticket created successfully')
            })
          } catch (error) {
            console.error('Error adding ticket:', error)
            toast.error('Failed to add ticket')
            set((state) => {
              state.isSubmitting = false
            })
          }
        },

        updateTicket: async () => {
          const { eventId, form, currentTicket, event } = get()

          try {
            if (!eventId || !currentTicket) {
              toast.error('Missing required data')
              return
            }

            // Set submitting state
            set((state) => {
              state.isSubmitting = true
            })

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
            } = form

            // Validate form
            if (!ticketName) {
              toast.error('Ticket name is required')
              set((state) => {
                state.isSubmitting = false
              })
              return
            }

            if (!saleStartDate || !saleEndDate) {
              toast.error('Sale start and end dates are required')
              set((state) => {
                state.isSubmitting = false
              })
              return
            }

            // Automatically adjust sale end date and time to be valid
            let adjustedSaleEndDate = new Date(saleEndDate)
            let adjustedEndTime = endTime

            // If we have event date, ensure sale ends on or before event date
            if (event?.date) {
              const eventDate = new Date(event.date)
              if (adjustedSaleEndDate > eventDate) {
                toast.info('Adjusting sale end date to match event date')
                adjustedSaleEndDate = new Date(eventDate)
              }

              // If on the same day as the event, ensure end time is before event
              if (
                adjustedSaleEndDate.toDateString() === eventDate.toDateString()
              ) {
                const eventEndTime = event.endTime || '11:59 PM'
                const endTimeComponents = getTimeComponents(endTime)
                const eventEndComponents = getTimeComponents(eventEndTime)

                // If ticket sale ends after or too close to event start, adjust it
                if (endTimeComponents.hour >= eventEndComponents.hour - 1) {
                  // Set to 1 hour before event end time
                  const adjustedHour =
                    eventEndComponents.hour > 0
                      ? eventEndComponents.hour - 1
                      : 23
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

            // Calculate capacity difference
            const capacityDiff = ticketCapacity - currentTicket.capacity

            // Use batched updates for smoother UI
            unstable_batchedUpdates(() => {
              set((state) => {
                // Update ticket in array
                const index = state.tickets.findIndex(
                  (t) => t.id === currentTicket.id,
                )
                if (index !== -1) {
                  state.tickets[index] = updatedTicket
                }

                // Update total capacity
                state.totalCapacity += capacityDiff
                state.isSubmitting = false
                state.activeDialog = null // Close dialog after successful submission
              })

              toast.success('Ticket updated successfully')
            })
          } catch (error) {
            console.error('Error updating ticket:', error)
            toast.error('Failed to update ticket')
            set((state) => {
              state.isSubmitting = false
            })
          }
        },

        deleteTicket: async () => {
          const { eventId, currentTicket } = get()

          try {
            if (!eventId || !currentTicket) {
              toast.error('Missing required data')
              return
            }

            // Set submitting state
            set((state) => {
              state.isSubmitting = true
            })

            await deleteTicket(eventId, currentTicket.id)

            // Use batched updates for smoother UI
            unstable_batchedUpdates(() => {
              set((state) => {
                // Remove ticket from array
                state.tickets = state.tickets.filter(
                  (t) => t.id !== currentTicket.id,
                )
                // Update total capacity
                state.totalCapacity -= currentTicket.capacity
                state.isSubmitting = false
                state.activeDialog = null // Close dialog after successful deletion
              })

              toast.success('Ticket deleted successfully')
            })
          } catch (error) {
            console.error('Error deleting ticket:', error)
            toast.error('Failed to delete ticket')
            set((state) => {
              state.isSubmitting = false
            })
          }
        },

        updateCapacity: async () => {
          const { eventId } = get()

          try {
            if (!eventId) {
              toast.error('Event ID is missing')
              return
            }

            // Set submitting state
            set((state) => {
              state.isSubmitting = true
            })

            await getEventById(eventId)

            set((state) => {
              state.isSubmitting = false
              state.activeDialog = null // Close dialog after successful update
            })

            toast.success('Event capacity updated successfully')
          } catch (error) {
            console.error('Error updating capacity:', error)
            toast.error('Failed to update capacity')
            set((state) => {
              state.isSubmitting = false
            })
          }
        },

        // Form Validation
        isEndDateDisabled: (date) => {
          const { event } = get()
          if (!event?.date) return false

          const eventDate = new Date(event.date)
          return date > eventDate
        },

        isStartDateDisabled: (date) => {
          const { event, form } = get()

          // First check: Make sure the date isn't after the event date
          if (event?.date) {
            const eventDate = new Date(event.date)
            if (date > eventDate) {
              return true // Disable date if it's after the event date
            }
          }

          // Second check: Make sure the date isn't after or equal to the day before sale end date (if set)
          if (form.saleEndDate) {
            // Create a new date that's one day before the end date
            const minimumGapDate = new Date(form.saleEndDate)
            minimumGapDate.setDate(minimumGapDate.getDate() - 1)

            // Compare dates without considering time
            const dateWithoutTime = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
            )
            const minimumGapWithoutTime = new Date(
              minimumGapDate.getFullYear(),
              minimumGapDate.getMonth(),
              minimumGapDate.getDate(),
            )

            // Disable the date if it's on or after the calculated minimum gap date
            if (dateWithoutTime >= minimumGapWithoutTime) {
              return true
            }
          }

          // If we passed all checks, this date is selectable
          return false
        },

        // Validate date against event date
        isDateAfterEvent: (date) => {
          const { event } = get()
          if (!event?.date) return false

          // Create a new date object from the event date
          const eventDate = new Date(event.date)

          // Compare the dates
          return date > eventDate
        },

        // Formatters
        formatTicketDate: (date) => format(new Date(date), 'MMM dd, yyyy'),
      })),
      {
        name: 'ticket-store',
        partialize: (state) => ({
          // Only persist selected state properties
          activeTab: state.activeTab,
          // Don't persist loading, errors, or other transient state
        }),
      },
    ),
  ),
)
