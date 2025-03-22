/* eslint-disable prefer-const */
'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
// import { formatDate } from '@/lib/date-formatter'
import { formatTime, calculateEventPosition } from '@/lib/time-formatter'
import CalendarEventPopup from '@/components/event-ui/event-calendar-popup'

// Define type for the view mode
type ViewType = 'month' | 'week'

// Interface for date state
interface DateState {
  year: number
  month: number
  date: number
}

// Interface for popup position
interface PopupPosition {
  top: number
  left: number
}

// Interface for week day object
interface WeekDay {
  date: number
  month: number
  year: number
  day: string
  fullDate: Date
}

// Props interface for the component
interface EventCalendarProps {
  events: Event[]
}

// Helper function to get days of the month
const getDaysInMonth = (year: number, month: number): number[] => {
  const lastDay = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: lastDay }, (_, i) => i + 1)
}

// Helper function to get previous month days that appear in current view
const getPrevMonthDays = (year: number, month: number): number[] => {
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  return Array.from(
    { length: firstDayOfMonth },
    (_, i) => prevMonthLastDay - firstDayOfMonth + i + 1,
  )
}

// Helper function to get next month days that appear in current view
const getNextMonthDays = (year: number, month: number): number[] => {
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysFromNextMonth = 6 - lastDayOfMonth.getDay()

  return Array.from({ length: daysFromNextMonth }, (_, i) => i + 1)
}

// Helper function to get hours for the day
const getHoursOfDay = (): string[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12
    const period = i < 12 ? 'AM' : 'PM'
    return `${hour}:00 ${period}`
  })
}

// Helper function to check if a date is in the past
const isPastDate = (date: Date): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

