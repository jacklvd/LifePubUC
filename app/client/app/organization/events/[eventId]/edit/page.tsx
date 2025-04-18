/* eslint-disable @typescript-eslint/no-explicit-any */
// app/organization/events/[eventId]/edit/page.tsx
'use client'

import React, { useEffect, useState, use } from 'react'
import EventForm from '@/app/organization/events/components/form-ui/event-form'
import { getEventById, updateEvent } from '@/lib/actions/event-actions'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress' // Assuming you have a loading component
import { useEventProgress } from '@/context/event-context'
import EventFlowLayout from '@/app/organization/events/components/event-flow-layout'
import EventFallBack from '@/components/event-fallback'

interface EditEventPageProps {
  params: Promise<{
    eventId: string
    email: string
  }>
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const { eventId, email } = use(params)
  const [eventData, setEventData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { markStepCompleted, setEventStatus } = useEventProgress()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEventById(eventId)
        if (!event) {
          toast.error('Event not found')
          return
        }
        setEventData(event)

        // Always mark build as completed in edit mode
        markStepCompleted('build')

        // If the event has tickets, mark tickets as completed
        if (event.tickets && event.tickets.length > 0) {
          markStepCompleted('tickets')
        }

        // Set the event status
        setEventStatus(event.status || 'draft')
      } catch (err) {
        console.error('Error fetching event:', err)
        setError('Failed to load event data')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId, markStepCompleted, setEventStatus])

  const handleSubmit = async (updatedData: EventData) => {
    try {
      const result = await updateEvent(eventId, updatedData, email)

      if (!result) {
        throw new Error('Failed to update event')
      }

      toast.success('Event updated successfully!')

      // Return the result with eventId to match expected format
      return {
        eventId: eventId,
        ...result,
      }
    } catch (error) {
      console.error('Error updating event:', error)
      toast.warning('Failed to update event. Please try again.')
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Progress value={33} />
      </div>
    )
  }

  if (error || !eventData) {
    return <EventFallBack error={error} />
  }

  return (
    <EventFlowLayout>
      <EventForm
        initialData={eventData}
        onSubmit={handleSubmit}
        submitButtonText="Update Event"
      />
    </EventFlowLayout>
  )
}
