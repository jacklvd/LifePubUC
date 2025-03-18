import React from 'react'
import { format } from 'date-fns'
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
  startPeriod: 'AM' | 'PM'
  endHour: string
  endMinute: string
  endPeriod: 'AM' | 'PM'
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
}: Props) => (
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
                <SelectItem key={`start-hour-${hour}`} value={hour}>
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
              {['00', '15', '30', '45'].map((minute) => (
                <SelectItem key={`start-minute-${minute}`} value={minute}>
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
              <SelectItem value="AM">AM</SelectItem>
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
                <SelectItem key={`end-hour-${hour}`} value={hour}>
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
              {['00', '15', '30', '45'].map((minute) => (
                <SelectItem key={`end-minute-${minute}`} value={minute}>
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
              <SelectItem value="AM">AM</SelectItem>
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

export default EventDateTimePicker
