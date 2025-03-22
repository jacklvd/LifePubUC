/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface EventFallBackProps {
  error: any
  fullScreen?: boolean // Add a prop to control whether it's fullscreen or not
}

// This component is used to display a fallback UI when there is an error loading event data
const EventFallBack: React.FC<EventFallBackProps> = ({
  error,
  fullScreen = false,
}) => {
  const router = useRouter()

  // If fullScreen is true, render a full-screen fallback that replaces everything
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold">Error</h1>
          <p className="mt-2">{error || 'Failed to load event data'}</p>
          <Button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => router.push('/organization/events')}
          >
            Go Back to Events
          </Button>
        </div>
      </div>
    )
  }

  // Otherwise, render an in-page fallback
  return (
    <div className="flex-1 justify-center items-center min-h-screen p-9">
      <div className="text-center">
        <h1 className="text-xl font-bold">Error</h1>
        <p>{error || 'Failed to load event data'}</p>
        <Button
          className="mt-4 bg-blue-50 hover:bg-blue-500 text-black px-4 py-2 rounded"
          onClick={() => router.push('/organization/events')}
        >
          Go Back
        </Button>
      </div>
    </div>
  )
}

export default EventFallBack
