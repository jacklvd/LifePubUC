/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useState } from 'react'
import { Icon } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

import React from 'react'

const LeftSideBar = () => {
  const [activeStep, setActiveStep] = useState('build')
  const router = useRouter()

  return (
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
                {activeStep === 'tickets' && <span className="text-xs">✓</span>}
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
                {activeStep === 'publish' && <span className="text-xs">✓</span>}
              </div>
              <div>
                <p className="font-medium">Publish</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar
