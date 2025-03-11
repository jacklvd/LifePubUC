'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Icon } from '@/components/icons'
import Link from 'next/link'

const OrganizationHome = () => {
  return (
    <>
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-12">
            Oh hello, J
          </h1>

          {/* Create Event Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create your first event
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Faster Card */}
              <Card className="bg-blue-50 border-none overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 pb-0">
                    <Image
                      src="/api/placeholder/400/220"
                      alt="AI Event Creation"
                      className="w-full h-auto rounded-lg"
                      width={400}
                      height={220}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Create faster with AI
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Answer a few questions to generate an event that&apos;s
                      ready to publish in minutes
                    </p>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-white"
                      >
                        <Icon name="CirclePlus" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Start from Scratch Card */}
              <Card className="bg-red-50 border-none overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 pb-0">
                    <Image
                      src="/api/placeholder/400/220"
                      alt="Start from scratch"
                      className="w-full h-auto rounded-lg"
                      width={400}
                      height={220}
                    />
                  </div>
                  <div className="p-6">
                  
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Start from scratch
                      </h3>
                    <p className="text-gray-600 mb-4">
                      Craft every detail from ticket types to reserved seating
                      and more advanced tools
                    </p>
                    <div className="flex justify-end">
                      <Link href="/organization/events/create">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full bg-white"
                        >
                          <Icon name="CirclePlus" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Get to Know Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Get to know LifePub
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-50 p-3 rounded-full">
                      <Icon name="BinocularsIcon" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Discover features that can power your business
                      </h3>
                      <Button
                        variant="ghost"
                        className="text-gray-700 pl-0 flex items-center gap-1"
                      >
                        Take a product tour <Icon name="ChevronRightIcon" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-50 p-3 rounded-full">
                      <Icon name="MegaphoneIcon" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Get to know your marketing tools
                      </h3>
                      <Button
                        variant="ghost"
                        className="text-gray-700 pl-0 flex items-center gap-1"
                      >
                        Explore marketing <Icon name="ChevronRightIcon" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              LifePub helps <span className="text-purple-700">comedy</span>{' '}
              organizers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-50 border-none">
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-800">
                        5.3M
                      </span>
                      <div className="bg-red-100 p-1 rounded">
                        <Icon name="TicketIcon" />
                      </div>
                    </div>
                    <p className="text-gray-600">
                      tickets sold for comedy events
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-none">
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-800">
                        2M
                      </span>
                      <div className="bg-white p-1 rounded">
                        <Icon name="UserIcon" />
                      </div>
                    </div>
                    <p className="text-gray-600">
                      people bought tickets to comedy events
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-none">
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-800">
                        728.2K
                      </span>
                      <div className="bg-white p-1 rounded">
                        <Icon name="SearchIcon" />
                      </div>
                    </div>
                    <p className="text-gray-600">searches for comedy events</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 flex items-center justify-center">
                <CardContent className="p-6 text-center">
                  <Button
                    variant="ghost"
                    className="text-blue-600 flex items-center gap-1"
                  >
                    <Icon name="CirclePlus" />
                    Create an Event
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrganizationHome
