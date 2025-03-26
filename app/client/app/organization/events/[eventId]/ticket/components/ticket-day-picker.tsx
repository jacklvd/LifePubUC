// components/ui/ticket-ui/ticket-day-picker.tsx
import React, { memo } from 'react'
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
  disabled?: boolean // New prop for disabled state
}

const TicketDatePicker = memo(
  ({
    label,
    date,
    setDate,
    isOpen,
    setIsOpen,
    disabledDates,
    disabled = false,
  }: TicketDatePickerProps) => {
    return (
      <div className="relative">
        <label className="text-sm">{label}*</label>
        <Popover
          open={isOpen && !disabled}
          onOpenChange={!disabled ? setIsOpen : undefined}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
              type="button" // Ensure it doesn't submit forms
              disabled={disabled}
            >
              <Icon name="Calendar" className="mr-2 h-4 w-4" />
              {date ? format(date, 'MM/dd/yyyy') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 z-50"
            align="start"
            sideOffset={5}
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) {
                  setDate(newDate)
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
  },
)

// Add display name for debugging
TicketDatePicker.displayName = 'TicketDatePicker'

export default TicketDatePicker
