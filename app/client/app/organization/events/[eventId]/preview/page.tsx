'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Icon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import EventPreview from '@/app/organization/events/components/preview-ui/event-preview'
import { getEventById } from '@/lib/actions/event-actions'
import { toast } from 'sonner'

const EventPreviewPage = () => {
  const params = useParams()
  const eventId = params.eventId as string
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Event not found'}</p>
          <Button onClick={() => window.close()}>Close Preview</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => window.close()}
        >
          <Icon name="ChevronLeft" className="h-4 w-4" />
          Close Preview
        </Button>

        <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-600 text-sm">
          Preview Mode
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <EventPreview event={event} showTrigger={false} />
      </div>
    </div>
  )
}

export default EventPreviewPage
