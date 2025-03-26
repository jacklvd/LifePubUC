import React, { memo, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'

interface Props {
  locationName: string
  handleLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleLocationSearch: () => void
  locationSuggestions: LocationSuggestion[]
  showSuggestions: boolean
  handleSelectSuggestion: (suggestion: LocationSuggestion) => void
  showMap: boolean
  toggleMap: () => void
  errors: Record<string, string>
  locationInputRef: React.RefObject<HTMLInputElement>
}

const EventLocationPicker = memo(
  ({
    locationName,
    handleLocationChange,
    handleLocationSearch,
    locationSuggestions,
    showSuggestions,
    handleSelectSuggestion,
    showMap,
    toggleMap,
    errors,
    locationInputRef,
  }: Props) => {
    // Memoize the suggestion handler to prevent re-renders
    const selectSuggestion = useCallback(
      (suggestion: LocationSuggestion) => {
        return () => handleSelectSuggestion(suggestion)
      },
      [handleSelectSuggestion],
    )

    return (
      <>
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">
          Location
        </h3>
        {errors.location && (
          <p className="text-red-500 text-xs sm:text-sm mt-1 mb-2" role="alert">
            {errors.location}
          </p>
        )}

        {/* Input and Search Button with Suggestions Container */}
        <div className="flex flex-col pointer-events-auto">
          {/* Input and Button Row */}
          <div className="relative" ref={locationInputRef}>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-grow">
                <Input
                  placeholder="Enter a location"
                  className="w-full h-12 text-base pl-4 pr-10"
                  value={locationName}
                  onChange={handleLocationChange}
                  aria-label="Location"
                  aria-invalid={!!errors.location}
                  aria-describedby={
                    errors.location ? 'location-error' : undefined
                  }
                />
              </div>

              <Button
                variant="outline"
                className="h-12 w-12 p-0 flex-shrink-0"
                onClick={handleLocationSearch}
                aria-label="Search location"
              >
                <Icon name="Search" className="h-5 w-5" />
              </Button>
            </div>

            {/* Location Suggestions - Fixed Position */}
            {showSuggestions && locationSuggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 bg-white-100 border rounded-md shadow-lg max-h-64 overflow-y-auto w-full"
                style={{
                  zIndex: 1000,
                  top: "calc(100% - 8px)"
                }}
                role="listbox"
                aria-label="Location suggestions"
              >
                {locationSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    className="p-3 hover:bg-gray-100 active:bg-gray-200 cursor-pointer text-sm border-b last:border-b-0"
                    onClick={selectSuggestion(suggestion)}
                    role="option"
                    aria-selected="false"
                  >
                    {suggestion.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Map Button - Separate from Suggestions */}
          <div className="mt-1">
            <Button
              variant="link"
              className="text-blue-500 h-auto p-0 self-start text-xs sm:text-sm"
              onClick={toggleMap}
              type="button"
              aria-expanded={showMap}
              aria-controls="location-map"
            >
              <span className="flex items-center">
                {showMap ? (
                  <>
                    <Icon name="ChevronUp" className="h-4 w-4 mr-1" />
                    Hide map
                  </>
                ) : (
                  <>
                    <Icon name="ChevronDown" className="h-4 w-4 mr-1" />
                    Show map
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>
      </>
    )
  },
)

EventLocationPicker.displayName = 'EventLocationPicker'

export default EventLocationPicker