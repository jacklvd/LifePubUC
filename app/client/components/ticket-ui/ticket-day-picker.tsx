// components/ui/ticket-ui/ticket-day-picker.tsx
import React from 'react'
import { format } from 'date-fns'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'

interface TicketDatePickerProps {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  disabledDates?: (date: Date) => boolean
}

const TicketDatePicker = ({
  label,
  date,
  setDate,
  isOpen,
  setIsOpen,
  disabledDates,
}: TicketDatePickerProps) => {
  return (
    <div className="relative">
      <label className="text-sm">{label}*</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left"
            type="button" // Ensure it doesn't submit forms
          >
            <Icon name="Calendar" className="mr-2 h-4 w-4" />
            {date ? format(date, 'MM/dd/yyyy') : 'Select date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 z-50 pointer-events-auto"
          align="start"
          sideOffset={5}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate)
                // Automatically close the calendar after selection
                setTimeout(() => setIsOpen(false), 100)
              }
            }}
            disabled={disabledDates}
            initialFocus
            className="bg-white-100 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default TicketDatePicker
