// MonthView.tsx - Monthly calendar view component with optimizations
import React, { useMemo, useCallback } from 'react'
import {
  getWeekDayNames,
  getDaysInMonth,
  getPrevMonthDays,
  getNextMonthDays,
  isPastDate,
  getEventColor,
  formatTime,
} from '@/lib/utils'

interface DateState {
  year: number
  month: number
  day: number
}

interface MonthViewProps {
  date: DateState
  getEventsForDate: (year: number, month: number, day: number) => Event[]
  handleEventClick: (event: Event, e: React.MouseEvent) => void
}

// DayCell component to optimize re-renders
const DayCell = React.memo(
  ({
    day,
    month,
    isPast,
    isToday,
    isOtherMonth,
    events,
    handleEventClick,
  }: {
    day: number
    month: number
    year: number
    isPast: boolean
    isToday: boolean
    isOtherMonth: boolean
    events: Event[]
    handleEventClick: (event: Event, e: React.MouseEvent) => void
  }) => {
    // Memoize event handling to prevent recreation on each render
    const onEventClick = useCallback(
      (event: Event, e: React.MouseEvent) => {
        e.stopPropagation()
        handleEventClick(event, e)
      },
      [handleEventClick],
    )

    return (
      <div
        className={`min-h-24 p-2 border-b border-r relative 
                ${isPast ? 'bg-gray-50' : 'bg-white'} 
                ${isOtherMonth ? 'text-gray-400' : ''}
            `}
      >
        <span
          className={`inline-block w-6 h-6 text-center rounded-full mb-1 
                ${isToday ? 'bg-blue-500 text-white' : ''}
            `}
        >
          {day}
        </span>

        {/* Events for this day - limited to 3 for performance */}
        <div className="space-y-1 mt-1">
          {events.slice(0, 3).map((event, eventIndex) => (
            <div
              key={`${event.eventId || event._id || eventIndex}-${day}-${month}`}
              className={`${getEventColor(event.status)} text-white text-xs p-1 rounded truncate cursor-pointer ${isOtherMonth ? 'opacity-70' : ''}`}
              onClick={(e) => onEventClick(event, e)}
            >
              {formatTime(event.startTime)} {event.title}
            </div>
          ))}
          {events.length > 3 && (
            <div className="text-xs text-gray-500 pl-1">
              +{events.length - 3} more
            </div>
          )}
        </div>
      </div>
    )
  },
)

// Prevent unnecessary re-rendering by displaying the component name
DayCell.displayName = 'DayCell'

export const MonthView: React.FC<MonthViewProps> = React.memo(
  ({ date, getEventsForDate, handleEventClick }) => {
    // Get today's date for comparison
    const today = useMemo(() => new Date(), [])
    today.setHours(0, 0, 0, 0)

    // Create memoized weekdays array
    const weekdays = useMemo(() => getWeekDayNames(), [])

    // Calculate days arrays with memoization
    const currentMonthDays = useMemo(
      () => getDaysInMonth(date.year, date.month),
      [date.year, date.month],
    )
    const prevMonthDays = useMemo(
      () => getPrevMonthDays(date.year, date.month),
      [date.year, date.month],
    )
    const nextMonthDays = useMemo(
      () => getNextMonthDays(date.year, date.month),
      [date.year, date.month],
    )

    // Create an object to store events by date for faster lookup
    const eventsByDate = useMemo(() => {
      const map: Record<string, Record<string, Event[]>> = {}

      // Add previous month days
      prevMonthDays.forEach((day) => {
        const prevMonth = date.month - 1 < 0 ? 11 : date.month - 1
        const prevYear = prevMonth === 11 ? date.year - 1 : date.year
        const key = `${prevYear}-${prevMonth}-${day}`
        map[key] = { events: getEventsForDate(prevYear, prevMonth, day) }
      })

      // Add current month days
      currentMonthDays.forEach((day) => {
        const key = `${date.year}-${date.month}-${day}`
        map[key] = { events: getEventsForDate(date.year, date.month, day) }
      })

      // Add next month days
      nextMonthDays.forEach((day) => {
        const nextMonth = date.month + 1 > 11 ? 0 : date.month + 1
        const nextYear = nextMonth === 0 ? date.year + 1 : date.year
        const key = `${nextYear}-${nextMonth}-${day}`
        map[key] = { events: getEventsForDate(nextYear, nextMonth, day) }
      })

      return map
    }, [
      date.year,
      date.month,
      prevMonthDays,
      currentMonthDays,
      nextMonthDays,
      getEventsForDate,
    ])

    return (
      <div className="bg-white-100 rounded-lg border border-gray-200 overflow-auto max-h-[800px] shadow-sm">
        <div className="grid grid-cols-7 text-center border-b sticky top-0 bg-white z-20">
          {weekdays.map((day, index) => (
            <div key={index} className="py-3 font-medium text-sm text-gray-800">
              {day.substring(0, 3)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {/* Previous month days */}
          {prevMonthDays.map((day, index) => {
            const prevMonth = date.month - 1 < 0 ? 11 : date.month - 1
            const prevYear = prevMonth === 11 ? date.year - 1 : date.year
            const dayDate = new Date(prevYear, prevMonth, day)
            const isPast = isPastDate(dayDate)
            const key = `${prevYear}-${prevMonth}-${day}`
            const events = eventsByDate[key]?.events || []

            return (
              <DayCell
                key={`prev-${index}`}
                day={day}
                month={prevMonth}
                year={prevYear}
                isPast={isPast}
                isToday={false}
                isOtherMonth={true}
                events={events}
                handleEventClick={handleEventClick}
              />
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
            const key = `${date.year}-${date.month}-${day}`
            const events = eventsByDate[key]?.events || []

            return (
              <DayCell
                key={`current-${index}`}
                day={day}
                month={date.month}
                year={date.year}
                isPast={isPast}
                isToday={isToday}
                isOtherMonth={false}
                events={events}
                handleEventClick={handleEventClick}
              />
            )
          })}

          {/* Next month days */}
          {nextMonthDays.map((day, index) => {
            const nextMonth = date.month + 1 > 11 ? 0 : date.month + 1
            const nextYear = nextMonth === 0 ? date.year + 1 : date.year
            const dayDate = new Date(nextYear, nextMonth, day)
            const isPast = isPastDate(dayDate)
            const key = `${nextYear}-${nextMonth}-${day}`
            const events = eventsByDate[key]?.events || []

            return (
              <DayCell
                key={`next-${index}`}
                day={day}
                month={nextMonth}
                year={nextYear}
                isPast={isPast}
                isToday={false}
                isOtherMonth={true}
                events={events}
                handleEventClick={handleEventClick}
              />
            )
          })}
        </div>
      </div>
    )
  },
)

// Prevent unnecessary re-rendering by displaying the component name
MonthView.displayName = 'MonthView'
