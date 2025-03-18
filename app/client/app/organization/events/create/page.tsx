/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import { createEvent } from '@/lib/actions/events'
import { useSession } from 'next-auth/react'
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

import { toast } from 'sonner'
import { eventSchema } from '@/lib/validations'
import { z } from 'zod'
import { GOOGLE_MAP_KEY } from '@/constants'
// event components
import EventDateTimePicker from '@/components/event-ui/event-datetime-picker'
import EventTitleInput from '@/components/event-ui/event-title-picker'
import LeftSideBar from '@/components/event-ui/event-leftside-bar'
import EventAdditional from '@/components/event-ui/event-additional'
import EventLocationPicker from '@/components/event-ui/event-location'
import EventPhotoUpload from '@/components/event-ui/event-photo'
import EventAgenda from '@/components/event-ui/event-agenda'
import EventInsight from '@/components/event-ui/event-insight'

const EventCreationPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 }) // Default to NYC
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [locationName, setLocationName] = useState('')
  const [showMap, setShowMap] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [highlights, setHighlights] = useState({})
  const [faqs, setFaqs] = useState([])
  const [agendas, setAgendas] = useState<Agenda[]>([])

  // Time state with hours and minutes
  const [startHour, setStartHour] = useState('01')
  const [startMinute, setStartMinute] = useState('00')
  const [startPeriod, setStartPeriod] = useState<'AM' | 'PM'>('AM')
  const [endHour, setEndHour] = useState('01')
  const [endMinute, setEndMinute] = useState('00')
  const [endPeriod, setEndPeriod] = useState<'AM' | 'PM'>('PM')

  // References
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_KEY as string,
    libraries: ['places'] as any,
  })

  const [eventData, setEventData] = useState<EventData>({
    email: '',
    title: '',
    summary: '',
    description: '',
    media: undefined,
    mediaType: 'image',
    location: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    agenda: [],
    highlights: {},
    faqs: [],
  })

  useEffect(() => {
    if (session?.user?.email) {
      setEventData((prev) => ({
        ...prev,
        email: session?.user?.email as string,
      }))
    }
  }, [session])

  // Initialize autocomplete service when maps are loaded
  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService()
    }
  }, [isLoaded])

  // Update eventData when date changes
  useEffect(() => {
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : ''
    setEventData((prev) => ({ ...prev, date: formattedDate }))
  }, [date])

  // Update eventData when time changes
  useEffect(() => {
    // Convert 12-hour format to 24-hour format for startTime
    let startHour24 = parseInt(startHour)
    if (startPeriod === 'PM' && startHour24 < 12) startHour24 += 12
    if (startPeriod === 'AM' && startHour24 === 12) startHour24 = 0

    // Convert 12-hour format to 24-hour format for endTime
    let endHour24 = parseInt(endHour)
    if (endPeriod === 'PM' && endHour24 < 12) endHour24 += 12
    if (endPeriod === 'AM' && endHour24 === 12) endHour24 = 0
    const startTime = `${startHour}:${startMinute} ${startPeriod}`
    const endTime = `${endHour}:${endMinute} ${endPeriod}`

    setEventData((prev) => ({ ...prev, startTime, endTime }))
  }, [startHour, startMinute, startPeriod, endHour, endMinute, endPeriod])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof EventData,
  ) => {
    setEventData({ ...eventData, [field]: e.target.value })
  }

  const handleCloudinaryUpload = (result: any) => {
    if (result.event === 'success') {
      const fileUrl = result.info.secure_url
      const fileType: 'image' | 'video' =
        result.info.resource_type === 'video' ? 'video' : 'image'
      toast.success('File uploaded successfully!')
      setEventData((prev) => ({ ...prev, media: fileUrl, mediaType: fileType }))
    }
  }

  const handleRemoveMedia = () => {
    setEventData((prev) => ({ ...prev, media: undefined, mediaType: 'image' }))
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocationName(value)
    setEventData({ ...eventData, location: value })

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Don't search if input is empty
    if (!value.trim()) {
      setLocationSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Debounce location search
    debounceTimeout.current = setTimeout(() => {
      if (isLoaded && autocompleteService.current) {
        autocompleteService.current.getPlacePredictions(
          { input: value },
          (predictions, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              predictions
            ) {
              setLocationSuggestions(
                predictions.map((prediction) => ({
                  place_id: prediction.place_id,
                  description: prediction.description,
                })),
              )
              setShowSuggestions(true)
            } else {
              setLocationSuggestions([])
              setShowSuggestions(false)
            }
          },
        )
      }
    }, 300)
  }

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    setLocationName(suggestion.description)
    setEventData({ ...eventData, location: suggestion.description })
    setShowSuggestions(false)

    if (isLoaded && window.google) {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ placeId: suggestion.place_id }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location.toJSON()
          setMapCenter({ lat, lng })
          setMarkerPosition({ lat, lng })
        }
      })
    }
  }

  const handleLocationSearch = async () => {
    if (!locationName) return

    try {
      const geocoder = new window.google.maps.Geocoder()
      const results = await new Promise<google.maps.GeocoderResult[]>(
        (resolve, reject) => {
          geocoder.geocode({ address: locationName }, (results, status) => {
            if (status === 'OK' && results && results.length > 0) {
              resolve(results)
            } else {
              reject(status)
            }
          })
        },
      )

      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location.toJSON()
        setMapCenter({ lat, lng })
        setMarkerPosition({ lat, lng })
        setEventData({
          ...eventData,
          location: results[0].formatted_address,
        })
        setLocationName(results[0].formatted_address)
      }
    } catch (error) {
      console.error('Error searching for location:', error)
    }
  }

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setMarkerPosition({ lat, lng })

      // Reverse geocode to get address
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          setLocationName(results[0].formatted_address)
          setEventData({
            ...eventData,
            location: results[0].formatted_address,
          })
        }
      })
    }
  }

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  const validateEventData = () => {
    // Format agenda data properly to match zod schema
    const formattedAgendas = agendas.map((agenda) => {
      // Make sure all agenda items have required fields with proper defaults
      const formattedItems = agenda.items.map((item) => ({
        id: item.id,
        title: item.title || 'Untitled Item', // Ensure title is not empty
        description: item.description || '',
        host: item.host || '',
        startTime: item.startTime || '',
        endTime: item.endTime || '',
      }))

      // Filter out any incomplete items that would fail validation
      const validItems = formattedItems.filter(
        (item) =>
          item.title.length >= 3 &&
          item.startTime.match(/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/) &&
          item.endTime.match(/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/),
      )

      return {
        id: agenda.id,
        title: agenda.title || 'Untitled Agenda', // Ensure title is not empty
        items: validItems,
      }
    })

    // Filter out empty agendas
    const validAgendas = formattedAgendas.filter(
      (agenda) => agenda.items.length > 0,
    )

    const fullEventData = {
      ...eventData,
      agenda: validAgendas,
    }

    try {
      eventSchema.parse(fullEventData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('Validation errors:', error.errors)
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          // Extract the field name from the path
          const field = err.path[0] as string
          newErrors[field] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async () => {
    if (!validateEventData()) {
      toast.error('Please fix the errors in the form.')
      return
    }

    setLoading(true)

    try {
      const formattedAgenda = agendas.map((agenda) => ({
        id: agenda.id,
        title: agenda.title || 'Untitled Agenda',
        items: agenda.items.map((item) => ({
          id: item.id,
          title: item.title || 'Untitled Item',
          description: item.description || '',
          host: item.host || '',
          startTime: item.startTime || '',
          endTime: item.endTime || '',
        })),
      }))

      const eventPayload = {
        ...eventData,
        agenda: formattedAgenda,
      }

      // console.log("Sending event data to backend:", eventPayload); // Debugging Log

      const result = await createEvent(eventPayload)

      if (!result) {
        throw new Error('Failed to create event')
      }

      toast.success('Event created successfully!')
      router.replace('/organization/events')
    } catch (error: any) {
      console.error('Error creating event:', error) // Debugging Log
      toast.warning('Failed to create event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateHighlights = (newHighlights: any) => {
    setHighlights(newHighlights)
    setEventData((prev) => ({ ...prev, highlights: newHighlights }))
  }

  const handleUpdateFaqs = (newFaqs: any) => {
    setFaqs(newFaqs)
    setEventData((prev) => ({ ...prev, faqs: newFaqs }))
  }

  // Handle click outside of location suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <LeftSideBar />

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
          <div className="mb-6">
            <EventTitleInput
              title={eventData.title}
              summary={eventData.summary}
              error={errors.title}
              onTitleChange={(title) =>
                setEventData((prev) => ({ ...prev, title }))
              }
              onSummaryChange={(summary) =>
                setEventData((prev) => ({ ...prev, summary }))
              }
            />
          </div>

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
          <div className="mb-6">
            <EventInsight
              description={eventData.description}
              handleChange={(e) => handleChange(e, 'description')}
              error={errors.description}
            />
          </div>

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
              className="bg-green-300 hover:bg-green-500 text-white"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save and continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default EventCreationPage
