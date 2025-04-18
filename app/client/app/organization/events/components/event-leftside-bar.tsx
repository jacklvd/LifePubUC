/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter, usePathname } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from '@/components/ui/sheet'
import { Icon } from '@/components/icons'

// Define step types
export type EventStep = 'build' | 'tickets' | 'publish'

interface LeftSideBarProps {
  eventId?: string
  eventTitle?: string
  eventDate?: string | Date
  location?: string
  eventStatus?: 'draft' | 'on sale'
  activeStep?: EventStep
  isEditing?: boolean
  completedSteps?: EventStep[]
}

// Add this component within your LeftSideBar component
const StepIndicator = ({
  step,
  currentStep,
  isCompleted,
}: {
  step: EventStep
  currentStep: EventStep
  isCompleted: boolean
}) => {
  return (
    <div
      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
        isCompleted
          ? 'bg-blue-500 text-white-100'
          : currentStep === step
            ? 'border-2 border-blue-500 bg-white-100'
            : 'border border-gray-300 bg-white-100'
      }`}
    >
      {isCompleted ? (
        <Icon name="Check" className="h-2 w-2 sm:h-3 sm:w-3 text-white-100" />
      ) : currentStep === step ? (
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"></div>
      ) : null}
    </div>
  )
}

const formatEventDate = (dateString?: string | Date) => {
  // This handles server-side rendering consistently
  return formatDate(dateString, 'simple')
}

const formatEventLocation = (location?: string) => {
  if (!location) return 'Location TBD'

  return location
}

const LeftSideBar: React.FC<LeftSideBarProps> = ({
  eventId,
  eventTitle = 'Event Title',
  eventDate,
  location,
  eventStatus = 'draft',
  activeStep = 'build',
  isEditing = false,
  completedSteps = [],
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Determine if we're in a specific section based on the URL
  useEffect(() => {
    if (!pathname) return

    if (pathname.includes('/ticket')) {
      setCurrentStep('tickets')
    } else if (pathname.includes('/publish')) {
      setCurrentStep('publish')
    } else if (pathname.includes('/create') || pathname.includes('/edit')) {
      setCurrentStep('build')
    }
  }, [pathname])

  // State to track the current step
  const [currentStep, setCurrentStep] = useState<EventStep>(activeStep)

  // Determine which steps are completed
  const [completedStepsList, setCompletedStepsList] =
    useState<EventStep[]>(completedSteps)

  // Update completed steps when props change
  useEffect(() => {
    setCompletedStepsList(completedSteps)
  }, [completedSteps])

  // Add this to your LeftSideBar component
  const [formattedDate, setFormattedDate] = useState('Date TBD')

  // Format the date on the client side only
  useEffect(() => {
    if (eventDate) {
      setFormattedDate(formatDate(eventDate, 'display'))
    } else {
      setFormattedDate('Date TBD')
    }
  }, [eventDate])

  // Function to check if a step is completed
  const isStepCompleted = (step: EventStep) => {
    // In edit mode, all steps should appear completed
    if (isEditing && eventStatus === 'on sale') return true

    // Otherwise check if the step is in the completedSteps array
    return completedStepsList.includes(step)
  }

  // Function to check if a step is accessible
  const isStepAccessible = (step: EventStep) => {
    // If editing an existing event, all steps are accessible
    if (isEditing) return true

    // Build is always accessible
    if (step === 'build') return true

    // For tickets, build must be completed
    if (step === 'tickets') return isStepCompleted('build')

    // For publish, both build AND tickets must be completed
    if (step === 'publish')
      return isStepCompleted('build') && isStepCompleted('tickets')

    return false
  }

  // Function to navigate to a step
  const navigateToStep = (step: EventStep) => {
    if (!isStepAccessible(step)) return

    // If we have an eventId, we're editing an existing event
    if (eventId) {
      switch (step) {
        case 'build':
          router.push(`/organization/events/${eventId}/edit`)
          break
        case 'tickets':
          router.push(`/organization/events/${eventId}/ticket`)
          break
        case 'publish':
          router.push(`/organization/events/${eventId}/publish`)
          break
      }
    } else {
      // For new events, we can only navigate to build, as we don't have an ID yet
      if (step === 'build') {
        router.push('/organization/events/create')
      }
    }

    // Close mobile menu after navigation
    setIsMobileMenuOpen(false)
  }

  // Sidebar content to reuse in both desktop and mobile views
  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 border-b">
        <Button
          variant="ghost"
          className="flex items-center text-blue-500 p-0 h-auto text-xs sm:text-sm"
          onClick={() => {
            router.push('/organization/events')
            setIsMobileMenuOpen(false)
          }}
        >
          <Icon name="ChevronLeft" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span>Back to events</span>
        </Button>
      </div>

      <div className="p-3 sm:p-4 border-b">
        <Card className="bg-white-100 shadow-sm border rounded-lg overflow-hidden">
          <div className="h-4 sm:h-6 bg-gradient-to-r from-orange-300 to-red-300" />
          <CardContent className="p-3 sm:p-4">
            {/* show only partial of event title */}
            <h2 className="text-sm sm:text-lg font-medium truncate">
              {eventTitle}
            </h2>
            <div className="flex items-center text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
              <Icon name="Calendar" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>{formatEventDate(eventDate)}</span>
            </div>
            <div className="flex items-center text-gray-600 text-xs sm:text-sm mt-1">
              <Icon name="MapPin" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">{formatEventLocation(location)}</span>
            </div>

            <div className="mt-2 sm:mt-4">
              <Badge
                variant="outline"
                className={`rounded-full px-2 sm:px-3 text-xs sm:text-sm border-gray-300 ${
                  eventStatus === 'on sale' ? 'bg-green-50 text-green-700' : ''
                }`}
              >
                {eventStatus === 'on sale' ? 'On Sale' : 'Draft'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 p-3 sm:p-4">
        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">
          Steps
        </p>
        <div className="space-y-2 sm:space-y-4">
          {/* Build step */}
          <div
            className={`flex items-start p-2 sm:p-3 rounded-md cursor-pointer ${currentStep === 'build' ? 'bg-blue-50' : ''}
              ${!isStepAccessible('build') ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => navigateToStep('build')}
          >
            <StepIndicator
              step="build"
              currentStep={currentStep}
              isCompleted={isStepCompleted('build')}
            />
            <div>
              <p className="font-medium text-xs sm:text-sm">Build event page</p>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Add all of your event details and let attendees know what to
                expect
              </p>
            </div>
          </div>

          {/* Tickets step */}
          <div
            className={`flex items-start p-2 sm:p-3 rounded-md cursor-pointer ${currentStep === 'tickets' ? 'bg-blue-50' : ''}
              ${!isStepAccessible('tickets') ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => navigateToStep('tickets')}
          >
            <StepIndicator
              step="tickets"
              currentStep={currentStep}
              isCompleted={isStepCompleted('tickets')}
            />
            <div>
              <p className="font-medium text-xs sm:text-sm">Add tickets</p>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Create ticket types and set pricing for your event
              </p>
            </div>
          </div>

          {/* Publish step */}
          <div
            className={`flex items-start p-2 sm:p-3 rounded-md cursor-pointer ${currentStep === 'publish' ? 'bg-blue-50' : ''}
              ${!isStepAccessible('publish') ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => navigateToStep('publish')}
          >
            <StepIndicator
              step="publish"
              currentStep={currentStep}
              isCompleted={isStepCompleted('publish')}
            />
            <div>
              <p className="font-medium text-xs sm:text-sm">Publish</p>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Review your event and make it live to the public
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger menu - positioned in the middle-left of the screen */}
      <div className="md:hidden fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-r-lg rounded-l-none bg-white-100 shadow-md border-l-0"
            >
              <Icon name="Logs" className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 max-w-[240px] border-r bg-white-100"
          >
            <SheetHeader className="p-4">
              <SheetTitle>Progress Bar</SheetTitle>
            </SheetHeader>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:block w-56 lg:w-64 border-r bg-white-100 h-full overflow-auto">
        {sidebarContent}
      </div>
    </>
  )
}

export default LeftSideBar
