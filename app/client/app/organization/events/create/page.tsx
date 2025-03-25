// app/organization/events/create/page.tsx
'use client'
import EventFlowLayout from '@/app/organization/events/components/event-flow-layout'
import EventForm from '@/app/organization/events/components/form-ui/event-form'

export default function CreateEventPage() {
  return (
    <EventFlowLayout>
      <EventForm submitButtonText="Create Event" />
    </EventFlowLayout>
  )
}

// Similarly for edit, ticket, and publish pages
