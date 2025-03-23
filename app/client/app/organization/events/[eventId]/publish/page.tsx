/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, use, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { getEventById, publishEvent } from '@/lib/actions/event-actions'
import { useEventProgress } from '@/context/event-context'
import EventFlowLayout from '@/components/event-ui/event-flow-layout'
import { formatDate } from '@/lib/date-formatter'
import EventFallBack from '@/components/event-fallback'

interface PublishPageProps {
  params: Promise<{
    eventId: string
    email: string
  }>
}

export default function PublishPage({ params }: PublishPageProps) {
  const { eventId, email } = use(params)
  const router = useRouter()

  // Use the event progress context
  const {
    isEditing,
    setEventId,
    setEventTitle,
    setEventDate,
    setActiveStep,
    markStepCompleted,
    completedSteps,
    setEventStatus,
  } = useEventProgress()

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  // const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  // Checklist states
  const [detailsChecked, setDetailsChecked] = useState(false)
  const [ticketsChecked, setTicketsChecked] = useState(false)
  const [termsChecked, setTermsChecked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch event data
  // Add useCallback for functions that are used in useEffect dependencies
  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch event details
      const eventData = await getEventById(eventId)
      if (!eventData) {
        toast.error('Event not found')
        return
      }
      setEvent(eventData)

      // Update progress context
      setEventId(eventId)
      setEventTitle(eventData?.title)
      setEventDate(formatDate(eventData?.date, 'display'))
      setActiveStep('publish')

      // Check if previous steps are completed
      if (!completedSteps.includes('build')) {
        markStepCompleted('build')
      }

      if (
        !completedSteps.includes('tickets') &&
        eventData?.tickets?.length > 0
      ) {
        markStepCompleted('tickets')
      }
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error('Failed to load event data')
      setError('Failed to load event data')
      setEvent(null)
    } finally {
      setLoading(false)
    }
  }, [
    eventId,
    setEventId,
    setEventTitle,
    setEventDate,
    setActiveStep,
    markStepCompleted,
    completedSteps,
  ])

  // Use useRef to track if the component is mounted
  const isMounted = useRef(false)

  // Modify your useEffect
  useEffect(() => {
    // Only fetch on first render
    if (!isMounted.current) {
      fetchEvent()
      isMounted.current = true
    }
  }, [fetchEvent])

  // For the redirect effect, use a separate useEffect with a ref to prevent multiple redirects
  const redirectAttempted = useRef(false)

  useEffect(() => {
    if (
      !loading &&
      !isEditing &&
      !completedSteps.includes('tickets') &&
      !redirectAttempted.current
    ) {
      redirectAttempted.current = true
      router.push(`/organization/events/${eventId}/ticket`)
    }
  }, [isEditing, completedSteps, eventId, router, loading])

  // Determine if publish is ready
  const isReadyToPublish = detailsChecked && ticketsChecked && termsChecked

  const handlePublish = useCallback(async () => {
    if (!completedSteps.includes('tickets')) {
      toast.error('You must complete the tickets step before publishing')
      return
    }
    if (!isReadyToPublish) {
      toast.error('Please complete all required steps before publishing')
      return
    }

    try {
      setPublishing(true)

      // Pre-validate locally before sending to server
      const validationErrors = []

      // Check for tickets
      if (!event.tickets || event.tickets.length === 0) {
        validationErrors.push('At least one ticket type is required')
      } else {
        // Check if tickets have valid dates
        const eventDate = new Date(event.date)

        const invalidTickets = event.tickets.filter(
          (ticket: { saleEnd: string | number | Date; capacity: number }) => {
            const saleEnd = new Date(ticket.saleEnd)
            return ticket.capacity <= 0 || saleEnd > eventDate
          },
        )

        if (invalidTickets.length > 0) {
          validationErrors.push(
            'Some tickets have invalid capacity or sale end dates',
          )
        }
      }

      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => toast.error(error))
        setPublishing(false)
        return
      }

      // Update event status to published
      await publishEvent(eventId, email)

      // Update context
      markStepCompleted('publish')
      setEventStatus('on sale')

      toast.success('Event published successfully!')

      // Redirect to event page
      router.push(`/organization/events/${eventId}`)
    } catch (error: any) {
      console.error('Error publishing event:', error)

      // Handle structured error responses
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err: string) => toast.error(err))
      } else {
        toast.error(error.message || 'Failed to publish event')
      }
    } finally {
      setPublishing(false)
    }
  }, [
    completedSteps,
    isReadyToPublish,
    event.tickets,
    event.date,
    eventId,
    email,
    markStepCompleted,
    setEventStatus,
    router,
  ])

  if (error || (!loading && !event)) {
    return <EventFallBack error={error || 'Event not found'} />
  }

  const handleOpenPreview = () => {
    // Open preview in new tab
    window.open(`/events/${eventId}/preview`, '_blank')
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="text-center">
          <p>Loading event information...</p>
        </div>
      </div>
    )
  }

  return (
    <EventFlowLayout>
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Publish Your Event</h1>

            <div className="space-y-6">
              <Card className="bg-white-100">
                <CardHeader>
                  <CardTitle>Review and Publish</CardTitle>
                  <CardDescription>
                    Complete the checklist before publishing your event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="details"
                        checked={detailsChecked}
                        onCheckedChange={(checked) =>
                          setDetailsChecked(checked as boolean)
                        }
                      />
                      <div>
                        <label
                          htmlFor="details"
                          className="font-medium cursor-pointer"
                        >
                          Event details are complete
                        </label>
                        <p className="text-sm text-gray-500">
                          Ensure all event information is accurate and complete
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="tickets"
                        checked={ticketsChecked}
                        onCheckedChange={(checked) =>
                          setTicketsChecked(checked as boolean)
                        }
                      />
                      <div>
                        <label
                          htmlFor="tickets"
                          className="font-medium cursor-pointer"
                        >
                          Ticket information is correct
                        </label>
                        <p className="text-sm text-gray-500">
                          Verify ticket types, prices, and availability
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={termsChecked}
                        onCheckedChange={(checked) =>
                          setTermsChecked(checked as boolean)
                        }
                      />
                      <div>
                        <label
                          htmlFor="terms"
                          className="font-medium cursor-pointer"
                        >
                          I agree to the terms and conditions
                        </label>
                        <p className="text-sm text-gray-500">
                          By publishing this event, you agree to our terms and
                          conditions
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white-100">
                <CardHeader>
                  <CardTitle>Preview Your Event</CardTitle>
                  <CardDescription>
                    See how your event will appear to attendees
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleOpenPreview}
                  >
                    Preview Event
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/organization/events/${eventId}/ticket`)
                  }
                >
                  Back to Tickets
                </Button>

                <Button
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!isReadyToPublish || publishing}
                  onClick={handlePublish}
                >
                  {publishing ? 'Publishing...' : 'Publish Event'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EventFlowLayout>
  )
}
