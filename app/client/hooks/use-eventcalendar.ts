// hooks/use-eventcalendar.ts
import { useRef, useCallback, useMemo, useEffect } from 'react'
import useEventStore from '@/store/eventStore'

// This hook manages calendar state and logic, leveraging our Zustand store
export const useEventCalendar = (events: Event[] = []) => {
  // Reference for the week view container
  const weekContainerRef = useRef<HTMLDivElement>(null)

  // Get calendar state from Zustand store
  const {
    // State
    calendarView: view,
    date,
    weekDays,
    selectedEvent,
    popupPosition,
    showMonthSelector,

    // Actions
    setEvents,
    setCalendarView: setView,
    setDate,
    setSelectedEvent,
    setPopupPosition,
    setShowMonthSelector,
    prevPeriod,
    nextPeriod,
    goToToday,
    getEventsForDate,
  } = useEventStore()

  // Update events in store when they change
  useEffect(() => {
    // Only update if events actually changed
    setEvents(events)
  }, [events, setEvents])

  // Month names
  const months = useMemo(
    () => [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    [],
  )

  const fullMonths = useMemo(
    () => [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    [],
  )

  // Calculate week view title
  const getWeekViewTitle = useCallback(() => {
    if (!weekDays || weekDays.length === 0) return ''

    const startDate = weekDays[0]
    const endDate = weekDays[weekDays.length - 1]

    if (startDate.month === endDate.month) {
      return `${fullMonths[startDate.month]} ${startDate.date} - ${endDate.date}, ${startDate.year}`
    } else {
      return `${fullMonths[startDate.month]} ${startDate.date} - ${fullMonths[endDate.month]} ${endDate.date}, ${endDate.year}`
    }
  }, [weekDays, fullMonths])

  // Handle event click with position calculation
  const handleEventClick = useCallback(
    (event: Event, e: React.MouseEvent) => {
      e.stopPropagation()

      // Get click position for popup
      let top = e.clientY
      let left = e.clientX

      // Adjust position to ensure popup stays in viewport
      if (typeof window !== 'undefined') {
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth

        // Ensure popup doesn't go off bottom edge
        if (top + 350 > viewportHeight) {
          top = viewportHeight - 350
        }

        // Ensure popup doesn't go off right edge
        if (left + 300 > viewportWidth) {
          left = viewportWidth - 300
        }
      }

      setSelectedEvent(event)
      setPopupPosition({ top, left })
    },
    [setSelectedEvent, setPopupPosition],
  )

  return {
    // State
    view,
    date,
    weekDays,
    selectedEvent,
    popupPosition,
    showMonthSelector,
    weekContainerRef,

    // Month/day names
    months,
    fullMonths,

    // Calculated values
    getWeekViewTitle,

    // Actions
    setView,
    setDate,
    setSelectedEvent,
    setShowMonthSelector,
    prevPeriod,
    nextPeriod,
    goToToday,
    handleEventClick,
    getEventsForDate,
  }
}

export default useEventCalendar
