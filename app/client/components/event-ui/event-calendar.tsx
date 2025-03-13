'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Icon } from '../icons'

// Helper function to get days of the month
const getDaysInMonth = (year: number, month: number) => {
  const lastDay = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: lastDay }, (_, i) => i + 1)
}

// Helper function to get previous month days that appear in current view
const getPrevMonthDays = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  return Array.from(
    { length: firstDayOfMonth },
    (_, i) => prevMonthLastDay - firstDayOfMonth + i + 1,
  )
}

// Helper function to get next month days that appear in current view
const getNextMonthDays = (year: number, month: number) => {
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysFromNextMonth = 6 - lastDayOfMonth.getDay()

  return Array.from({ length: daysFromNextMonth }, (_, i) => i + 1)
}

// Helper function to get hours for the day
const getHoursOfDay = () => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12
    const period = i < 12 ? 'AM' : 'PM'
    return `${hour}:00 ${period}`
  })
}

// Helper function to check if a date is in the past
const isPastDate = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

type ViewType = 'month' | 'week'

const EventCalendar = () => {
  const currentDate = new Date()
  const [date, setDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
  })
  const [view, setView] = useState<ViewType>('month')
  const [showMonthSelector, setShowMonthSelector] = useState(false)

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

  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  const prevMonth = () => {
    setDate((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 }
      }
      return { ...prev, month: prev.month - 1 }
    })
  }

  const nextMonth = () => {
    setDate((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 }
      }
      return { ...prev, month: prev.month + 1 }
    })
  }

  const currentMonth = fullMonths[date.month]
  const currentMonthDays = getDaysInMonth(date.year, date.month)
  const prevMonthDays = getPrevMonthDays(date.year, date.month)
  const nextMonthDays = getNextMonthDays(date.year, date.month)
  const hours = getHoursOfDay()

  // Get the current week for week view
  const getCurrentWeekDays = () => {
    const today = new Date(date.year, date.month, currentDate.getDate())
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      return {
        date: day.getDate(),
        month: day.getMonth() + 1,
        year: day.getFullYear(),
        day: weekdays[i],
        fullDate: day,
      }
    })
  }

  const weekDays = getCurrentWeekDays()

  const MonthCalendarView = () => {
    const today = new Date()

    return (
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-7 text-center border-b">
          {weekdays.map((day, index) => (
            <div key={index} className="py-3 font-medium text-sm text-gray-800">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {/* Previous month days */}
          {prevMonthDays.map((day, index) => {
            const dayDate = new Date(date.year, date.month - 1, day)
            const isPast = isPastDate(dayDate)

            return (
              <div
                key={`prev-${index}`}
                className={`min-h-24 p-2 border-b border-r ${isPast ? 'bg-gray-50' : 'bg-white'} text-gray-400`}
              >
                <span className="inline-block w-6 h-6 text-center rounded-full">
                  {day}
                </span>
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

            return (
              <div
                key={`current-${index}`}
                className={`min-h-24 p-2 border-b border-r ${isPast ? 'bg-gray-50' : 'bg-white'}`}
              >
                <span
                  className={`inline-block w-6 h-6 text-center rounded-full
                      ${isToday ? 'bg-blue-500 text-white' : ''}
                    `}
                >
                  {day}
                </span>
              </div>
            )
          })}

          {/* Next month days */}
          {nextMonthDays.map((day, index) => {
            const dayDate = new Date(date.year, date.month + 1, day)
            const isPast = isPastDate(dayDate)

            return (
              <div
                key={`next-${index}`}
                className={`min-h-24 p-2 border-b border-r ${isPast ? 'bg-gray-50' : 'bg-white'} text-gray-400`}
              >
                <span className="inline-block w-6 h-6 text-center rounded-full">
                  {day}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const WeekCalendarView = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return (
      <div className="bg-white rounded-lg">
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
                <div className="text-sm">{day.day}</div>
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
        <div className="grid grid-cols-8">
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
                      className={`h-14 border-b border-r 
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
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="link"
          className="text-blue-500"
          onClick={() => {
            setDate({
              year: currentDate.getFullYear(),
              month: currentDate.getMonth(),
            })
          }}
        >
          Today
        </Button>

        <div className="flex items-center gap-2 relative">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <Icon name="ChevronLeft" className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            className="text-base font-medium"
            onClick={() => setShowMonthSelector(!showMonthSelector)}
          >
            {currentMonth} {date.year}
          </Button>

          <Button variant="ghost" size="icon" onClick={nextMonth}>
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
                  className={`text-lg py-3 rounded-md transition-all duration-200 ${idx === date.month
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
    </>
  )
}

export default EventCalendar
