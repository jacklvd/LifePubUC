'use client'

import React, { useState, useEffect, useCallback, useRef, use } from 'react'
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
import EventPreview from '@/components/event-ui/event-preview'

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Checklist states
  const [detailsChecked, setDetailsChecked] = useState(false)
  const [ticketsChecked, setTicketsChecked] = useState(false)
  const [termsChecked, setTermsChecked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch event data
  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch event details
      const eventData = await getEventById(eventId, email)
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

  // Fetch on first render
  useEffect(() => {
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
    event?.tickets,
    event?.date,
    eventId,
    email,
    markStepCompleted,
    setEventStatus,
    router,
  ])

  const handleOpenPreview = () => {
    // Open inline preview
    setIsPreviewOpen(true)
  }

  if (error || (!loading && !event)) {
    return <EventFallBack error={error || 'Event not found'} />
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
      <div className="flex flex-col bg-gray-50 min-h-screen">
        <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
              Publish Your Event
            </h1>

            <div className="space-y-4 sm:space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">
                    Review and Publish
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Complete the checklist before publishing your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pb-5 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Checkbox
                        id="details"
                        checked={detailsChecked}
                        onCheckedChange={(checked) =>
                          setDetailsChecked(checked as boolean)
                        }
                        className="mt-0.5"
                      />
                      <div>
                        <label
                          htmlFor="details"
                          className="font-medium cursor-pointer text-sm sm:text-base"
                        >
                          Event details are complete
                        </label>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Ensure all event information is accurate and complete
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Checkbox
                        id="tickets"
                        checked={ticketsChecked}
                        onCheckedChange={(checked) =>
                          setTicketsChecked(checked as boolean)
                        }
                        className="mt-0.5"
                      />
                      <div>
                        <label
                          htmlFor="tickets"
                          className="font-medium cursor-pointer text-sm sm:text-base"
                        >
                          Ticket information is correct
                        </label>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Verify ticket types, prices, and availability
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Checkbox
                        id="terms"
                        checked={termsChecked}
                        onCheckedChange={(checked) =>
                          setTermsChecked(checked as boolean)
                        }
                        className="mt-0.5"
                      />
                      <div>
                        <label
                          htmlFor="terms"
                          className="font-medium cursor-pointer text-sm sm:text-base"
                        >
                          I agree to the terms and conditions
                        </label>
                        <p className="text-xs sm:text-sm text-gray-500">
                          By publishing this event, you agree to our terms and
                          conditions
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">
                    Preview Your Event
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    See how your event will appear to attendees
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pb-5 sm:p-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
                  {/* Option 1: Open inline modal/sheet preview */}
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                    size="sm"
                    onClick={handleOpenPreview}
                  >
                    Preview Event
                  </Button>

                  {/* Option 2: Open in new tab */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                    onClick={() =>
                      window.open(
                        `/organization/events/${eventId}/preview`,
                        '_blank',
                      )
                    }
                  >
                    Open in New Tab
                  </Button>
                </CardContent>
              </Card>

              {/* Event Summary Card */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">
                    Event Summary
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Quick overview of your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pb-5 sm:p-6">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                          Event Name
                        </h3>
                        <p className="text-sm sm:text-base truncate">
                          {event.title}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                          Date & Time
                        </h3>
                        <p className="text-sm sm:text-base">
                          {formatDate(event.date, 'display')}, {event.startTime}{' '}
                          - {event.endTime}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                          Location
                        </h3>
                        <p className="text-sm sm:text-base truncate">
                          {event.location}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                          Capacity
                        </h3>
                        <p className="text-sm sm:text-base">
                          {event.totalCapacity || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                        Tickets ({event.tickets?.length || 0})
                      </h3>
                      {event.tickets && event.tickets.length > 0 ? (
                        <ul className="mt-1 space-y-1">
                          {event.tickets.slice(0, 3).map((ticket: any) => (
                            <li key={ticket.id} className="text-xs sm:text-sm">
                              {ticket.name}:{' '}
                              {ticket.type === 'Free'
                                ? 'Free'
                                : `$${ticket.price}`}{' '}
                              ({ticket.capacity} available)
                            </li>
                          ))}
                          {event.tickets.length > 3 && (
                            <li className="text-xs sm:text-sm text-gray-500">
                              +{event.tickets.length - 3} more ticket types
                            </li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-500">
                          No tickets created
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm order-2 sm:order-1"
                  onClick={() =>
                    router.push(`/organization/events/${eventId}/ticket`)
                  }
                >
                  Back to Tickets
                </Button>

                <Button
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm order-1 sm:order-2"
                  size="sm"
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

      {/* Preview component (will only show when isPreviewOpen is true) */}
      <EventPreview
        event={event}
        isPreviewOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        triggerClass="hidden" // Hide the default trigger button
      />
    </EventFlowLayout>
  )
}
