// app/organization/events/[eventId]/ticket/page.tsx
'use client'

import React, { use } from 'react'
import EventFlowLayout from '@/components/event-ui/event-flow-layout'
import TicketUI from '@/components/ticket-ui'

interface TicketPageProps {
    params: Promise<{
        eventId: string
    }>
}

export default function TicketManagementPage({ params }: TicketPageProps) {
    const { eventId } = use(params)

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