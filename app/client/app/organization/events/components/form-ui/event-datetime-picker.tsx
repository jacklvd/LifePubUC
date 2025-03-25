import React, { useEffect, useCallback, useMemo } from 'react'
import { format, addHours, startOfDay, isToday, isPast } from 'date-fns'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../../../../../components/ui/popover'
import { Calendar } from '../../../../../components/ui/calendar'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../../../../../components/ui/select'
import { Button } from '../../../../../components/ui/button'
import { Icon } from '../../../../../components/icons'

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

// Generate hours for dropdown (01-12)
const hours = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, '0'),
)

// Generate minutes for dropdown (00, 15, 30, 45)
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
  // Function to check if a date is in the past
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

  // Formatted date for display
  const formattedDate = useMemo(() => {
    return date ? format(date, 'MMMM do, yyyy') : 'Select a date'
  }, [date])

  // Initialize date/time once when component mounts
  useEffect(() => {
    // Only set date if not already set
    if (!date) {
      setDate(new Date())
    }

    // Check if time values need to be initialized
    const shouldInitializeTime =
      !startHour ||
      !startMinute ||
      !startPeriod ||
      (startHour === '01' && startMinute === '00' && startPeriod === 'AM')

    if (shouldInitializeTime) {
      const timeValues = initializeTimeValues()

      setStartHour(timeValues.start.hour)
      setStartMinute(timeValues.start.minute)
      setStartPeriod(timeValues.start.period as 'AM' | 'PM')
      setEndHour(timeValues.end.hour)
      setEndMinute(timeValues.end.minute)
      setEndPeriod(timeValues.end.period as 'AM' | 'PM')
    }
  }, []) // Empty dependency array so this only runs once

  return (
    <>
      {/* Date Picker */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-4">Date and time</h3>
        {errors.date && (
          <p className="text-red-500 text-sm mt-1 mb-2" role="alert">
            {errors.date}
          </p>
        )}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal h-12 text-base"
            >
              <Icon name="Calendar" className="mr-2 h-5 w-5" />
              {formattedDate}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 max-w-[95vw]" align="start">
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
      <div>
        {/* Label Row */}
        <div className="grid grid-cols-2 gap-8 mb-2">
          <p className="text-base text-gray-500">Start Time</p>
          <p className="text-base text-gray-500">End Time</p>
        </div>

        {/* Time Selector Row */}
        <div className="grid grid-cols-2 gap-8">
          {/* Start Time */}
          <div className="grid grid-cols-3 gap-2">
            {/* Hour */}
            <Select value={startHour} onValueChange={setStartHour}>
              <SelectTrigger className="text-center px-2">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent className="bg-white-100 max-h-64 overflow-y-auto">
                {hours.map((hour) => (
                  <SelectItem
                    key={`start-hour-${hour}`}
                    value={hour}
                    className="cursor-pointer"
                  >
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Minute */}
            <Select value={startMinute} onValueChange={setStartMinute}>
              <SelectTrigger className="text-center px-2">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent className="bg-white-100 max-h-64 overflow-y-auto">
                {minutes.map((minute) => (
                  <SelectItem
                    key={`start-minute-${minute}`}
                    value={minute}
                    className="cursor-pointer"
                  >
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* AM/PM */}
            <Select
              value={startPeriod}
              onValueChange={(value) => setStartPeriod(value as 'AM' | 'PM')}
            >
              <SelectTrigger className="text-center px-2">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent className="bg-white-100">
                <SelectItem value="AM" className="cursor-pointer">
                  AM
                </SelectItem>
                <SelectItem value="PM" className="cursor-pointer">
                  PM
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* End Time */}
          <div className="grid grid-cols-3 gap-2">
            {/* Hour */}
            <Select value={endHour} onValueChange={setEndHour}>
              <SelectTrigger className="text-center px-2">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent className="bg-white-100 max-h-64 overflow-y-auto">
                {hours.map((hour) => (
                  <SelectItem
                    key={`end-hour-${hour}`}
                    value={hour}
                    className="cursor-pointer"
                  >
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Minute */}
            <Select value={endMinute} onValueChange={setEndMinute}>
              <SelectTrigger className="text-center px-2">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent className="bg-white-100 max-h-64 overflow-y-auto">
                {minutes.map((minute) => (
                  <SelectItem
                    key={`end-minute-${minute}`}
                    value={minute}
                    className="cursor-pointer"
                  >
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* AM/PM */}
            <Select
              value={endPeriod}
              onValueChange={(value) => setEndPeriod(value as 'AM' | 'PM')}
            >
              <SelectTrigger className="text-center px-2">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent className="bg-white-100">
                <SelectItem value="AM" className="cursor-pointer">
                  AM
                </SelectItem>
                <SelectItem value="PM" className="cursor-pointer">
                  PM
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Messages */}
        <div className="grid grid-cols-2 gap-8 mt-1">
          <div>
            {errors.startTime && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.startTime}
              </p>
            )}
          </div>
          <div>
            {errors.endTime && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.endTime}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default EventDateTimePicker
