/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/ticket-ui/ticket-form.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { DialogFooter } from '@/components/ui/dialog'
import TicketDatePicker from './ticket-day-picker'

interface TicketFormProps {
  ticketType: 'Free' | 'Paid' | 'Donation'
  ticketName: string
  ticketCapacity: number
  ticketPrice: number | undefined
  saleStartDate: Date | undefined
  saleEndDate: Date | undefined
  startTime: string
  endTime: string
  minPerOrder: number
  maxPerOrder: number
  eventDate?: Date
  eventEndTime?: string
  maxSaleEndDate?: Date
  setTicketType: (type: 'Free' | 'Paid' | 'Donation') => void
  setTicketName: (name: string) => void
  setTicketCapacity: (capacity: number) => void
  setTicketPrice: (price: number | undefined) => void
  setSaleStartDate: (date: Date | undefined) => void
  setSaleEndDate: (date: Date | undefined) => void
  setStartTime: (time: string) => void
  setEndTime: (time: string) => void
  setMinPerOrder: (min: number) => void
  setMaxPerOrder: (max: number) => void
  onCancel: () => void
  onSubmit: () => void
  submitButtonText: string
  generateTimeOptions: string[] // Updated: Now expecting array directly
  startDateCalendarOpen: boolean
  setStartDateCalendarOpen: (open: boolean) => void
  endDateCalendarOpen: boolean
  setEndDateCalendarOpen: (open: boolean) => void
  isEndDateDisabled?: (date: Date) => boolean
}

const TicketForm: React.FC<TicketFormProps> = ({
  ticketType,
  ticketName,
  ticketCapacity,
  ticketPrice,
  saleStartDate,
  saleEndDate,
  startTime,
  endTime,
  minPerOrder,
  maxPerOrder,
  eventDate,
  maxSaleEndDate,
  setTicketType,
  setTicketName,
  setTicketCapacity,
  setTicketPrice,
  setSaleStartDate,
  setSaleEndDate,
  setStartTime,
  setEndTime,
  setMinPerOrder,
  setMaxPerOrder,
  onCancel,
  onSubmit,
  submitButtonText,
  generateTimeOptions,
  startDateCalendarOpen,
  setStartDateCalendarOpen,
  endDateCalendarOpen,
  setEndDateCalendarOpen,
  isEndDateDisabled,
}) => {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="flex justify-between gap-2 mb-2">
          <Button
            variant={ticketType === 'Paid' ? 'default' : 'outline'}
            className={`flex-1 ${ticketType === 'Paid' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}`}
            onClick={() => setTicketType('Paid')}
          >
            Paid
          </Button>
          <Button
            variant={ticketType === 'Free' ? 'default' : 'outline'}
            className={`flex-1 ${ticketType === 'Free' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}`}
            onClick={() => setTicketType('Free')}
          >
            Free
          </Button>
          <Button
            variant={ticketType === 'Donation' ? 'default' : 'outline'}
            className={`flex-1 ${ticketType === 'Donation' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}`}
            onClick={() => setTicketType('Donation')}
          >
            Donation
          </Button>
        </div>

        <div>
          <label className="text-sm">Name*</label>
          <Input
            value={ticketName}
            onChange={(e) => setTicketName(e.target.value)}
            placeholder="e.g. General Admission"
          />
        </div>

        <div>
          <label className="text-sm">Available quantity*</label>
          <Input
            type="number"
            value={ticketCapacity}
            onChange={(e) => setTicketCapacity(parseInt(e.target.value) || 0)}
            min={0}
          />
        </div>

        <div>
          <label className="text-sm">Price</label>
          <div className="flex items-center">
            <span className="mr-2">$</span>
            <Input
              type="number"
              value={ticketPrice || ''}
              onChange={(e) =>
                setTicketPrice(
                  e.target.value ? parseFloat(e.target.value) : undefined,
                )
              }
              disabled={ticketType === 'Free'}
              placeholder={ticketType === 'Free' ? 'Free' : '0.00'}
              min={0}
              step={0.01}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <TicketDatePicker
              label="Sales start"
              date={saleStartDate}
              setDate={setSaleStartDate}
              isOpen={startDateCalendarOpen}
              setIsOpen={setStartDateCalendarOpen}
            />
          </div>

          <div>
            <label className="text-sm">Start time</label>
            <select
              className="w-full rounded-md border px-3 py-2 cursor-pointer"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            >
              <option value="">Select time</option>
              {generateTimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <TicketDatePicker
              label="Sales end"
              date={saleEndDate}
              setDate={setSaleEndDate}
              isOpen={endDateCalendarOpen}
              setIsOpen={setEndDateCalendarOpen}
              disabledDates={isEndDateDisabled}
            />
            {eventDate && maxSaleEndDate && (
              <p className="text-xs text-gray-500 mt-1">
                Sales must end by the event date ({maxSaleEndDate.toLocaleDateString()})
              </p>
            )}
          </div>

          <div>
            <label className="text-sm">End time</label>
            <select
              className="w-full rounded-md border px-3 py-2 cursor-pointer"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            >
              <option value="">Select time</option>
              {generateTimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="advanced">
            <AccordionTrigger>Advanced settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-sm">Minimum quantity per order</label>
                  <Input
                    type="number"
                    value={minPerOrder}
                    onChange={(e) =>
                      setMinPerOrder(parseInt(e.target.value) || 1)
                    }
                    min={1}
                  />
                </div>
                <div>
                  <label className="text-sm">Maximum quantity per order</label>
                  <Input
                    type="number"
                    value={maxPerOrder}
                    onChange={(e) =>
                      setMaxPerOrder(parseInt(e.target.value) || 10)
                    }
                    min={1}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="bg-orange-600 hover:bg-orange-700"
          onClick={onSubmit}
        >
          {submitButtonText}
        </Button>
      </DialogFooter>
    </>
  )
}

export default TicketForm