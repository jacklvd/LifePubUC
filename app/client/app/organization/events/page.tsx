'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Icon } from '@/components/icons'
import EventCalendar from '@/components/event-calendar'

const EventsPage = () => {
  // const [activeTab, setActiveTab] = useState('events');
  const [viewMode, setViewMode] = useState('list')
  const [filterValue, setFilterValue] = useState('upcoming')
  const router = useRouter()

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold text-purple-950 mb-6">Events</h1>

      {/* Tabs */}
      {/* <div className="border-b mb-6">
        <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b-0 p-0">
            <TabsTrigger
              value="events"
              className={`px-4 py-2 rounded-none font-normal ${activeTab === 'events'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 border-b-2 border-transparent'
                }`}
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="collections"
              className={`px-4 py-2 rounded-none font-normal ${activeTab === 'collections'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 border-b-2 border-transparent'
                }`}
            >
              Collections
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div> */}

      {/* Controls Row */}
      <div className="flex flex-col md:flex-row justify-between mb-10 gap-4">
        <div className="flex-1 md:max-w-xs">
          <div className="relative">
            <Icon
              name="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            />
            <Input
              placeholder="Search events"
              className="pl-10 bg-white border-gray-300"
            />
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className={`rounded-l-md rounded-r-none px-4 ${viewMode === 'list'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'border-r-0'
                }`}
            >
              <Icon name="LayoutList" className="h-5 w-5 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
              className={`rounded-r-md rounded-l-none px-4 ${viewMode === 'calendar' ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
            >
              <Icon name="Calendar" className="h-5 w-5 mr-2" />
              Calendar
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-blue-600 text-white-100 hover:bg-blue-700 hover:text-white-100"
              >
                {filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}{' '}
                events
                <Icon name="ChevronDown" className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white-100 hover:bg-slate-200">
              <DropdownMenuItem onClick={() => setFilterValue('upcoming')}>
                Upcoming events
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterValue('past')}>
                Past events
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterValue('draft')}>
                Draft events
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterValue('all')}>
                All events
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="bg-green-400 hover:bg-green-500 text-white-100"
            type="submit"
            onClick={() => router.push('/organization/events/create')}
          >
            Create Event
          </Button>
        </div>
      </div>
      {/* Calendar or List View */}
      {viewMode === 'calendar' ? (
        <EventCalendar />
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-6 p-2">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/1869/1869397.png"
              alt="Calendar icon"
              className="w-20 h-20"
              width={80}
              height={80}
            />
          </div>
          <p className="text-gray-500 mb-8">No events to show</p>
        </div>
      )}
    </div>
  )
}

export default EventsPage
