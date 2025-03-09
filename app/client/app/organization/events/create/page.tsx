'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/icons'
import { useRouter } from 'next/navigation'

const EventCreationPage = () => {
  const [activeStep, setActiveStep] = useState('build')
  const router = useRouter()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-white">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Button
              variant="ghost"
              className="flex items-center text-blue-500 p-0 h-auto"
              onClick={() => router.replace('/organization/events')}
            >
              <Icon name="ChevronLeft" className="h-4 w-4 mr-1" />
              <span>Back to events</span>
            </Button>
          </div>

          <div className="p-4 border-b">
            <Card className="bg-white shadow-sm border rounded-lg overflow-hidden">
              <div className="h-6 bg-gradient-to-r from-orange-300 to-red-300" />
              <CardContent className="p-4">
                <h2 className="text-lg font-medium">Event Title</h2>
                <div className="flex items-center text-gray-600 text-sm mt-2">
                  <Icon name="Calendar" className="h-4 w-4 mr-1" />
                  <span>Fri, Apr 11, 2025, 10:00 AM</span>
                </div>

                <div className="mt-4">
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 border-gray-300"
                  >
                    Draft
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 p-4">
            <p className="text-sm font-medium text-gray-500 mb-3">Steps</p>
            <div className="space-y-4">
              <div
                className={`flex items-start p-3 rounded-md ${activeStep === 'build' ? 'bg-blue-50' : ''}`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${activeStep === 'build' ? 'bg-blue-500 text-white' : 'border border-gray-300 bg-white'}`}
                >
                  {activeStep === 'build' && <span className="text-xs">✓</span>}
                </div>
                <div>
                  <p className="font-medium">Build event page</p>
                  <p className="text-sm text-gray-500">
                    Add all of your event details and let attendees know what to
                    expect
                  </p>
                </div>
              </div>

              <div
                className={`flex items-start p-3 rounded-md ${activeStep === 'tickets' ? 'bg-blue-50' : ''}`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${activeStep === 'tickets' ? 'bg-blue-500 text-white' : 'border border-gray-300 bg-white'}`}
                >
                  {activeStep === 'tickets' && (
                    <span className="text-xs">✓</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">Add tickets</p>
                </div>
              </div>

              <div
                className={`flex items-start p-3 rounded-md ${activeStep === 'publish' ? 'bg-blue-50' : ''}`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${activeStep === 'publish' ? 'bg-blue-500 text-white' : 'border border-gray-300 bg-white'}`}
                >
                  {activeStep === 'publish' && (
                    <span className="text-xs">✓</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">Publish</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Event Photo Section */}
          <div className="mb-6">
            <div className="relative rounded-md overflow-hidden border bg-white">
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-white">
                    <Icon name="Upload" className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="font-medium text-blue-500">Upload photos</p>
                  <p className="text-sm text-blue-500">and video</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white shadow-md"
              >
                <Icon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Event Title Section */}
          <div className="mb-6">
            <div className="relative rounded-md overflow-hidden border bg-white p-6">
              <h2 className="text-2xl font-bold mb-4">Event Title</h2>
              <Input
                placeholder="A short and sweet sentence about your event."
                className="text-gray-500"
              />
              <Button
                variant="ghost"
                className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full border"
              >
                <Icon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Date and Location Section */}
          <div className="mb-6">
            <div className="relative rounded-md overflow-hidden border bg-white p-6">
              <div className="flex justify-between mb-4">
                <div className="w-1/2 pr-4">
                  <h3 className="text-lg font-medium mb-4">Date and time</h3>
                  <div className="flex items-center p-2 border rounded-md bg-gray-50">
                    <Icon
                      name="Calendar"
                      className="h-5 w-5 mr-2 text-gray-500"
                    />
                    <span>Friday, April 11 · 10am - 12pm EDT</span>
                  </div>
                </div>
                <div className="w-1/2 pl-4">
                  <h3 className="text-lg font-medium mb-4">Location</h3>
                  <div className="flex items-center p-2 border rounded-md bg-gray-50">
                    <Icon
                      name="MapPin"
                      className="h-5 w-5 mr-2 text-gray-500"
                    />
                    <span>Enter a location</span>
                  </div>
                  <Button
                    variant="link"
                    className="text-blue-500 mt-1 h-auto p-0"
                  >
                    <span>Hide map</span>
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full border"
                >
                  <Icon name="Plus" className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-md overflow-hidden bg-gray-100 h-40 mt-2">
                {/* Map would go here */}
                <div className="h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Map Placeholder</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="mb-6">
            <div className="relative rounded-md overflow-hidden border bg-white p-6">
              <h3 className="text-lg font-medium mb-4">Overview</h3>
              <Textarea
                placeholder="Use this section to provide more details about your event. You can include things to know, venue information, accessibility options—anything that will help people know what to expect."
                className="resize-none"
                rows={3}
              />
              <Button
                variant="ghost"
                className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full border"
              >
                <Icon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Good to Know Section */}
          <div className="mb-6">
            <div className="relative rounded-md overflow-hidden border bg-white p-6">
              <h3 className="text-lg font-medium mb-4">Good to know</h3>

              <div className="mb-6">
                <h4 className="font-medium mb-2">Highlights</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-md">
                    <Icon name="Plus" className="h-4 w-4 mr-1" />
                    <span>Add Age info</span>
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-md">
                    <Icon name="Plus" className="h-4 w-4 mr-1" />
                    <span>Add Door Time</span>
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-md">
                    <Icon name="Plus" className="h-4 w-4 mr-1" />
                    <span>Add Parking info</span>
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Frequently asked questions</h4>
                <div className="border rounded-md p-3 mb-2 flex items-center">
                  <Icon name="Info" className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    Events with FAQs have 8% more organic traffic
                  </span>
                </div>
                <Button variant="link" className="text-blue-500 p-0">
                  <Icon name="Plus" className="h-4 w-4 mr-1" />
                  <span>Add question</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full border"
              >
                <Icon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add More Sections */}
          <div className="mb-6">
            <div className="relative rounded-md overflow-hidden border bg-white p-6">
              <h3 className="text-lg font-medium mb-4">
                Add more sections to your event page
              </h3>
              <p className="text-gray-600 mb-4">
                Make your event stand out even more. These sections help
                attendees find information and answer their questions - which
                means more ticket sales and less time answering messages.
              </p>

              <Badge variant="outline" className="bg-gray-50 text-gray-600">
                Recommended
              </Badge>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mb-6">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Save and continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCreationPage
