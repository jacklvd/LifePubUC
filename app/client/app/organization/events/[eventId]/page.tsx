'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { Icon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getEventById } from '@/lib/actions/event-actions'
import { toast } from 'sonner'

const EventDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const eventId = params.eventId as string
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comingFromPublish, setComingFromPublish] = useState(false)

  // Fetch event data
  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true)
      const eventData = await getEventById(eventId)
      if (!eventData) {
        toast.error('Event not found')
        setError('Event not found')
        return
      }
      setEvent(eventData)

      // Check if coming from publish page
      const referrer = document.referrer
      setComingFromPublish(referrer.includes('/publish'))
    } catch (error: any) {
      console.error('Error fetching event:', error)
      toast.error('Failed to load event data')
      setError(error.message || 'Failed to load event data')
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  const formatDateTime = (date: string, time: string) => {
    try {
      return `${format(new Date(date), 'MMMM d, yyyy')} at ${time}`
    } catch (error) {
      return `${date} at ${time}`
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Draft
          </Badge>
        )
      case 'on sale':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            On Sale
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleBack = () => {
    if (comingFromPublish) {
      router.push(`/organization/events/${eventId}/publish`)
    } else {
      router.push('/organization/events')
    }
  }

  const handleEdit = () => {
    router.push(`/organization/events/${eventId}/edit`)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl">Loading event information...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Icon
            name="AlertCircle"
            className="h-12 w-12 text-red-500 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Event not found'}</p>
          <Button onClick={() => router.push('/organization/events')}>
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-8">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-fit"
          onClick={handleBack}
        >
          <Icon name="ChevronLeft" className="h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {getStatusBadge(event.status)}
          {event.status === 'draft' && (
            <Button
              onClick={() =>
                router.push(`/organization/events/${eventId}/publish`)
              }
              className="bg-green-600 hover:bg-green-700 text-sm sm:text-base"
              size="sm"
            >
              Publish Event
            </Button>
          )}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            size="sm"
            onClick={handleEdit}
          >
            <Icon name="Pencil" className="h-4 w-4" />
            <span className="sm:inline">Edit</span>
          </Button>
        </div>
      </div>

      {/* Event header */}
      <div className="mb-6 sm:mb-8">
        <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-4 sm:mb-6">
          {event.media ? (
            <Image
              src={event.media}
              alt={event.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-sm sm:text-base">
                No image available
              </p>
            </div>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{event.title}</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          {event.summary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Icon
              name="Calendar"
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0"
            />
            <span className="text-sm sm:text-base">
              {format(new Date(event.date), 'MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon
              name="Clock"
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0"
            />
            <span className="text-sm sm:text-base">
              {event.startTime} - {event.endTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon
              name="MapPin"
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0"
            />
            <span className="text-sm sm:text-base break-words">
              {event.location}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="details" className="text-xs sm:text-sm py-2">
            Details
          </TabsTrigger>
          <TabsTrigger value="tickets" className="text-xs sm:text-sm py-2">
            Tickets
          </TabsTrigger>
          <TabsTrigger value="agenda" className="text-xs sm:text-sm py-2">
            Agenda
          </TabsTrigger>
          <TabsTrigger value="faqs" className="text-xs sm:text-sm py-2">
            FAQs
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4 sm:space-y-6 mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                Event Description
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pb-6 sm:p-6">
              <p className="whitespace-pre-line text-sm sm:text-base">
                {event.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {event.highlights && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  Event Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pb-6 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {event.highlights.ageRestriction && (
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium text-xs sm:text-sm text-gray-500">
                      Age Restriction
                    </h3>
                    <p className="text-sm sm:text-base">
                      {event.highlights.ageRestriction}
                    </p>
                  </div>
                )}

                {event.highlights.doorTime && (
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium text-xs sm:text-sm text-gray-500">
                      Door Time
                    </h3>
                    <p className="text-sm sm:text-base">
                      {event.highlights.doorTime}
                    </p>
                  </div>
                )}

                {event.highlights.parkingInfo && (
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium text-xs sm:text-sm text-gray-500">
                      Parking
                    </h3>
                    <p className="text-sm sm:text-base">
                      {event.highlights.parkingInfo}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Event Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pb-6 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base">Status</span>
                <span className="font-medium text-sm sm:text-base">
                  {event.status}
                </span>
              </div>

              {event.totalCapacity && (
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base">Total Capacity</span>
                  <span className="font-medium text-sm sm:text-base">
                    {event.totalCapacity}
                  </span>
                </div>
              )}

              {event.publishedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base">Published Date</span>
                  <span className="font-medium text-sm sm:text-base">
                    {format(new Date(event.publishedAt), 'MMMM d, yyyy')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4 sm:space-y-6 mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Tickets</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Total Capacity: {event.totalCapacity || 'Not specified'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pb-6 sm:p-6">
              {event.tickets && event.tickets.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {event.tickets.map((ticket: any) => (
                    <Card
                      key={ticket.id}
                      className="border-l-4 border-blue-500"
                    >
                      <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                          <div>
                            <CardTitle className="text-base sm:text-lg">
                              {ticket.name}
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                              {ticket.type === 'Free'
                                ? 'Free'
                                : ticket.type === 'Donation'
                                  ? 'Donation'
                                  : `${ticket.price?.toFixed(2)}`}
                            </CardDescription>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 self-start text-xs sm:text-sm whitespace-nowrap">
                            {ticket.sold} / {ticket.capacity} sold
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 pt-1 sm:pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                          <div>
                            <span className="font-medium">Sale Period:</span>{' '}
                            <span className="break-words">
                              {format(new Date(ticket.saleStart), 'MMM d')} -{' '}
                              {format(new Date(ticket.saleEnd), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Time:</span>{' '}
                            <span className="break-words">
                              {ticket.startTime} - {ticket.endTime}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              Min/Max Per Order:
                            </span>{' '}
                            <span>
                              {ticket.minPerOrder}/{ticket.maxPerOrder}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Icon
                    name="Ticket"
                    className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3"
                  />
                  <p className="text-sm sm:text-base text-gray-500">
                    No tickets have been created yet.
                  </p>
                  <Button
                    className="mt-3 sm:mt-4 text-xs sm:text-sm"
                    size="sm"
                    onClick={() =>
                      router.push(`/organization/events/${eventId}/ticket`)
                    }
                  >
                    Add Tickets
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agenda Tab */}
        <TabsContent value="agenda" className="space-y-4 sm:space-y-6 mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Event Agenda</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pb-6 sm:p-6">
              {event.agenda && event.agenda.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {event.agenda.map((section: any) => (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="text-sm sm:text-lg font-medium py-3 px-2">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 sm:space-y-4 pl-0 sm:pl-2">
                          {section.items &&
                            section.items.map((item: any) => (
                              <div
                                key={item.id}
                                className="border-l-2 border-gray-200 pl-3 sm:pl-4 py-2"
                              >
                                <h4 className="font-medium text-sm sm:text-base">
                                  {item.title}
                                </h4>
                                {item.startTime && item.endTime && (
                                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {item.startTime} - {item.endTime}
                                  </p>
                                )}
                                {item.host && (
                                  <p className="text-xs sm:text-sm mt-1">
                                    <span className="font-medium">Host:</span>{' '}
                                    {item.host}
                                  </p>
                                )}
                                {item.description && (
                                  <p className="mt-2 text-xs sm:text-sm">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Icon
                    name="Clock"
                    className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3"
                  />
                  <p className="text-sm sm:text-base text-gray-500">
                    No agenda items have been added yet.
                  </p>
                  <Button
                    className="mt-3 sm:mt-4 text-xs sm:text-sm"
                    size="sm"
                    onClick={() =>
                      router.push(`/organization/events/${eventId}/edit`)
                    }
                  >
                    Edit Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4 sm:space-y-6 mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pb-6 sm:p-6">
              {event.faqs && event.faqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {event.faqs.map((faq: any, index: number) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left font-medium text-sm sm:text-base py-3 px-2">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="whitespace-pre-line text-xs sm:text-sm">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Icon
                    name="Info"
                    className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3"
                  />
                  <p className="text-sm sm:text-base text-gray-500">
                    No FAQs have been added yet.
                  </p>
                  <Button
                    className="mt-3 sm:mt-4 text-xs sm:text-sm"
                    size="sm"
                    onClick={() =>
                      router.push(`/organization/events/${eventId}/edit`)
                    }
                  >
                    Edit Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EventDetailPage
