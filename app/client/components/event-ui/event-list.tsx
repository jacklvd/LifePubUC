'use client'
import React, { useState } from 'react'
import EventCard from '@/components/event-ui/event-card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Icon } from '@/components/icons'
import Image from 'next/image'

interface EventListProps {
  events: Event[]
  onDelete: (eventId: string) => void
}

const EventList: React.FC<EventListProps> = ({ events = [], onDelete }) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)

  // Handle delete initiation
  const handleDeleteInitiate = (eventId: string) => {
    setEventToDelete(eventId)
    setDeleteConfirmOpen(true)
  }

  // Confirm and execute delete
  const handleDeleteConfirm = () => {
    if (eventToDelete && onDelete) {
      onDelete(eventToDelete)
    }
    setDeleteConfirmOpen(false)
    setEventToDelete(null)
  }

  // If there are no events, show empty state
  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-6 p-2">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/1869/1869397.png"
            alt="Calendar icon"
            className="w-20 h-20"
            width={80}
            height={80}
          />
        </div>
        <p className="text-gray-500 mb-8">No events to show</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          onDelete={handleDeleteInitiate}
        />
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-white-100">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              <Icon name="Trash" className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EventList
