'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Events = () => {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Events</h1>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Upcoming Events</h2>
            <Button
              variant="outline"
              onClick={() => router.push('/organization/events/create')}
            >
              Create Event
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No upcoming events found.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Events
