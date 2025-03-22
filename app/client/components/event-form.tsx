/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/EventForm.tsx
'use client'

import React, { useEffect } from 'react'
import { useEventHooks } from '@/hooks/use-event'
import { EventFormUI } from '@/components/event-ui/event-form-ui'
import { useEventProgress } from '@/context/event-context'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface EventFormProps {
  initialData?: EventData
  onSubmit?: (data: EventData) => Promise<any>
  submitButtonText?: string
}

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText = 'Save and continue',
}) => {
  const router = useRouter()

  // Use the event progress context
  const {
    eventId,
    setEventId,
    setEventTitle,
    setEventDate,
    setEventLocation,
    markStepCompleted,
    setActiveStep,
  } = useEventProgress()

  // Use the custom hook to get all state and handlers
  const eventHook = useEventHooks({ initialData })

  // Update context when initialData changes
  useEffect(() => {
    if (initialData) {
      setEventTitle(initialData.title)
      if (initialData.date) {
        setEventDate(initialData.date)
      }
    }
  }, [initialData, setEventTitle, setEventDate])

  // Update context when form data changes
  useEffect(() => {
    if (eventHook.eventData.title) {
      setEventTitle(eventHook.eventData.title)
    }
    if (eventHook.eventData.date) {
      setEventDate(eventHook.eventData.date)
    }
    if (eventHook.eventData.location) {
      setEventLocation(eventHook.eventData.location)
    }
  }, [
    eventHook.eventData.title,
    eventHook.eventData.date,
    setEventTitle,
    setEventDate,
    eventHook.eventData.location,
    setEventLocation,
  ])
  // If custom onSubmit is provided, override the default handler
  const handleSubmit = async () => {
    if (!eventHook.validateEventData()) {
      return
    }

    try {
      // Format the event data before sending it
      const formattedAgenda = eventHook.agendas.map((agenda) => ({
        id: agenda.id,
        title: agenda.title || 'Untitled Agenda',
        active: agenda.active,
        items: agenda.items.map((item) => ({
          id: item.id,
          title: item.title || 'Untitled Item',
          description: item.description || '',
          host: item.host || '',
          startTime: item.startTime || '',
          endTime: item.endTime || '',
          isNew: item.isNew,
        })),
      }))

      const eventPayload = {
        ...eventHook.eventData,
        agenda: formattedAgenda,
      }

      let result
      let currentEventId = eventId // Use existing eventId if available

      if (onSubmit) {
        result = await onSubmit(eventPayload)
        // If we're updating, the eventId is already set
        if (result && result.eventId) {
          currentEventId = result.eventId
        }
      } else {
        result = await eventHook.handleSubmit()
        if (result && result.eventId) {
          currentEventId = result.eventId
        }
      }

      // Check if we have a valid eventId to proceed
      if (currentEventId) {
        console.log('Using event ID:', currentEventId)

        // Update context
        setEventId(currentEventId)
        markStepCompleted('build')
        setActiveStep('tickets')

        // Make sure event title and date are set in context
        setEventTitle(eventHook.eventData.title || 'Event Title')
        if (eventHook.eventData.date) {
          setEventDate(eventHook.eventData.date)
        }
        if (eventHook.eventData.location) {
          setEventLocation(eventHook.eventData.location)
        }

        // Force localStorage update synchronously before navigation
        const progressData = {
          eventId: currentEventId,
          eventTitle: eventHook.eventData.title || 'Event Title',
          eventDate: eventHook.eventData.date || null,
          eventLocation: eventHook.eventData.location || null,
          eventStatus: 'draft',
          activeStep: 'tickets',
          completedSteps: ['build'],
        }
        localStorage.setItem('eventProgress', JSON.stringify(progressData))

        // Add a small delay to ensure context updates are processed
        setTimeout(() => {
          router.push(`/organization/events/${currentEventId}/ticket`)
        }, 100)
      } else {
        console.log('Invalid or missing eventId:', result)
        toast.error("Event operation completed but couldn't determine event ID")
      }
    } catch (error) {
      console.log('Error submitting event:', error)
      toast.error('Failed to save event. Please try again.')
    }
  }

  return (
    <EventFormUI
      {...eventHook}
      handleSubmit={handleSubmit}
      submitButtonText={submitButtonText}
    />
  )
}

export default EventForm
