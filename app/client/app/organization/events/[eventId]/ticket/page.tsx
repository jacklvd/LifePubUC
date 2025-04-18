/* eslint-disable @typescript-eslint/no-explicit-any */
// app/organization/events/[eventId]/ticket/page.tsx
'use client'

import React, { use, useEffect, useState } from 'react'
import EventFlowLayout from '@/app/organization/events/components/event-flow-layout'
import TicketUI from '@/app/organization/events/[eventId]/ticket/components/ticket-ui'
import EventFallBack from '@/components/event-fallback'
import { useTicketStore } from '@/store/ticketStore'
import { getEventById } from '@/lib/actions/event-actions'

interface TicketPageProps {
  params: Promise<{
    eventId: string
  }>
}

export default function TicketManagementPage({ params }: TicketPageProps) {
  const { eventId } = use(params)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Access store error state
  const storeError = useTicketStore((state) => state.error)

  useEffect(() => {
    // Verify the event exists at the page level
    const checkEvent = async () => {
      try {
        const eventData = await getEventById(eventId)
        if (!eventData) {
          setError('Event not found')
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load event')
      } finally {
        setLoading(false)
      }
    }

    checkEvent()
  }, [eventId])

  // If there's an error in either the page check or the store, show fallback
  const hasError = error || storeError

  if (loading) {
    return (
      <div className="flex-1 justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  if (hasError) {
    return <EventFallBack error={hasError} />
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
