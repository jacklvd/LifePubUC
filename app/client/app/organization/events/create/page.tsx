/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/icons'
import { createEvent } from '@/lib/actions/events'
import { useSession } from 'next-auth/react'
import { UploadButton } from '@bytescale/upload-widget-react'
import { options, GOOGLE_MAP_KEY } from '@/constants'
import Image from 'next/image'
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { DateTimePicker } from '@/components/ui/time-picker'
import LeftSideBar from '@/components/leftside-bar'
import Additional from '@/components/additional'

interface EventData {
  email: string;
  title: string;
  description: string;
  media: string;
  mediaType: 'image' | 'video';
  location: string;
  date: string; // Stored as YYYY-MM-DD
  startTime: string; // Stored as HH:MM
  endTime: string; // Stored as HH:MM
  agenda: Array<{
    title: string;
    startTime: string;
    endTime: string;
  }>;
}

interface LocationSuggestion {
  place_id: string;
  description: string;
}


const EventCreationPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 }) // Default to NYC
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [locationName, setLocationName] = useState('')
  const [showMap, setShowMap] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [date, setDate] = useState<Date | undefined>(new Date('2025-04-11'))
  const [startTime, setStartTime] = useState<string>('10:00')
  const [endTime, setEndTime] = useState<string>('12:00')
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // References
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_KEY as string,
    libraries: ['places'] as any,
  })

  const [eventData, setEventData] = useState<EventData>({
    email: '',
    title: 'Event Title',
    description: '',
    media: '',
    mediaType: 'image',
    location: '',
    date: '2025-04-11',
    startTime: '10:00',
    endTime: '12:00',
    agenda: [{ title: '', startTime: '', endTime: '' }],
  })

  useEffect(() => {
    if (session?.user?.email) {
      setEventData((prev) => ({ ...prev, email: session?.user?.email as string }))
    }
  }, [session])

  // Initialize autocomplete service when maps are loaded
  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService()
    }
  }, [isLoaded])

  // Update eventData when date or time changes
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd')
      setEventData(prev => ({ ...prev, date: formattedDate }))
    }
  }, [date])

  useEffect(() => {
    setEventData(prev => ({ ...prev, startTime, endTime }))
  }, [startTime, endTime])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof EventData) => {
    setEventData({ ...eventData, [field]: e.target.value })
  }

  const handleUpload = (files: any) => {
    if (files.length > 0) {
      const uploadedFile = files[0]
      const fileUrl = uploadedFile.fileUrl

      // Ensure fileType exists, fallback to checking file extension
      let fileType: 'image' | 'video' = 'image'
      if (uploadedFile.fileType && typeof uploadedFile.fileType === 'string') {
        fileType = uploadedFile.fileType.startsWith('video') ? 'video' : 'image'
      } else if (fileUrl.match(/\.(mp4|mov|avi|webm)$/i)) {
        fileType = 'video'
      }

      setEventData({ ...eventData, media: fileUrl, mediaType: fileType })
    }
  }

  const handleRemoveMedia = () => {
    setEventData({ ...eventData, media: '', mediaType: 'image' })
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
      if (autocompleteService.current) {
        autocompleteService.current.getPlacePredictions(
          { input: value },
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              setLocationSuggestions(
                predictions.map(prediction => ({
                  place_id: prediction.place_id,
                  description: prediction.description,
                }))
              )
              setShowSuggestions(true)
            } else {
              setLocationSuggestions([])
              setShowSuggestions(false)
            }
          }
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
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address: locationName }, (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
            resolve(results)
          } else {
            reject(status)
          }
        })
      })

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

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      // Ensure all required fields are set
      const submissionData = {
        ...eventData,
        // Ensure location meets minimum requirements
        location: eventData.location || "Online Event",
        // Ensure title meets minimum requirements
        title: eventData.title.length >= 3 ? eventData.title : "Untitled Event",
        // Set default description if empty
        description: eventData.description || "No description provided",
        // Ensure media URL is valid if present
        media: eventData.media || "https://via.placeholder.com/800x400",
      };

      console.log("Submitting event data:", submissionData);

      // Submit the event
      const result = await createEvent(submissionData);
      alert('Event created successfully!');
      router.replace('/organization/events');
    } catch (error: any) {
      console.error("Error creating event:", error);
      setError(error.message || 'Error creating event');
      alert(`Error creating event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formattedDate = date ? format(date, 'EEEE, MMMM d, yyyy') : '';

  // Format times for display
  const formatDisplayTime = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'pm' : 'am';
    const hour12 = hours % 12 || 12;
    return `${hour12}${minutes > 0 ? `:${minutes}` : ''}${period}`;
  };

  const formattedStartTime = formatDisplayTime(startTime);
  const formattedEndTime = formatDisplayTime(endTime);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <LeftSideBar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Event Photo Section */}
          <div className="mb-6">
            <div className="relative rounded-md overflow-hidden border bg-white">
              <div className="h-64 flex items-center justify-center">
                {!eventData.media ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-white">
                      <Icon name="Upload" className="h-6 w-6 text-blue-500" />
                    </div>
                    <UploadButton options={options} onComplete={handleUpload}>
                      {({ onClick }) => (
                        <Button variant="outline" onClick={onClick}>
                          Upload an Image or a Video
                        </Button>
                      )}
                    </UploadButton>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {eventData.mediaType === 'image' ? (
                      <Image
                        src={eventData.media}
                        alt="Event media"
                        className="w-full h-full object-cover"
                        layout="fill"
                      />
                    ) : (
                      <video controls className="w-full h-full">
                        <source src={eventData.media} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    <Button
                      variant="destructive"
                      className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white-100 shadow-md"
                      onClick={handleRemoveMedia}
                    >
                      <Icon name="X" className="h-4 w-4 text-black" />
                    </Button>
                  </div>
                )}
              </div>
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
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <Input
                        placeholder="Enter a location"
                        className="mr-2"
                        value={locationName}
                        onChange={handleLocationChange}
                      />
                      <Button
                        variant="outline"
                        className="shrink-0"
                        onClick={handleLocationSearch}
                      >
                        <Icon name="Search" className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      className="text-blue-500 mt-1 h-auto p-0 self-start"
                      onClick={toggleMap}
                    >
                      <span>{showMap ? 'Hide map' : 'Show map'}</span>
                    </Button>
                  </div>
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
                      onClick={handleMapClick}>
                      {markerPosition && (
                        <Marker position={markerPosition} />
                      )}
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
          <Additional />

          {/* Agenda Section */}


          {/* Finish */}
          <div className="flex justify-end mb-6">
            <Button className="bg-green-300 hover:bg-green-500 text-white" type="button" onClick={handleSubmit}>
              Save and continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCreationPage
