/* eslint-disable @typescript-eslint/no-explicit-any */
// app/organization/events/[eventId]/ticket/page.tsx
'use client'

import React, { use, useEffect, useState } from 'react'
import EventFlowLayout from '@/components/event-ui/event-flow-layout'
import TicketUI from '@/components/ticket-ui'
import EventFallBack from '@/components/event-fallback'
import { getEventById } from '@/lib/actions/event-action'

interface TicketPageProps {
  params: Promise<{
    eventId: string
  }>
}

export default function TicketManagementPage({ params }: TicketPageProps) {
  const { eventId } = use(params)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verify the event exists at the page level
    const checkEvent = async () => {
      try {
        const eventData = await getEventById(eventId)
        if (!eventData || eventData.error) {
          setError(eventData?.error || 'Event not found')
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load event')
      } finally {
        setLoading(false)
      }
    }
    checkEvent()
  }, [eventId])

  if (loading) {
    return <div className="flex-1 justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <EventFallBack error={error} />
  }
  return (
    <EventFlowLayout>
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-auto">
          <TicketUI eventId={eventId} />
        </div>
      </div>
    </EventFlowLayout>
  )
}
