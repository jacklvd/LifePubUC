import React from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import EventDateTimePicker from './event-datetime-picker'
import EventLocationPicker from './event-location'

interface Props {
  // Date props
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  calendarOpen: boolean
  setCalendarOpen: (open: boolean) => void
  startHour: string
  startMinute: string
  startPeriod: string
  endHour: string
  endMinute: string
  endPeriod: string
  setStartHour: (value: string) => void
  setStartMinute: (value: string) => void
  setStartPeriod: (value: 'AM' | 'PM') => void
  setEndHour: (value: string) => void
  setEndMinute: (value: string) => void
  setEndPeriod: (value: 'AM' | 'PM') => void

  // Location props
  locationName: string
  handleLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleLocationSearch: () => void
  locationSuggestions: Array<{ place_id: string; description: string }>
  showSuggestions: boolean
  handleSelectSuggestion: (suggestion: {
    place_id: string
    description: string
  }) => void
  showMap: boolean
  toggleMap: () => void

  // Map props
  mapCenter: { lat: number; lng: number }
  markerPosition: { lat: number; lng: number } | null
  handleMapClick: (e: google.maps.MapMouseEvent) => void
  isLoaded: boolean

  // Common props
  errors: Record<string, string>
  locationInputRef: React.RefObject<HTMLInputElement>
}

const DateLocationSection: React.FC<Props> = ({
  // Date props
  date,
  setDate,
  calendarOpen,
  setCalendarOpen,
  startHour,
  startMinute,
  startPeriod,
  endHour,
  endMinute,
  endPeriod,
  setStartHour,
  setStartMinute,
  setStartPeriod,
  setEndHour,
  setEndMinute,
  setEndPeriod,

  // Location props
  locationName,
  handleLocationChange,
  handleLocationSearch,
  locationSuggestions,
  showSuggestions,
  handleSelectSuggestion,
  showMap,
  toggleMap,

  // Map props
  mapCenter,
  markerPosition,
  handleMapClick,
  isLoaded,

  // Common props
  errors,
  locationInputRef,
}) => {
  return (
    <div className="mb-6">
      <div className="relative rounded-md overflow-hidden border bg-white-100 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:gap-6">
          {/* Date and Time Section - Full width on mobile, half on desktop */}
          <div className="md:w-1/2 mb-6 md:mb-0">
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

          {/* Location Section - Full width on mobile, half on desktop */}
          <div className="w-full md:w-1/2" style={{ zIndex: 50 }}>
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
        </div>

        {/* Map - Full width and only visible when toggled */}
        {showMap && (
          <div
            className="rounded-md overflow-hidden bg-gray-100 h-48 sm:h-64 mt-4"
            id="location-map"
            style={{ zIndex: 10 }}
          >
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={13}
                onClick={handleMapClick}
                options={{
                  gestureHandling: 'cooperative',
                  fullscreenControl: true,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                }}
              >
                {markerPosition && <Marker position={markerPosition} />}
              </GoogleMap>
            ) : (
              <div className="h-full bg-gray-200 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <span className="text-gray-500">Loading map...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Button (Top Right) */}
        <Button
          variant="ghost"
          className="absolute top-2 right-2 sm:top-4 sm:right-4 h-8 w-8 p-0 rounded-full border"
          aria-label="Add more details"
          style={{ zIndex: 20 }}
        >
          <Icon name="Plus" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default DateLocationSection