/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'
import { Icon } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter, usePathname } from 'next/navigation'
import { format } from 'date-fns'
import { formatDate } from '@/lib/date-formatter'

// Define step types
export type EventStep = 'build' | 'tickets' | 'publish'

interface LeftSideBarProps {
  eventId?: string
  eventTitle?: string
  eventDate?: string
  location?: string
  eventStatus?: 'draft' | 'on sale'
  activeStep?: EventStep
  isEditing?: boolean
  completedSteps?: EventStep[]
}

// Add this component within your LeftSideBar component
const StepIndicator = ({ step, currentStep, isCompleted }: {
  step: EventStep;
  currentStep: EventStep;
  isCompleted: boolean;
}) => {
  return (
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${isCompleted
        ? 'bg-blue-500 text-white-100'
        : currentStep === step
          ? 'border-2 border-blue-500 bg-white-100'
          : 'border border-gray-300 bg-white-100'
        }`}
    >
      {isCompleted ? (
        <Icon name="Check" className="h-3 w-3 text-white-100" />
      ) : currentStep === step ? (
        <div className="w-2 h-2 rounded-full"></div>
      ) : null}
    </div>
  );
};

const formatEventDate = (dateString?: string) => {
  // This handles server-side rendering consistently
  return formatDate(dateString, 'simple');
};

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

  // Determine if we're in a specific section based on the URL
  useEffect(() => {
    if (!pathname) return;

    if (pathname.includes('/ticket')) {
      setCurrentStep('tickets');
    } else if (pathname.includes('/publish')) {
      setCurrentStep('publish');
    } else if (pathname.includes('/create') || pathname.includes('/edit')) {
      setCurrentStep('build');
    }
  }, [pathname]);

  // State to track the current step
  const [currentStep, setCurrentStep] = useState<EventStep>(activeStep)

  // Determine which steps are completed
  const [completedStepsList, setCompletedStepsList] = useState<EventStep[]>(completedSteps)

  // Update completed steps when props change
  useEffect(() => {
    setCompletedStepsList(completedSteps)
  }, [completedSteps])

  // Add this to your LeftSideBar component
  const [formattedDate, setFormattedDate] = useState('Date TBD');

  // Format the date on the client side only
  useEffect(() => {
    if (eventDate) {
      setFormattedDate(formatDate(eventDate, 'display'));
    } else {
      setFormattedDate('Date TBD');
    }
  }, [eventDate]);

  // Function to check if a step is completed
  const isStepCompleted = (step: EventStep) => {
    // In edit mode, all steps should appear completed
    if (isEditing && eventStatus === 'on sale') return true;

    // Otherwise check if the step is in the completedSteps array
    return completedStepsList.includes(step);
  }

  // Function to check if a step is accessible
  const isStepAccessible = (step: EventStep) => {
    // If editing an existing event, all steps are accessible
    if (isEditing) return true;

    // Build is always accessible
    if (step === 'build') return true;

    // For tickets, build must be completed
    if (step === 'tickets') return isStepCompleted('build');

    // For publish, both build AND tickets must be completed
    if (step === 'publish') return isStepCompleted('build') && isStepCompleted('tickets');

    return false;
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
  }



  return (
    <div className="w-64 border-r bg-white-100">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Button
            variant="ghost"
            className="flex items-center text-blue-500 p-0 h-auto"
            onClick={() => router.push('/organization/events')}
          >
            <Icon name="ChevronLeft" className="h-4 w-4 mr-1" />
            <span>Back to events</span>
          </Button>
        </div>

        <div className="p-4 border-b">
          <Card className="bg-white-100 shadow-sm border rounded-lg overflow-hidden">
            <div className="h-6 bg-gradient-to-r from-orange-300 to-red-300" />
            <CardContent className="p-4">
              {/* show only partial of event title */}
              <h2 className="text-lg font-medium truncate">{eventTitle}</h2>
              <div className="flex items-center text-gray-600 text-sm mt-2">
                <Icon name="Calendar" className="h-4 w-4 mr-1" />
                <span>{formatEventDate(eventDate)}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Icon name="MapPin" className="h-4 w-4 mr-1" />
                <span>{formatEventLocation(location)}</span>
              </div>

              <div className="mt-4">
                <Badge
                  variant="outline"
                  className={`rounded-full px-3 border-gray-300 ${eventStatus === 'on sale' ? 'bg-green-50 text-green-700' : ''
                    }`}
                >
                  {eventStatus === 'on sale' ? 'On Sale' : 'Draft'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 p-4">
          <p className="text-sm font-medium text-gray-500 mb-3">Steps</p>
          <div className="space-y-4">
            {/* Build step */}
            <div
              className={`flex items-start p-3 rounded-md cursor-pointer ${currentStep === 'build' ? 'bg-blue-50' : ''
                } ${!isStepAccessible('build') ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => navigateToStep('build')}
            >
              <StepIndicator
                step="build"
                currentStep={currentStep}
                isCompleted={isStepCompleted('build')}
              />
              <div>
                <p className="font-medium">Build event page</p>
                <p className="text-sm text-gray-500">
                  Add all of your event details and let attendees know what to expect
                </p>
              </div>
            </div>

            {/* Tickets step */}
            <div
              className={`flex items-start p-3 rounded-md cursor-pointer ${currentStep === 'tickets' ? 'bg-blue-50' : ''
                } ${!isStepAccessible('tickets') ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => navigateToStep('tickets')}
            >
              <StepIndicator
                step="tickets"
                currentStep={currentStep}
                isCompleted={isStepCompleted('tickets')}
              />
              <div>
                <p className="font-medium">Add tickets</p>
                <p className="text-sm text-gray-500">
                  Create ticket types and set pricing for your event
                </p>
              </div>
            </div>

            {/* Publish step */}
            <div
              className={`flex items-start p-3 rounded-md cursor-pointer ${currentStep === 'publish' ? 'bg-blue-50' : ''
                } ${!isStepAccessible('publish') ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => navigateToStep('publish')}
            >
              <StepIndicator
                step="publish"
                currentStep={currentStep}
                isCompleted={isStepCompleted('publish')}
              />
              <div>
                <p className="font-medium">Publish</p>
                <p className="text-sm text-gray-500">
                  Review your event and make it live to the public
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar