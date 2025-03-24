// components/ticket-ui/ticket-dialogs.tsx
import React, { memo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import TicketForm from './ticket-form'
import { useTicketStore } from '@/store/ticketStore'

interface TicketDialogsProps {
  // Dialog open states
  isAddDialogOpen: boolean
  isEditDialogOpen: boolean
  isCapacityDialogOpen: boolean
  isDeleteDialogOpen: boolean

  // Dialog setters
  setIsAddDialogOpen: (open: boolean) => void
  setIsEditDialogOpen: (open: boolean) => void
  setIsCapacityDialogOpen: (open: boolean) => void
  setIsDeleteDialogOpen: (open: boolean) => void

  // Capacity state
  totalCapacity: number
  setTotalCapacity: (capacity: number) => void

  // Current ticket being edited/deleted
  currentTicket: Ticket | null

  // Form state
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

  // Event data
  eventDate?: Date
  eventEndTime?: string
  maxSaleEndDate?: Date

  // Form setters
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

  // Calendar state
  startDateCalendarOpen: boolean
  setStartDateCalendarOpen: (open: boolean) => void
  endDateCalendarOpen: boolean
  setEndDateCalendarOpen: (open: boolean) => void

  // Handlers
  handleAddTicket: () => Promise<void>
  handleUpdateTicket: () => Promise<void>
  handleDeleteTicket: () => Promise<void>
  handleUpdateCapacity: () => Promise<void>

  // Helper functions
  generateTimeOptions: string[]
  isEndDateDisabled?: (date: Date) => boolean
}

// Use React.memo to prevent unnecessary re-renders
const TicketDialogs: React.FC<TicketDialogsProps> = memo(({
  // Dialog open states
  isAddDialogOpen,
  isEditDialogOpen,
  isCapacityDialogOpen,
  isDeleteDialogOpen,

  // Dialog setters
  setIsAddDialogOpen,
  setIsEditDialogOpen,
  setIsCapacityDialogOpen,
  setIsDeleteDialogOpen,

  // Capacity state
  totalCapacity,
  setTotalCapacity,

  // Current ticket
  currentTicket,

  // Form state
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

  // Event data
  eventDate,
  eventEndTime,
  maxSaleEndDate,

  // Form setters
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

  // Calendar state
  startDateCalendarOpen,
  setStartDateCalendarOpen,
  endDateCalendarOpen,
  setEndDateCalendarOpen,

  // Handlers
  handleAddTicket,
  handleUpdateTicket,
  handleDeleteTicket,
  handleUpdateCapacity,

  // Helper functions
  generateTimeOptions,
  isEndDateDisabled,
}) => {
  // Get submission state directly from the store
  const isSubmitting = useTicketStore(state => state.isSubmitting);

  return (
    <>
      {/* Add Ticket Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg bg-white-100">
          <DialogHeader>
            <DialogTitle>Add Ticket</DialogTitle>
            <DialogDescription>
              Create a new ticket for your event.
            </DialogDescription>
          </DialogHeader>
          <TicketForm
            ticketType={ticketType}
            ticketName={ticketName}
            ticketCapacity={ticketCapacity}
            ticketPrice={ticketPrice}
            saleStartDate={saleStartDate}
            saleEndDate={saleEndDate}
            startTime={startTime}
            endTime={endTime}
            minPerOrder={minPerOrder}
            maxPerOrder={maxPerOrder}
            eventDate={eventDate}
            maxSaleEndDate={maxSaleEndDate}
            setTicketType={setTicketType}
            setTicketName={setTicketName}
            setTicketCapacity={setTicketCapacity}
            setTicketPrice={setTicketPrice}
            setSaleStartDate={setSaleStartDate}
            setSaleEndDate={setSaleEndDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            setMinPerOrder={setMinPerOrder}
            setMaxPerOrder={setMaxPerOrder}
            onCancel={() => setIsAddDialogOpen(false)}
            onSubmit={handleAddTicket}
            submitButtonText="Add Ticket"
            generateTimeOptions={generateTimeOptions}
            startDateCalendarOpen={startDateCalendarOpen}
            setStartDateCalendarOpen={setStartDateCalendarOpen}
            endDateCalendarOpen={endDateCalendarOpen}
            setEndDateCalendarOpen={setEndDateCalendarOpen}
            isEndDateDisabled={isEndDateDisabled}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Ticket Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg bg-white-100">
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogDescription>
              Update the details for {currentTicket?.name}.
            </DialogDescription>
          </DialogHeader>
          <TicketForm
            ticketType={ticketType}
            ticketName={ticketName}
            ticketCapacity={ticketCapacity}
            ticketPrice={ticketPrice}
            saleStartDate={saleStartDate}
            saleEndDate={saleEndDate}
            startTime={startTime}
            endTime={endTime}
            minPerOrder={minPerOrder}
            maxPerOrder={maxPerOrder}
            eventDate={eventDate}
            maxSaleEndDate={maxSaleEndDate}
            setTicketType={setTicketType}
            setTicketName={setTicketName}
            setTicketCapacity={setTicketCapacity}
            setTicketPrice={setTicketPrice}
            setSaleStartDate={setSaleStartDate}
            setSaleEndDate={setSaleEndDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            setMinPerOrder={setMinPerOrder}
            setMaxPerOrder={setMaxPerOrder}
            onCancel={() => setIsEditDialogOpen(false)}
            onSubmit={handleUpdateTicket}
            submitButtonText="Update Ticket"
            generateTimeOptions={generateTimeOptions}
            startDateCalendarOpen={startDateCalendarOpen}
            setStartDateCalendarOpen={setStartDateCalendarOpen}
            endDateCalendarOpen={endDateCalendarOpen}
            setEndDateCalendarOpen={setEndDateCalendarOpen}
            isEndDateDisabled={isEndDateDisabled}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Ticket Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white-100">
          <DialogHeader>
            <DialogTitle>Delete Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentTicket?.name}"?
            </DialogDescription>
          </DialogHeader>
          <p className="py-4">
            This action cannot be undone. This will permanently delete the ticket
            and remove it from our servers.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTicket}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Capacity Dialog */}
      <Dialog open={isCapacityDialogOpen} onOpenChange={setIsCapacityDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white-100">
          <DialogHeader>
            <DialogTitle>Update Event Capacity</DialogTitle>
            <DialogDescription>
              Set the maximum capacity for your event.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm mb-2 block">Total Capacity</label>
            <Input
              type="number"
              value={totalCapacity}
              onChange={(e) => setTotalCapacity(parseInt(e.target.value) || 0)}
              min={0}
              disabled={isSubmitting}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCapacityDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCapacity}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Capacity'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
})

TicketDialogs.displayName = 'TicketDialogs'

export default TicketDialogs