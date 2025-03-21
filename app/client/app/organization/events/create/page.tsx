// app/organization/events/create/page.tsx
'use client'
import EventFlowLayout from '@/components/event-ui/event-flow-layout'
import EventForm from '@/components/event-form'

export default function CreateEventPage() {
  return (
    <EventFlowLayout>
      <EventForm submitButtonText="Create Event" />
    </EventFlowLayout>
  )
}

// Similarly for edit, ticket, and publish pages