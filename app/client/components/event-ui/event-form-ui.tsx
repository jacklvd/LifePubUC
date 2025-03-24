/* eslint-disable @typescript-eslint/no-unused-vars */
// components/event-form-ui.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { useEventProgress } from '@/context/event-context'

import EventDateTimePicker from '@/components/event-ui/event-datetime-picker'
import EventTitleInput from '@/components/event-ui/event-title-picker'
import EventAdditional from '@/components/event-ui/event-additional'
import EventLocationPicker from '@/components/event-ui/event-location'
import EventPhotoUpload from '@/components/event-ui/event-photo'
import EventAgenda from '@/components/event-ui/event-agenda'
import EventInsight from '@/components/event-ui/event-insight'

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
  // Use the progress context
  const {
    eventId,
    eventDate,
    eventLocation,
    completedSteps,
    activeStep,
    isEditing,
  } = useEventProgress()

  // Format date for display if needed
  const formattedDate = eventDate || (date ? date.toISOString() : undefined)

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
          <div className="mb-6">
            <div className="relative rounded-md overflow-hidden border bg-white-100 p-6">
              <div className="flex justify-between mb-4">
                <div className="w-1/2 pr-4">
                  <EventDateTimePicker
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
                  />
                </div>

                <div className="w-1/2 pl-4">
                  <EventLocationPicker
                    locationName={locationName}
                    handleLocationChange={handleLocationChange}
                    handleLocationSearch={handleLocationSearch}
                    locationSuggestions={locationSuggestions}
                    showSuggestions={showSuggestions}
                    handleSelectSuggestion={handleSelectSuggestion}
                    showMap={showMap}
                    toggleMap={toggleMap}
                    errors={errors}
                    locationInputRef={locationInputRef}
                  />
                </div>
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full border"
                >
                  <Icon name="Plus" className="h-4 w-4" />
                </Button>
              </div>

              {showMap && (
                <div className="rounded-md overflow-hidden bg-gray-100 h-64 mt-2">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={mapCenter}
                      zoom={13}
                      onClick={handleMapClick}
                      options={{
                        gestureHandling: 'cooperative',
                      }}
                    >
                      {markerPosition && <Marker position={markerPosition} />}
                    </GoogleMap>
                  ) : (
                    <div className="h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Loading map...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

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
