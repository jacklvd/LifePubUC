/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/ticket-ui/ticket-dialogs.tsx
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import TicketForm from './ticket-form'
import { useTicketManagement } from '@/hooks/use-ticket'

interface TicketDialogsProps {
    // Add dialog
    isAddDialogOpen: boolean
    setIsAddDialogOpen: (open: boolean) => void

    // Edit dialog
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void

    // Capacity dialog
    isCapacityDialogOpen: boolean
    setIsCapacityDialogOpen: (open: boolean) => void
    totalCapacity: number
    setTotalCapacity: (capacity: number) => void

    // Delete dialog
    isDeleteDialogOpen: boolean
    setIsDeleteDialogOpen: (open: boolean) => void
    currentTicket: Ticket | null

    // Form props
    ticketType: "Free" | "Paid" | "Donation"
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

    // Form setters
    setTicketType: (type: "Free" | "Paid" | "Donation") => void
    setTicketName: (name: string) => void
    setTicketCapacity: (capacity: number) => void
    setTicketPrice: (price: number | undefined) => void
    setSaleStartDate: (date: Date | undefined) => void
    setSaleEndDate: (date: Date | undefined) => void
    setStartTime: (time: string) => void
    setEndTime: (time: string) => void
    setMinPerOrder: (min: number) => void
    setMaxPerOrder: (max: number) => void

    // Handlers
    handleAddTicket: () => Promise<void>
    handleUpdateTicket: () => Promise<void>
    handleDeleteTicket: () => Promise<void>
    handleUpdateCapacity: () => Promise<void>

    // Optional prop for generating time options
    generateTimeOptions: () => string[]
    startDateCalendarOpen: boolean
    setStartDateCalendarOpen: (open: boolean) => void
    endDateCalendarOpen: boolean
    setEndDateCalendarOpen: (open: boolean) => void
    isEndDateDisabled: (date: Date) => boolean
}

const TicketDialogs: React.FC<TicketDialogsProps> = ({
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isCapacityDialogOpen,
    setIsCapacityDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    totalCapacity,
    setTotalCapacity,
    currentTicket,
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
    handleAddTicket,
    handleUpdateTicket,
    handleDeleteTicket,
    handleUpdateCapacity,
    generateTimeOptions,
    startDateCalendarOpen,
    setStartDateCalendarOpen,
    endDateCalendarOpen,
    setEndDateCalendarOpen,
    isEndDateDisabled
}) => {
    return (
        <>
            {/* Add Ticket Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white-100">
                    <DialogHeader>
                        <DialogTitle>Add New Ticket</DialogTitle>
                        <DialogDescription>
                            Create a new ticket for your event
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
                        submitButtonText="Create Ticket"
                        generateTimeOptions={generateTimeOptions}
                        startDateCalendarOpen={startDateCalendarOpen}
                        setStartDateCalendarOpen={setStartDateCalendarOpen}
                        endDateCalendarOpen={endDateCalendarOpen}
                        setEndDateCalendarOpen={setEndDateCalendarOpen}
                        isEndDateDisabled={isEndDateDisabled}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Ticket Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white-100">
                    <DialogHeader>
                        <DialogTitle>Edit ticket</DialogTitle>
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
                        submitButtonText="Save"
                        generateTimeOptions={generateTimeOptions}
                        startDateCalendarOpen={startDateCalendarOpen}
                        setStartDateCalendarOpen={setStartDateCalendarOpen}
                        endDateCalendarOpen={endDateCalendarOpen}
                        setEndDateCalendarOpen={setEndDateCalendarOpen}
                        isEndDateDisabled={isEndDateDisabled}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Capacity Dialog */}
            <Dialog open={isCapacityDialogOpen} onOpenChange={setIsCapacityDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white-100">
                    <DialogHeader>
                        <DialogTitle>Event capacity</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <p className="text-sm text-gray-500">
                            Event capacity is the total number of tickets available for sale at your event.
                            When you set an event capacity, your event will sell out as soon as you sell that
                            number of total tickets. You can adjust your event capacity to prevent overselling.
                        </p>

                        <div>
                            <label className="text-sm">Capacity*</label>
                            <Input
                                type="number"
                                value={totalCapacity}
                                onChange={(e) => setTotalCapacity(parseInt(e.target.value) || 0)}
                                min={0}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCapacityDialogOpen(false)}>Cancel</Button>
                        <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleUpdateCapacity}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white-100">
                    <DialogHeader>
                        <DialogTitle>Delete ticket</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <p>
                            Are you sure you want to delete the &quot;{currentTicket?.name}&quot; ticket?
                            This action cannot be undone.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteTicket}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default TicketDialogs