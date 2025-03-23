'use client'
import React, { useRef, useCallback } from 'react'
import { CalendarHeader } from './calendar-header'
import { MonthView } from './month-view'
import { WeekView } from './week-view'
import CalendarEventPopup from './event-calendar-popup'
import useEventStore from '@/store/useEventStore'

interface EventCalendarProps {
  events: Event[]
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events = [] }) => {
  // Reference for the week view container
  const weekContainerRef = useRef<HTMLDivElement>(null)

  // Get calendar state from Zustand store
  const {
    calendarView: view,
    date,
    weekDays,
    selectedEvent,
    popupPosition,
    showMonthSelector,
    setCalendarView: setView,
    setDate,
    setSelectedEvent,
    setShowMonthSelector,
    setPopupPosition,
    prevPeriod,
    nextPeriod,
    goToToday,
    getEventsForDate,
  } = useEventStore()

  // Handler for event clicks
  const handleEventClick = useCallback(
    (event: Event, e: React.MouseEvent) => {
      e.stopPropagation()

      // Calculate best position for popup based on click and viewport
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Default position is at click location
      let top = e.clientY
      let left = e.clientX

      // For mobile, we'll position in center (handled by the popup component)
      if (viewportWidth >= 640) {
        // On desktop/tablet, position near click but ensure it's in viewport
        // Popup width is approximately 288px (18rem) and height varies (~350px)
        const popupWidth = 288
        const estimatedPopupHeight = 350

        // Adjust if too close to right edge
        if (left + popupWidth + 20 > viewportWidth) {
          left = Math.max(20, left - popupWidth)
        }

        // Adjust if too close to bottom edge
        if (top + estimatedPopupHeight + 20 > viewportHeight) {
          top = Math.max(20, viewportHeight - estimatedPopupHeight - 20)
        }
      }

      setSelectedEvent(event)
      setPopupPosition({ top, left })
    },
    [setSelectedEvent, setPopupPosition],
  )

  // Function to close popup
  const closePopup = useCallback(() => {
    setSelectedEvent(null)
  }, [setSelectedEvent])

  // Get month names for CalendarHeader
  const months = [
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
  ]
  const fullMonths = [
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
  ]

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

  return (
    <div className="relative">
      <CalendarHeader
        view={view}
        date={date}
        showMonthSelector={showMonthSelector}
        months={months}
        fullMonths={fullMonths}
        weekViewTitle={getWeekViewTitle()}
        setView={setView}
        prevPeriod={prevPeriod}
        nextPeriod={nextPeriod}
        goToToday={goToToday}
        setShowMonthSelector={setShowMonthSelector}
        setDate={setDate}
      />

      {view === 'month' ? (
        <MonthView
          date={date}
          getEventsForDate={getEventsForDate}
          handleEventClick={handleEventClick}
        />
      ) : (
        <WeekView
          weekDays={weekDays}
          weekContainerRef={weekContainerRef}
          getEventsForDate={getEventsForDate}
          handleEventClick={handleEventClick}
        />
      )}

      {/* Event Popup */}
      {selectedEvent && (
        <CalendarEventPopup
          event={selectedEvent}
          onClose={closePopup}
          position={popupPosition || undefined}
        />
      )}
    </div>
  )
}

export default React.memo(EventCalendar)
