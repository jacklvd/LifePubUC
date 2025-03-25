/* eslint-disable @typescript-eslint/no-unused-vars */
// components/event-form-ui.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import EventTitleInput from '@/app/organization/events/components/form-ui/event-title-picker'
import EventAdditional from './event-additional'
import EventPhotoUpload from '@/app/organization/events/components/form-ui/event-photo'
import EventAgenda from '@/app/organization/events/components/form-ui/event-agenda'
import EventInsight from '@/app/organization/events/components/form-ui/event-insight'
import DateLocationSection from './date-location'

interface EventFormUIProps {
  // States
  eventData: EventData
  date: Date | undefined
  startHour: string
  startMinute: string
  startPeriod: 'AM' | 'PM'
  endHour: string
  endMinute: string
  endPeriod: 'AM' | 'PM'
  mapCenter: { lat: number; lng: number }
  markerPosition: { lat: number; lng: number } | null
  locationName: string
  showMap: boolean
  loading: boolean
  errors: Record<string, string>
  locationSuggestions: LocationSuggestion[]
  showSuggestions: boolean
  calendarOpen: boolean
  highlights: EventData['highlights']
  faqs: EventData['faqs']
  agendas: Agenda[]
  locationInputRef: React.RefObject<HTMLInputElement>
  isLoaded: boolean

  // Handlers and setters
  setDate: (date: Date | undefined) => void
  setCalendarOpen: (open: boolean) => void
  setStartHour: (hour: string) => void
  setStartMinute: (minute: string) => void
  setStartPeriod: (period: 'AM' | 'PM') => void
  setEndHour: (hour: string) => void
  setEndMinute: (minute: string) => void
  setEndPeriod: (period: 'AM' | 'PM') => void
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof EventData,
  ) => void
  handleCloudinaryUpload: (result: CloudinaryResult) => void
  handleRemoveMedia: () => void
  handleLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectSuggestion: (suggestion: LocationSuggestion) => void
  handleLocationSearch: () => Promise<void>
  handleMapClick: (e: google.maps.MapMouseEvent) => void
  toggleMap: () => void
  handleUpdateHighlights: (newHighlights: EventData['highlights']) => void
  handleUpdateFaqs: (newFaqs: EventData['faqs']) => void
  handleTitleChange: (title: string) => void
  handleSummaryChange: (summary: string) => void
  handleSubmit: () => Promise<void>
  setAgendas: React.Dispatch<React.SetStateAction<Agenda[]>>

  // Optional props
  submitButtonText?: string
}

export const EventFormUI: React.FC<EventFormUIProps> = ({
  // States
  eventData,
  date,
  startHour,
  startMinute,
  startPeriod,
  endHour,
  endMinute,
  endPeriod,
  mapCenter,
  markerPosition,
  locationName,
  showMap,
  loading,
  errors,
  locationSuggestions,
  showSuggestions,
  calendarOpen,
  highlights,
  faqs,
  agendas,
  locationInputRef,
  isLoaded,

  // Setters
  setDate,
  setCalendarOpen,
  setStartHour,
  setStartMinute,
  setStartPeriod,
  setEndHour,
  setEndMinute,
  setEndPeriod,
  setAgendas,

  // Handlers
  handleChange,
  handleCloudinaryUpload,
  handleRemoveMedia,
  handleLocationChange,
  handleSelectSuggestion,
  handleLocationSearch,
  handleMapClick,
  toggleMap,
  handleUpdateHighlights,
  handleUpdateFaqs,
  handleTitleChange,
  handleSummaryChange,
  handleSubmit,

  // Optional props
  submitButtonText = 'Save and continue',
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Event Photo Section */}
          <EventPhotoUpload
            media={eventData.media}
            mediaType={eventData.mediaType}
            handleCloudinaryUpload={handleCloudinaryUpload}
            handleRemoveMedia={handleRemoveMedia}
            errors={errors}
          />

          {/* Event Title Section */}
          <EventTitleInput
            title={eventData.title}
            summary={eventData.summary}
            error={errors.title}
            onTitleChange={handleTitleChange}
            onSummaryChange={handleSummaryChange}
          />

          {/* Date and Location Section */}
          <DateLocationSection
            date={date}
            setDate={setDate}
            calendarOpen={calendarOpen}
            setCalendarOpen={setCalendarOpen}
            startHour={startHour}
            startMinute={startMinute}
            startPeriod={startPeriod}
            endHour={endHour}
            endMinute={endMinute}
            endPeriod={endPeriod}
            setStartHour={setStartHour}
            setStartMinute={setStartMinute}
            setStartPeriod={setStartPeriod}
            setEndHour={setEndHour}
            setEndMinute={setEndMinute}
            setEndPeriod={setEndPeriod}
            errors={errors}
            locationName={locationName}
            handleLocationChange={handleLocationChange}
            handleLocationSearch={handleLocationSearch}
            locationSuggestions={locationSuggestions}
            showSuggestions={showSuggestions}
            handleSelectSuggestion={handleSelectSuggestion}
            showMap={showMap}
            toggleMap={toggleMap}
            handleMapClick={handleMapClick}
            markerPosition={markerPosition}
            mapCenter={mapCenter}
            isLoaded={isLoaded}
            locationInputRef={locationInputRef}
          />

          {/* Overview Section */}
          <EventInsight
            description={eventData.description}
            handleChange={(e) => handleChange(e, 'description')}
            error={errors.description}
          />

          {/* Good to Know Section */}
          <EventAdditional
            highlights={highlights}
            faqs={faqs}
            onUpdateHighlights={handleUpdateHighlights}
            onUpdateFaqs={handleUpdateFaqs}
          />

          {/* Agenda Section */}
          <EventAgenda
            agendas={agendas}
            setAgendas={setAgendas}
            eventStartTime={eventData.startTime}
            eventEndTime={eventData.endTime}
            errors={errors}
          />

          {/* Finish */}
          <div className="flex justify-end mb-6">
            <Button
              className="bg-blue-50 hover:bg-blue-500 text-black"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : submitButtonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
