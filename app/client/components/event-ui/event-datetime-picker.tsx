import React, { useEffect, useCallback } from 'react'
import { format, addHours, startOfDay, isToday, isPast } from 'date-fns'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import { Icon } from '../icons'

interface Props {
  date?: Date
  setDate: (date: Date | undefined) => void
  calendarOpen: boolean
  setCalendarOpen: (open: boolean) => void
  startHour: string
  startMinute: string
  startPeriod: string
  endHour: string
  endMinute: string
  endPeriod: string
  setStartHour: (value: string) => void
  setStartMinute: (value: string) => void
  setStartPeriod: (value: 'AM' | 'PM') => void
  setEndHour: (value: string) => void
  setEndMinute: (value: string) => void
  setEndPeriod: (value: 'AM' | 'PM') => void
  errors: Record<string, string>
}

const hours = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, '0'),
)

const minutes = ['00', '15', '30', '45']

const EventDateTimePicker = ({
  date,
  setDate,
  calendarOpen,
  setCalendarOpen,
  startHour,
  startMinute,
  startPeriod,
  endHour,
  endMinute,
  endPeriod,
  setStartHour,
  setStartMinute,
  setStartPeriod,
  setEndHour,
  setEndMinute,
  setEndPeriod,
  errors,
}: Props) => {
  // Function to check if a date is in the past - memoized to avoid recalculation
  const isDateDisabled = useCallback((day: Date) => {
    return isPast(startOfDay(day)) && !isToday(day)
  }, [])

  // Helper function to format the current time values
  const initializeTimeValues = useCallback(() => {
    const now = new Date()

    // Format hour to 12-hour format
    const currentHour = now.getHours()
    const hour12 = currentHour % 12 || 12 // Convert 0 to 12
    const formattedHour = hour12.toString().padStart(2, '0')

    // Round minutes to nearest 15 (00, 15, 30, 45)
    const currentMinute = now.getMinutes()
    const minuteIndex = Math.floor(currentMinute / 15)
    const roundedMinute = minutes[minuteIndex]

    // Set period (AM/PM)
    const period = currentHour >= 12 ? 'PM' : 'AM'

    // Calculate end time (1 hour after start)
    const endTime = addHours(now, 1)
    const endHour12 = endTime.getHours() % 12 || 12
    const formattedEndHour = endHour12.toString().padStart(2, '0')
    const endPeriodValue = endTime.getHours() >= 12 ? 'PM' : 'AM'

    return {
      start: {
        hour: formattedHour,
        minute: roundedMinute,
        period: period,
      },
      end: {
        hour: formattedEndHour,
        minute: roundedMinute,
        period: endPeriodValue,
      },
    }
  }, [])

  // Only initialize date/time once when component mounts
  useEffect(() => {
    // Only set date if not already set
    if (!date) {
      setDate(new Date())
    }

    // Check if time values need to be initialized (only on first render)
    const shouldInitializeTime =
      (startHour === '01' && startMinute === '00' && startPeriod === 'AM') ||
      !startHour ||
      !startMinute ||
      !startPeriod

    if (shouldInitializeTime) {
      const timeValues = initializeTimeValues()

      // Batch state updates to reduce renders
      setStartHour(timeValues.start.hour)
      setStartMinute(timeValues.start.minute)
      setStartPeriod(timeValues.start.period as 'AM' | 'PM')
      setEndHour(timeValues.end.hour)
      setEndMinute(timeValues.end.minute)
      setEndPeriod(timeValues.end.period as 'AM' | 'PM')
    }
  }, []) // Empty dependency array so this only runs once

  // Function to check if selected time is in the past - memoized for performance
  const isTimeInPast = useCallback(
    (hour: string, minute: string, period: string) => {
      // If no date is selected or date is not today, no time is in the past
      if (!date || !isToday(date)) return false

      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      // Convert selected time to 24-hour format
      const selectedHour = parseInt(hour)
      const selectedMinute = parseInt(minute)
      const hour24 =
        period === 'AM'
          ? selectedHour === 12
            ? 0
            : selectedHour
          : selectedHour === 12
            ? 12
            : selectedHour + 12

      // Compare with current time
      if (hour24 < currentHour) return true
      if (hour24 === currentHour && selectedMinute < currentMinute) return true

      return false
    },
    [date],
  )

  // Helper function to check if date is today - memoized
  const isTodayDate = useCallback((dateToCheck?: Date): boolean => {
    if (!dateToCheck) return false
    return isToday(dateToCheck)
  }, [])

  return (
    <>
      {/* Date Picker */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-4">Date and time</h3>
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">{errors.date}</p>
        )}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <Icon name="Calendar" className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate || undefined)
                setCalendarOpen(false)
              }}
              disabled={isDateDisabled}
              initialFocus
              className="bg-white-100"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm mb-1 text-gray-500">Start Time</p>
          <div className="flex space-x-2">
            <Select value={startHour} onValueChange={setStartHour}>
              <SelectTrigger className="w-16">
                <SelectValue placeholder="H" />
              </SelectTrigger>
              <SelectContent className="bg-white-100">
                {hours.map((hour) => (
                  <SelectItem
                    key={`start-hour-${hour}`}
                    value={hour}
                    disabled={isTimeInPast(hour, startMinute, startPeriod)}
                  >
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={startMinute} onValueChange={setStartMinute}>
              <SelectTrigger className="w-16">
                <SelectValue placeholder="M" />
              </SelectTrigger>
              <SelectContent className="bg-white-100">
                {minutes.map((minute) => (
                  <SelectItem
                    key={`start-minute-${minute}`}
                    value={minute}
                    disabled={isTimeInPast(startHour, minute, startPeriod)}
                  >
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={startPeriod}
              onValueChange={(value) => setStartPeriod(value as 'AM' | 'PM')}
            >
              <SelectTrigger className="w-16">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent className="bg-white-100">
                <SelectItem
                  value="AM"
                  disabled={
                    isTodayDate(date) &&
                    startHour !== '12' &&
                    new Date().getHours() >= 12
                  }
                >
                  AM
                </SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.startTime && (
            <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
          )}
        </div>

        <div>
          <p className="text-sm mb-1 text-gray-500">End Time</p>
          <div className="flex space-x-2">
            <Select value={endHour} onValueChange={setEndHour}>
              <SelectTrigger className="w-16">
                <SelectValue placeholder="H" />
              </SelectTrigger>
              <SelectContent className="bg-white-100">
                {hours.map((hour) => (
                  <SelectItem
                    key={`end-hour-${hour}`}
                    value={hour}
                    disabled={
                      isTodayDate(date) &&
                      isTimeInPast(hour, endMinute, endPeriod)
                    }
                  >
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={endMinute} onValueChange={setEndMinute}>
              <SelectTrigger className="w-16">
                <SelectValue placeholder="M" />
              </SelectTrigger>
              <SelectContent className="bg-white-100">
                {minutes.map((minute) => (
                  <SelectItem
                    key={`end-minute-${minute}`}
                    value={minute}
                    disabled={
                      isTodayDate(date) &&
                      isTimeInPast(endHour, minute, endPeriod)
                    }
                  >
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={endPeriod}
              onValueChange={(value) => setEndPeriod(value as 'AM' | 'PM')}
            >
              <SelectTrigger className="w-16">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent className="bg-white-100">
                <SelectItem
                  value="AM"
                  disabled={
                    isTodayDate(date) &&
                    endHour !== '12' &&
                    new Date().getHours() >= 12
                  }
                >
                  AM
                </SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.endTime && (
            <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
          )}
        </div>
      </div>
    </>
  )
}

export default EventDateTimePicker
