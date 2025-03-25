/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { Icon } from '../../../../../components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'

interface EventPreviewProps {
  event: any
  isPreviewOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
  triggerClass?: string
}

const EventPreview: React.FC<EventPreviewProps> = ({
  event,
  isPreviewOpen,
  onOpenChange,
  showTrigger = true,
  triggerClass,
}) => {
  if (!event) return null

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMMM d, yyyy')
    } catch (error: any) {
      return error.message || 'Invalid date'
    }
  }

  const renderPreviewContent = () => (
    <div className="space-y-6 overflow-y-auto max-h-full pb-20 px-2 sm:px-0">
      {/* Event header with image */}
      <div className="space-y-4">
        <div className="relative w-full h-40 sm:h-48 rounded-lg overflow-hidden">
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

        <h1 className="text-xl sm:text-2xl font-bold">{event.title}</h1>
        <p className="text-sm sm:text-base text-gray-600">{event.summary}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon
              name="Calendar"
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0"
            />
            <span className="text-sm sm:text-base truncate">
              {formatDate(event.date)}
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

      {/* Event description */}
      {event.description && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">
              Event Description
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <p className="whitespace-pre-line text-sm sm:text-base">
              {event.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Agenda */}
      {event.agenda && event.agenda.length > 0 && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Event Agenda</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="space-y-4">
              {event.agenda.map((section: any) => (
                <div key={section.id} className="border-b pb-3 last:border-0">
                  <h3 className="font-medium text-sm sm:text-base mb-2">
                    {section.title}
                  </h3>

                  {section.items && section.items.length > 0 ? (
                    <div className="space-y-3 pl-2 sm:pl-4">
                      {section.items.map((item: any) => (
                        <div
                          key={item.id}
                          className="border-l-2 border-gray-200 pl-3 py-1"
                        >
                          <p className="font-medium text-xs sm:text-sm">
                            {item.title}
                          </p>

                          {(item.startTime || item.endTime) && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.startTime && item.endTime
                                ? `${item.startTime} - ${item.endTime}`
                                : item.startTime || item.endTime}
                            </p>
                          )}

                          {item.host && (
                            <p className="text-xs sm:text-sm mt-1">
                              <span className="font-medium">Host:</span>{' '}
                              {item.host}
                            </p>
                          )}

                          {item.description && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500">
                      No items in this section
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tickets preview */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          {event.tickets && event.tickets.length > 0 ? (
            <div className="space-y-3">
              {event.tickets.map((ticket: any) => (
                <div key={ticket.id} className="border rounded-md p-2 sm:p-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">
                        {ticket.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {ticket.type === 'Free'
                          ? 'Free'
                          : ticket.type === 'Donation'
                            ? 'Donation'
                            : `$${ticket.price?.toFixed(2)}`}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 self-start">
                      <span className="text-xs">
                        {ticket.capacity} available
                      </span>
                    </Badge>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Sale: {formatDate(ticket.saleStart)} -{' '}
                    {formatDate(ticket.saleEnd)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Icon
                name="Ticket"
                className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-2"
              />
              <p className="text-xs sm:text-sm text-gray-500">
                No tickets have been created yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Highlights */}
      {event.highlights &&
        Object.keys(event.highlights).some(
          (key) => !!event.highlights[key],
        ) && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Event Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {event.highlights.ageRestriction && (
                <div className="space-y-1">
                  <h3 className="font-medium text-xs sm:text-sm text-gray-500">
                    Age Restriction
                  </h3>
                  <p className="text-sm sm:text-base">
                    {event.highlights.ageRestriction}
                  </p>
                </div>
              )}

              {event.highlights.doorTime && (
                <div className="space-y-1">
                  <h3 className="font-medium text-xs sm:text-sm text-gray-500">
                    Door Time
                  </h3>
                  <p className="text-sm sm:text-base">
                    {event.highlights.doorTime}
                  </p>
                </div>
              )}

              {event.highlights.parkingInfo && (
                <div className="space-y-1">
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

      {/* FAQs */}
      {event.faqs && event.faqs.length > 0 && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">FAQs</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            {event.faqs.map((faq: any, index: number) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <h3 className="font-medium mb-1 text-sm sm:text-base">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )

  // Option 1: Sheet component for slide-in preview
  if (onOpenChange !== undefined) {
    return (
      <Sheet open={isPreviewOpen} onOpenChange={onOpenChange}>
        {showTrigger && (
          <SheetTrigger asChild>
            <Button className={triggerClass}>Preview Event</Button>
          </SheetTrigger>
        )}
        <SheetContent
          side="right"
          className="h-[125vh] sm:h-full w-full sm:max-w-md md:max-w-lg lg:max-w-xl bg-white-100"
        >
          <SheetHeader className="mb-4 sm:mb-6">
            <SheetTitle className="text-lg">Event Preview</SheetTitle>
            <SheetDescription className="text-sm">
              This is how your event will appear to attendees
            </SheetDescription>
          </SheetHeader>

          {renderPreviewContent()}

          <SheetFooter className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-white-100 border-t">
            <SheetClose asChild>
              <Button className="w-full">Close Preview</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  // Option 2: Direct render (for standalone preview pages)
  return renderPreviewContent()
}

export default EventPreview
