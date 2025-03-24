// components/event-ui/event-flow-layout.tsx
'use client'
import { useEventProgress } from '@/context/event-context'
import LeftSideBar from '@/components/event-ui/event-leftside-bar'
import React, { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

export default function EventFlowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    eventId,
    eventTitle,
    eventDate,
    eventLocation,
    eventStatus,
    activeStep,
    isEditing,
    completedSteps,
    resetProgress,
  } = useEventProgress()

  const hasMounted = useHasMounted()
  const pathname = usePathname()

  // Use a ref to track if we've already reset progress
  const hasResetProgress = useRef(false)

  // Check if we're in create mode only ONCE
  useEffect(() => {
    const isCreateMode = pathname?.includes('/create')

    // Only reset if we're in create mode, have an eventId, and haven't reset already
    if (isCreateMode && eventId !== null && !hasResetProgress.current) {
      // console.log('Resetting progress for new event creation')
      resetProgress()
      // Mark that we've reset progress
      hasResetProgress.current = true
    }
  }, [pathname, eventId, resetProgress])

  // Don't render content until client-side
  if (!hasMounted) {
    return null
  }

  return (
    <>
      <LeftSideBar
        eventId={eventId || undefined}
        eventTitle={eventTitle}
        eventDate={eventDate || undefined}
        location={eventLocation || undefined}
        eventStatus={eventStatus}
        activeStep={activeStep}
        isEditing={isEditing}
        completedSteps={completedSteps}
      />
      <div className="flex-1">{children}</div>
    </>
  )
}
