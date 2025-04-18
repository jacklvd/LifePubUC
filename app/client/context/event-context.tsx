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
import { EventStep } from '@/app/organization/events/components/event-leftside-bar'
import { STORAGE_KEY as sk } from '@/constants'

// Define types for context and progress data
interface EventProgressData {
  eventId: string | null
  eventTitle: string
  eventDate: string | Date | null
  eventLocation: string | null
  eventStatus: 'draft' | 'on sale'
  activeStep: EventStep
  completedSteps: EventStep[]
}

interface EventProgressContextType extends EventProgressData {
  isEditing: boolean
  setEventId: (id: string) => void
  setEventTitle: (title: string) => void
  setEventDate: (date: string | Date) => void
  setEventLocation: (location: string) => void
  setEventStatus: (status: 'draft' | 'on sale') => void
  setActiveStep: (step: EventStep) => void
  markStepCompleted: (step: EventStep) => void
  markStepIncomplete: (step: EventStep) => void
  resetProgress: () => void
}

// Initial default values
const initialProgressData: EventProgressData = {
  eventId: null,
  eventTitle: 'New Event',
  eventDate: null,
  eventLocation: null,
  eventStatus: 'draft',
  activeStep: 'build',
  completedSteps: [],
}

// Create context with default values
const EventProgressContext = createContext<EventProgressContextType>({
  ...initialProgressData,
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

const key = sk as string

// Storage utility functions
const getStoredProgress = (): EventProgressData | null => {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Failed to parse stored event progress', error)
    return null
  }
}

const saveProgressToStorage = (progress: EventProgressData) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(progress))
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
  const storedProgress = useRef(getStoredProgress())

  // Determine if we're editing based on eventId presence
  const [isEditing, setIsEditing] = useState(() => !!routeEventId)

  // Get initial state based on stored data and route
  const getInitialState = (): EventProgressData => {
    const stored = storedProgress.current || initialProgressData

    // If we have a route ID, use it over any stored ID
    const id = routeEventId || stored.eventId

    // Determine initial completed steps
    let completedSteps = [...stored.completedSteps]

    // If editing an existing event
    if (id) {
      // If the event is published, mark all steps as completed
      if (stored.eventStatus === 'on sale') {
        completedSteps = ['build', 'tickets', 'publish']
      }
      // Always ensure 'build' is marked as complete for existing events
      else if (!completedSteps.includes('build')) {
        completedSteps = [...completedSteps, 'build']
      }
    }

    return {
      ...stored,
      eventId: id,
      completedSteps,
    }
  }

  // Initialize all state at once to minimize renders
  const [state, setState] = useState<EventProgressData>(getInitialState)

  // Create updater functions with useCallback
  const updateState = useCallback((updates: Partial<EventProgressData>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
    }))
  }, [])

  const setEventId = useCallback(
    (id: string) => {
      updateState({ eventId: id })
    },
    [updateState],
  )

  const setEventTitle = useCallback(
    (title: string) => {
      updateState({ eventTitle: title })
    },
    [updateState],
  )

  const setEventDate = useCallback(
    (date: string | Date) => {
      updateState({ eventDate: date })
    },
    [updateState],
  )

  const setEventLocation = useCallback(
    (location: string) => {
      updateState({ eventLocation: location })
    },
    [updateState],
  )

  const setEventStatus = useCallback(
    (status: 'draft' | 'on sale') => {
      updateState({ eventStatus: status })
    },
    [updateState],
  )

  const setActiveStep = useCallback(
    (step: EventStep) => {
      updateState({ activeStep: step })
    },
    [updateState],
  )

  const markStepCompleted = useCallback((step: EventStep) => {
    setState((prev) => {
      if (prev.completedSteps.includes(step)) return prev
      return {
        ...prev,
        completedSteps: [...prev.completedSteps, step],
      }
    })
  }, [])

  const markStepIncomplete = useCallback((step: EventStep) => {
    setState((prev) => ({
      ...prev,
      completedSteps: prev.completedSteps.filter((s) => s !== step),
    }))
  }, [])

  const resetProgress = useCallback(() => {
    setState(initialProgressData)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  }, [])

  // Update isEditing when routeEventId changes
  useEffect(() => {
    const isEditingNow = !!routeEventId
    setIsEditing(isEditingNow)

    // If route has eventId, update context eventId
    if (routeEventId && routeEventId !== state.eventId) {
      updateState({ eventId: routeEventId })
    }
  }, [routeEventId, state.eventId, updateState])

  // One-time initialization effect for editing existing events
  useEffect(() => {
    if (isEditing && routeEventId && !initializationCompleted.current) {
      initializationCompleted.current = true

      // Any one-time setup for existing events
      const fetchEventData = async () => {
        try {
          // Custom fetch logic if needed
          // This could be expanded as needed
        } catch (error) {
          console.error('Error fetching event data:', error)
        }
      }

      fetchEventData()
    }
  }, [isEditing, routeEventId])

  // Save to localStorage when state changes - debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveProgressToStorage(state)
    }, 300) // Debounce 300ms

    return () => clearTimeout(timeoutId)
  }, [state])

  // Create a memoized context value to prevent unnecessary rerenders
  const contextValue = {
    ...state,
    isEditing,
    setEventId,
    setEventTitle,
    setEventDate,
    setEventLocation,
    setEventStatus,
    setActiveStep,
    markStepCompleted,
    markStepIncomplete,
    resetProgress,
  }

  return (
    <EventProgressContext.Provider value={contextValue}>
      {children}
    </EventProgressContext.Provider>
  )
}

// Custom hook to use the event progress context
export const useEventProgress = () => useContext(EventProgressContext)
