/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { useParams } from 'next/navigation'
import { EventStep } from '@/components/event-ui/event-leftside-bar'

interface EventProgressContextType {
  eventId: string | null
  eventTitle: string
  eventDate: string | null
  eventLocation: string | null
  eventStatus: 'draft' | 'on sale'
  activeStep: EventStep
  completedSteps: EventStep[]
  isEditing: boolean
  setEventId: (id: string) => void
  setEventTitle: (title: string) => void
  setEventDate: (date: string) => void
  setEventLocation: (location: string) => void
  setEventStatus: (status: 'draft' | 'on sale') => void
  setActiveStep: (step: EventStep) => void
  markStepCompleted: (step: EventStep) => void
  markStepIncomplete: (step: EventStep) => void
  resetProgress: () => void
}

// Create context with default values
const EventProgressContext = createContext<EventProgressContextType>({
  eventId: null,
  eventTitle: 'New Event',
  eventDate: null,
  eventLocation: null,
  eventStatus: 'draft',
  activeStep: 'build',
  completedSteps: [],
  isEditing: false,
  setEventId: () => {},
  setEventTitle: () => {},
  setEventDate: () => {},
  setEventLocation: () => {},
  setEventStatus: () => {},
  setActiveStep: () => {},
  markStepCompleted: () => {},
  markStepIncomplete: () => {},
  resetProgress: () => {},
})

// Get stored progress from local storage
const getStoredProgress = () => {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem('eventProgress')
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to parse stored event progress', error)
    return null
  }
}

// Save progress to local storage
const saveProgressToStorage = (progress: any) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('eventProgress', JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to store event progress', error)
  }
}

export const EventProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get eventId from route if available
  const params = useParams()
  const routeEventId = (params?.eventId as string) || null

  // Add a ref to track initialization
  const initializationCompleted = useRef(false)

  // Initialize state from localStorage or defaults
  const storedProgress = getStoredProgress()

  // Determine initial completedSteps based on status and existing data
  const getInitialCompletedSteps = () => {
    const storedSteps = storedProgress?.completedSteps || []

    if (!!routeEventId) {
      // If editing an event
      const status = storedProgress?.eventStatus || 'draft'

      if (status === 'on sale') {
        return ['build', 'tickets', 'publish']
      } else if (!storedSteps.includes('build')) {
        return [...storedSteps, 'build']
      }
    }

    return storedSteps
  }

  const [eventId, setEventIdState] = useState<string | null>(
    routeEventId || storedProgress?.eventId || null,
  )
  const [eventTitle, setEventTitle] = useState<string>(
    storedProgress?.eventTitle || 'New Event',
  )
  const [eventDate, setEventDate] = useState<string | null>(
    storedProgress?.eventDate || null,
  )
  const [eventLocation, setEventLocation] = useState<string | null>(
    storedProgress?.eventLocation || null,
  )
  const [eventStatus, setEventStatus] = useState<'draft' | 'on sale'>(
    storedProgress?.eventStatus || 'draft',
  )
  const [activeStep, setActiveStep] = useState<EventStep>(
    storedProgress?.activeStep || 'build',
  )
  const [completedSteps, setCompletedSteps] = useState<EventStep[]>(
    getInitialCompletedSteps(),
  )

  // Determine if we're editing based on eventId presence
  const [isEditing, setIsEditing] = useState<boolean>(!!routeEventId)

  // Use useCallback for all function references that might be used in dependencies
  const setEventId = useCallback((id: string) => {
    setEventIdState(id)
  }, [])

  const markStepCompleted = useCallback((step: EventStep) => {
    setCompletedSteps((prev) => {
      if (prev.includes(step)) return prev
      return [...prev, step]
    })
  }, [])

  const markStepIncomplete = useCallback((step: EventStep) => {
    setCompletedSteps((prev) => prev.filter((s) => s !== step))
  }, [])

  const setActiveStepCallback = useCallback((step: EventStep) => {
    setActiveStep(step)
  }, [])

  const setEventTitleCallback = useCallback((title: string) => {
    setEventTitle(title)
  }, [])

  const setEventDateCallback = useCallback((date: string) => {
    setEventDate(date)
  }, [])

  const setEventLocationCallback = useCallback((location: string) => {
    setEventLocation(location)
  }, [])

  const setEventStatusCallback = useCallback((status: 'draft' | 'on sale') => {
    setEventStatus(status)
  }, [])

  const resetProgress = useCallback(() => {
    setEventIdState(null)
    setEventTitle('New Event')
    setEventDate(null)
    setEventLocation(null)
    setEventStatus('draft')
    setActiveStep('build')
    setCompletedSteps([])

    // Clear from localStorage
    localStorage.removeItem('eventProgress')
  }, [])

  // Update isEditing when routeEventId changes
  useEffect(() => {
    setIsEditing(!!routeEventId)

    // If route has eventId, update context eventId
    if (routeEventId) {
      setEventIdState(routeEventId)
    }
  }, [routeEventId])

  // Then modify your problematic effect to use the initialization ref
  useEffect(() => {
    if (isEditing && routeEventId && !initializationCompleted.current) {
      // Mark initialization as completed
      initializationCompleted.current = true

      // Any one-time setup can go here
      const fetchEventData = async () => {
        try {
          // Custom fetch logic if needed
        } catch (error) {
          console.error('Error fetching event data:', error)
        }
      }

      fetchEventData()
    }
  }, [isEditing, routeEventId])

  // Save to localStorage when state changes
  useEffect(() => {
    const progress = {
      eventId,
      eventTitle,
      eventDate,
      eventLocation,
      eventStatus,
      activeStep,
      completedSteps,
    }

    saveProgressToStorage(progress)
  }, [
    eventId,
    eventTitle,
    eventDate,
    eventLocation,
    eventStatus,
    activeStep,
    completedSteps,
  ])

  return (
    <EventProgressContext.Provider
      value={{
        eventId,
        eventTitle,
        eventDate,
        eventLocation,
        eventStatus,
        activeStep,
        completedSteps,
        isEditing,
        setEventId,
        setEventTitle: setEventTitleCallback,
        setEventDate: setEventDateCallback,
        setEventLocation: setEventLocationCallback,
        setEventStatus: setEventStatusCallback,
        setActiveStep: setActiveStepCallback,
        markStepCompleted,
        markStepIncomplete,
        resetProgress,
      }}
    >
      {children}
    </EventProgressContext.Provider>
  )
}

// Custom hook to use the event progress context
export const useEventProgress = () => useContext(EventProgressContext)