// Get color based on event status
const getEventColor = (status?: string): string => {
  switch (status?.toLowerCase()) {
    case 'on sale':
      return 'bg-green-500'
    case 'cancelled':
      return 'bg-red-500'
    case 'draft':
      return 'bg-gray-500'
    default:
      return 'bg-blue-500'
  }
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events = [] }) => {
  const currentDate = new Date()
  const [date, setDate] = useState<DateState>({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    date: currentDate.getDate(),
  })
  const [view, setView] = useState<ViewType>('month')
  const [showMonthSelector, setShowMonthSelector] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [popupPosition, setPopupPosition] = useState<PopupPosition>({
    top: 0,
    left: 0,
  })
  const [weekStartDate, setWeekStartDate] = useState<Date>(new Date())
  const weekContainerRef = useRef<HTMLDivElement>(null)

  // Month names
  const months: string[] = [
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

  const fullMonths: string[] = [
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

  const weekdays: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  // Initialize week start date
  useEffect(() => {
    const today = new Date(date.year, date.month, date.date)
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)
    setWeekStartDate(startOfWeek)
  }, [date.year, date.month, date.date])

  // Navigation functions
  const prevPeriod = (): void => {
    if (view === 'month') {
      setDate((prev) => {
        if (prev.month === 0) {
          return { ...prev, year: prev.year - 1, month: 11 }
        }
        return { ...prev, month: prev.month - 1 }
      })
    } else {
      // Week view - go back 7 days
      const newWeekStart = new Date(weekStartDate)
      newWeekStart.setDate(newWeekStart.getDate() - 7)
      setWeekStartDate(newWeekStart)
      setDate({
        year: newWeekStart.getFullYear(),
        month: newWeekStart.getMonth(),
        date: newWeekStart.getDate(),
      })
    }
  }

  const nextPeriod = (): void => {
    if (view === 'month') {
      setDate((prev) => {
        if (prev.month === 11) {
          return { ...prev, year: prev.year + 1, month: 0 }
        }
        return { ...prev, month: prev.month + 1 }
      })
    } else {
      // Week view - go forward 7 days
      const newWeekStart = new Date(weekStartDate)
      newWeekStart.setDate(newWeekStart.getDate() + 7)
      setWeekStartDate(newWeekStart)
      setDate({
        year: newWeekStart.getFullYear(),
        month: newWeekStart.getMonth(),
        date: newWeekStart.getDate(),
      })
    }
  }

  const goToToday = (): void => {
    const today = new Date()
    if (view === 'month') {
      setDate({
        year: today.getFullYear(),
        month: today.getMonth(),
        date: today.getDate(),
      })
    } else {
      // For week view, set to the start of current week
      const dayOfWeek = today.getDay()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - dayOfWeek)
      setWeekStartDate(startOfWeek)
      setDate({
        year: today.getFullYear(),
        month: today.getMonth(),
        date: today.getDate(),
      })
    }
  }

  // Handle event click
  const handleEventClick = (event: Event, e: React.MouseEvent): void => {
    e.stopPropagation() // Prevent closing popup immediately

    const rect = e.currentTarget.getBoundingClientRect()

    // Calculate popup position
    let newLeft = rect.left + rect.width / 2
    let newTop = rect.top + window.scrollY

    // Adjust if near window edges
    if (newLeft + 250 > window.innerWidth) {
      newLeft = window.innerWidth - 260
    }

    setPopupPosition({ top: newTop, left: newLeft })
    setSelectedEvent(event)
  }

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      // Check if the click was outside the popup and if there's a selected event
      if (
        selectedEvent &&
        !(e.target as Element).closest('.event-popup-content')
      ) {
        setSelectedEvent(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [selectedEvent])

  // Update column width when window is resized (for week view)
  useEffect(() => {
    if (view === 'week' && weekContainerRef.current) {
      // Force a re-render when window is resized
      const handleResize = (): void => {
        setDate((prevDate) => ({ ...prevDate }))
      }

      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [view])

  // Function to get events for a specific date
  const getEventsForDate = (
    year: number,
    month: number,
    day: number,
  ): Event[] => {
    // Format date to YYYY-MM-DD format for comparison
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    // Filter events for this date
    return events.filter((event) => {
      if (!event.date) return false

      // Convert event date to ISO format (YYYY-MM-DD) for comparison
      // Handle both string and Date objects
      let eventDate: string
      if (typeof event.date === 'string') {
        // If it's already a string, ensure it's in the right format
        eventDate = event.date.split('T')[0] // Remove time part if present
      } else {
        // If it's a Date object, convert to ISO string and remove time part
        eventDate = (event.date as Date).toISOString().split('T')[0]
      }

      return eventDate === dateString
    })
  }

  // Get the current week days for week view
  const getCurrentWeekDays = (): WeekDay[] => {
    const startOfWeek = new Date(weekStartDate)

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      return {
        date: day.getDate(),
        month: day.getMonth(),
        year: day.getFullYear(),
        day: weekdays[day.getDay()],
        fullDate: day,
      }
    })
  }

  const weekDays = getCurrentWeekDays()

  // Get the title for week view
  const getWeekViewTitle = (): string => {
    const startDay = weekStartDate
    const endDay = new Date(weekStartDate)
    endDay.setDate(weekStartDate.getDate() + 6)

    const startMonth = months[startDay.getMonth()]
    const endMonth = months[endDay.getMonth()]

    // If start and end are in the same month
    if (
      startMonth === endMonth &&
      startDay.getFullYear() === endDay.getFullYear()
    ) {
      return `${startMonth} ${startDay.getDate()} - ${endDay.getDate()}, ${startDay.getFullYear()}`
    }

    // If start and end are in different months but same year
    if (startDay.getFullYear() === endDay.getFullYear()) {
      return `${startMonth} ${startDay.getDate()} - ${endMonth} ${endDay.getDate()}, ${startDay.getFullYear()}`
    }

    // If start and end are in different years
    return `${startMonth} ${startDay.getDate()}, ${startDay.getFullYear()} - ${endMonth} ${endDay.getDate()}, ${endDay.getFullYear()}`
  }

  // Month View Component
  const MonthCalendarView: React.FC = () => {
    const today = new Date()
    const currentMonthDays = getDaysInMonth(date.year, date.month)
    const prevMonthDays = getPrevMonthDays(date.year, date.month)
    const nextMonthDays = getNextMonthDays(date.year, date.month)

    return (
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-7 text-center border-b">
          {weekdays.map((day, index) => (
            <div key={index} className="py-3 font-medium text-sm text-gray-800">
              {day.substring(0, 3)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {/* Previous month days */}
          {prevMonthDays.map((day, index) => {
            const dayDate = new Date(date.year, date.month - 1, day)
            const isPast = isPastDate(dayDate)
            const dayEvents = getEventsForDate(date.year, date.month - 1, day)

            return (
              <div
                key={`prev-${index}`}
                className={`min-h-24 p-2 border-b border-r relative ${isPast ? 'bg-gray-50' : 'bg-white'} text-gray-400`}
              >
                <span className="inline-block w-6 h-6 text-center rounded-full mb-1">
                  {day}
                </span>

                {/* Events for this day */}
                <div className="space-y-1 mt-1">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`${getEventColor(event.status)} text-white text-xs p-1 rounded truncate cursor-pointer`}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      {formatTime(event.startTime)} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Current month days */}
          {currentMonthDays.map((day, index) => {
            const isToday =
              day === today.getDate() &&
              date.month === today.getMonth() &&
              date.year === today.getFullYear()

            const dayDate = new Date(date.year, date.month, day)
            const isPast = isPastDate(dayDate)
            const dayEvents = getEventsForDate(date.year, date.month, day)

            return (
              <div
                key={`current-${index}`}
                className={`min-h-24 p-2 border-b border-r relative ${isPast ? 'bg-gray-50' : 'bg-white'}`}
              >
                <span
                  className={`inline-block w-6 h-6 text-center rounded-full mb-1
                      ${isToday ? 'bg-blue-500 text-white' : ''}
                    `}
                >
                  {day}
                </span>

                {/* Events for this day */}
                <div className="space-y-1 mt-1">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`${getEventColor(event.status)} text-white text-xs p-1 rounded truncate cursor-pointer`}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      {formatTime(event.startTime)} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Next month days */}
          {nextMonthDays.map((day, index) => {
            const dayDate = new Date(date.year, date.month + 1, day)
            const isPast = isPastDate(dayDate)
            const dayEvents = getEventsForDate(date.year, date.month + 1, day)

            return (
              <div
                key={`next-${index}`}
                className={`min-h-24 p-2 border-b border-r relative ${isPast ? 'bg-gray-50' : 'bg-white'} text-gray-400`}
              >
                <span className="inline-block w-6 h-6 text-center rounded-full mb-1">
                  {day}
                </span>

                {/* Events for this day */}
                <div className="space-y-1 mt-1">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`${getEventColor(event.status)} text-white text-xs p-1 rounded truncate cursor-pointer opacity-70`}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      {formatTime(event.startTime)} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Week View Component
  const WeekCalendarView: React.FC = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const hours = getHoursOfDay()

    // Get column width for events
    let columnWidth = 0
    if (weekContainerRef.current) {
      const containerWidth =
        weekContainerRef.current.getBoundingClientRect().width
      columnWidth = (containerWidth - 50) / 7 // 50px for time column
    }

    return (
      <div className="bg-white rounded-lg" ref={weekContainerRef}>
        <div className="grid grid-cols-8 text-center border-b">
          <div className="py-3"></div>
          {weekDays.map((day, index) => {
            const isPast = isPastDate(day.fullDate)
            const isToday = isSameDay(day.fullDate, today)

            return (
              <div
                key={index}
                className={`py-2 font-medium border-l
                    ${isPast ? 'bg-gray-50 text-gray-500' : ''}
                    ${isToday ? 'bg-blue-50' : ''}
                  `}
              >
                <div className="text-sm">{day.day.substring(0, 3)}</div>
                <div
                  className={`inline-flex items-center justify-center w-8 h-8 mt-1 
                      ${isToday ? 'bg-blue-500 text-white rounded-full' : ''}
                    `}
                >
                  {day.date}
                </div>
              </div>
            )
          })}
        </div>
        <div className="grid grid-cols-8 relative">
          {hours.map((hour, hourIndex) => {
            // Split the hour string to get hour value and AM/PM
            const [hourStr, period] = hour.split(' ')
            const hourVal = parseInt(hourStr.split(':')[0])
            const hourNum =
              period === 'PM' && hourVal !== 12
                ? hourVal + 12
                : period === 'AM' && hourVal === 12
                  ? 0
                  : hourVal

            // Check if current hour is past
            const hourDate = new Date()
            hourDate.setHours(hourNum, 0, 0, 0)

            return (
              <React.Fragment key={hourIndex}>
                <div className="h-14 border-b border-r text-xs text-right pr-2 pt-1 text-gray-500">
                  {hour}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const cellDate = new Date(day.fullDate)
                  cellDate.setHours(hourNum, 0, 0, 0)

                  const isPast = isPastDate(cellDate)
                  const isNow =
                    isSameDay(cellDate, today) && today.getHours() === hourNum

                  return (
                    <div
                      key={`day-${dayIndex}`}
                      className={`h-14 border-b border-r relative
                          ${isPast ? 'bg-gray-50' : ''}
                          ${isNow ? 'bg-blue-50' : ''}
                        `}
                    >
                      {isNow && (
                        <div className="w-full h-0.5 bg-blue-500 relative top-0"></div>
                      )}
                    </div>
                  )
                })}
              </React.Fragment>
            )
          })}

          {/* Events overlay */}
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDate(day.year, day.month, day.date)

            return dayEvents.map((event, eventIndex) => {
              // Only calculate position if column width is available
              if (columnWidth <= 0) return null

              const position = calculateEventPosition(event, columnWidth)
              if (!position) return null

              return (
                <div
                  key={`event-${dayIndex}-${eventIndex}`}
                  className={`absolute ${getEventColor(event.status)} text-white text-xs p-1 rounded overflow-hidden cursor-pointer`}
                  style={{
                    top: position.top,
                    height: position.height,
                    width: position.width,
                    left: `calc(${50}px + ${dayIndex * columnWidth}px + 2px)`,
                    zIndex: 10,
                  }}
                  onClick={(e) => handleEventClick(event, e)}
                >
                  <div className="font-semibold truncate">{event.title}</div>
                  <div className="text-xs opacity-90 truncate">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                </div>
              )
            })
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Button variant="link" className="text-blue-500" onClick={goToToday}>
          Today
        </Button>

        <div className="flex items-center gap-2 relative">
          <Button variant="ghost" size="icon" onClick={prevPeriod}>
            <Icon name="ChevronLeft" className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            className="text-base font-medium"
            onClick={() => setShowMonthSelector(!showMonthSelector)}
          >
            {view === 'month'
              ? `${fullMonths[date.month]} ${date.year}`
              : getWeekViewTitle()}
          </Button>

          <Button variant="ghost" size="icon" onClick={nextPeriod}>
            <Icon name="ChevronRight" className="h-4 w-4" />
          </Button>

          {showMonthSelector && (
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10 bg-white-100 border border-gray-300 rounded-lg shadow-xl p-6 grid grid-cols-4 gap-6 w-[320px]">
              {/* Year Navigation */}
              <div className="col-span-4 flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setDate((prev) => ({ ...prev, year: prev.year - 1 }))
                  }
                >
                  <Icon name="ChevronLeft" className="h-5 w-5" />
                </Button>

                <span className="text-xl font-semibold">{date.year}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setDate((prev) => ({ ...prev, year: prev.year + 1 }))
                  }
                >
                  <Icon name="ChevronRight" className="h-5 w-5" />
                </Button>
              </div>

              {/* Month Selection */}
              {months.map((month, idx) => (
                <Button
                  key={month}
                  variant="ghost"
                  size="lg"
                  className={`text-lg py-3 rounded-md transition-all duration-200 ${
                    idx === date.month
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    setDate((prev) => ({ ...prev, month: idx }))
                    setShowMonthSelector(false)
                  }}
                >
                  {month}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            className={`rounded-l-md rounded-r-none ${view === 'month' ? 'bg-blue-100 text-blue-800 border-blue-300' : ''}`}
            onClick={() => setView('month')}
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            className={`rounded-r-md rounded-l-none ${view === 'week' ? 'bg-blue-100 text-blue-800 border-blue-300' : ''}`}
            onClick={() => setView('week')}
          >
            Week
          </Button>
        </div>
      </div>

      {view === 'month' ? <MonthCalendarView /> : <WeekCalendarView />}

      {/* Event Popup */}
      {selectedEvent && (
        <CalendarEventPopup
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          position={popupPosition}
        />
      )}
    </>
  )
}

export default EventCalendar
