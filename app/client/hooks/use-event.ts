/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useEventHooks.ts
'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useLoadScript } from '@react-google-maps/api'
import { format, addHours } from 'date-fns'
import { toast } from 'sonner'
import { eventSchema } from '@/lib/validations'
import { z } from 'zod'
import { GOOGLE_MAP_KEY } from '@/constants'
import { createEvent } from '@/lib/actions/event-action'
// import { useRouter } from 'next/navigation'

const libraries = ['places'] as any

interface EventHookOptions {
  initialData?: EventData;
}

export function useEventHooks({ initialData }: EventHookOptions = {}) {
    // const router = useRouter()
    const { data: session } = useSession()
    const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 }) // Default to NYC
    const [markerPosition, setMarkerPosition] = useState<{
        lat: number
        lng: number
    } | null>(null)
    const [locationName, setLocationName] = useState('')
    const [showMap, setShowMap] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [highlights, setHighlights] = useState<EventData['highlights']>({})
    const [faqs, setFaqs] = useState<EventData['faqs']>([])
    const [agendas, setAgendas] = useState<Agenda[]>([])

    // Time state with hours and minutes
    const [date, setDate] = useState<Date | undefined>(new Date())
    const now = new Date()
    const currentHour = now.getHours()
    const hour12 = currentHour % 12 || 12
    const formattedHour = hour12.toString().padStart(2, '0')
    const currentMinute = now.getMinutes()
    const roundedMinute = currentMinute >= 30 ? '30' : '00'
    const period = currentHour >= 12 ? 'PM' : 'AM'

    // Initialize with current time
    const [startHour, setStartHour] = useState(formattedHour)
    const [startMinute, setStartMinute] = useState(roundedMinute)
    const [startPeriod, setStartPeriod] = useState<'AM' | 'PM'>(period)

    // Initialize end time with current time + 1 hour
    const endTime = addHours(now, 1)
    const endHour12 = endTime.getHours() % 12 || 12
    const formattedEndHour = endHour12.toString().padStart(2, '0')
    const ePeriod = endTime.getHours() >= 12 ? 'PM' : 'AM'

    const [endHour, setEndHour] = useState(formattedEndHour)
    const [endMinute, setEndMinute] = useState(roundedMinute)
    const [endPeriod, setEndPeriod] = useState<'AM' | 'PM'>(ePeriod)

    // References
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
    const locationInputRef = useRef<HTMLInputElement>(null)

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAP_KEY as string,
        libraries,
    })

    const defaultEventData: EventData = {
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
        faqs: []
    }

    const [eventData, setEventData] = useState<EventData>(initialData || defaultEventData)

    // Calculate formatted date when date changes
    const formattedDate = useMemo(() => {
        return date ? format(date, 'yyyy-MM-dd') : ''
    }, [date])

    // Calculate formatted startTime and endTime when time components change
    const { formattedStartTime, formattedEndTime } = useMemo(() => {
        const startTime = `${startHour}:${startMinute} ${startPeriod}`
        const endTime = `${endHour}:${endMinute} ${endPeriod}`
        return { formattedStartTime: startTime, formattedEndTime: endTime }
    }, [startHour, startMinute, startPeriod, endHour, endMinute, endPeriod])

    // Validation function
    const validateEventData = useCallback(() => {
        // Format agenda data properly to match zod schema
        const formattedAgendas = agendas.map((agenda) => {
            // Make sure all agenda items have required fields with proper defaults
            const formattedItems = agenda.items.map((item) => ({
                id: item.id || null,
                title: item.title || 'Untitled Item', // Ensure title is not empty
                description: item.description || '',
                host: item.host || '',
                startTime: item.startTime || '',
                endTime: item.endTime || '',
                isNew: item.isNew
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
                active: agenda.active,
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
    }, [eventData, agendas])

    // Use effect to update eventData with the session email when it changes
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

    // Update eventData when date or time changes
    useEffect(() => {
        setEventData((prev) => ({
            ...prev,
            date: formattedDate,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
        }))
    }, [formattedDate, formattedStartTime, formattedEndTime])

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

    // Initialize from initialData if provided
    useEffect(() => {
        if (initialData) {
            setEventData(initialData);
            setHighlights(initialData.highlights || {});
            setFaqs(initialData.faqs || []);
            setAgendas(initialData.agenda || []);
            
            // Potentially parse and set date/time values from initialData
            if (initialData.date) {
                setDate(new Date(initialData.date));
            }
            
            if (initialData.location) {
                setLocationName(initialData.location);
            }
            
            // Parse time strings if needed
            // This is a simple implementation - you may need more robust parsing
            if (initialData.startTime) {
                const timeMatch = initialData.startTime.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
                if (timeMatch) {
                    setStartHour(timeMatch[1].padStart(2, '0'));
                    setStartMinute(timeMatch[2]);
                    setStartPeriod(timeMatch[3] as 'AM' | 'PM');
                }
            }
            
            if (initialData.endTime) {
                const timeMatch = initialData.endTime.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
                if (timeMatch) {
                    setEndHour(timeMatch[1].padStart(2, '0'));
                    setEndMinute(timeMatch[2]);
                    setEndPeriod(timeMatch[3] as 'AM' | 'PM');
                }
            }
        }
    }, [initialData]);

    // Memoize event handlers to prevent unnecessary re-creations
    const handleChange = useCallback(
        (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            field: keyof EventData,
        ) => {
            setEventData((prev) => ({ ...prev, [field]: e.target.value }))
        },
        [],
    )

    const handleCloudinaryUpload = useCallback((result: CloudinaryResult) => {
        if (result.event === 'success') {
            const fileUrl = result.info.secure_url
            const fileType: 'image' | 'video' =
                result.info.resource_type === 'video' ? 'video' : 'image'
            toast.success('File uploaded successfully!')
            setEventData((prev) => ({ ...prev, media: fileUrl, mediaType: fileType }))
        }
    }, [])

    const handleRemoveMedia = useCallback(() => {
        setEventData((prev) => ({ ...prev, media: undefined, mediaType: 'image' }))
    }, [])

    const handleLocationChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            setLocationName(value)
            setEventData((prev) => ({ ...prev, location: value }))

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
        },
        [isLoaded],
    )

    const handleSelectSuggestion = useCallback(
        (suggestion: LocationSuggestion) => {
            setLocationName(suggestion.description)
            setEventData((prev) => ({ ...prev, location: suggestion.description }))
            setShowSuggestions(false)

            if (isLoaded && window.google) {
                const geocoder = new google.maps.Geocoder()
                geocoder.geocode(
                    { placeId: suggestion.place_id },
                    (results, status) => {
                        if (status === 'OK' && results && results.length > 0) {
                            const { lat, lng } = results[0].geometry.location.toJSON()
                            setMapCenter({ lat, lng })
                            setMarkerPosition({ lat, lng })
                        }
                    },
                )
            }
        },
        [isLoaded],
    )

    const handleLocationSearch = useCallback(async () => {
        if (!locationName || !window.google) return

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
                setEventData((prev) => ({
                    ...prev,
                    location: results[0].formatted_address,
                }))
                setLocationName(results[0].formatted_address)
            }
        } catch (error) {
            console.error('Error searching for location:', error)
        }
    }, [locationName])

    const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng && window.google) {
            const lat = e.latLng.lat()
            const lng = e.latLng.lng()
            setMarkerPosition({ lat, lng })

            // Reverse geocode to get address
            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results && results.length > 0) {
                    setLocationName(results[0].formatted_address)
                    setEventData((prev) => ({
                        ...prev,
                        location: results[0].formatted_address,
                    }))
                }
            })
        }
    }, [])

    const toggleMap = useCallback(() => {
        setShowMap((prev) => !prev)
    }, [])

    const handleUpdateHighlights = useCallback((newHighlights: EventData['highlights']) => {
        setHighlights(newHighlights)
        setEventData((prev) => ({ ...prev, highlights: newHighlights }))
    }, [])

    const handleUpdateFaqs = useCallback((newFaqs: EventData['faqs']) => {
        setFaqs(newFaqs)
        setEventData((prev) => ({ ...prev, faqs: newFaqs }))
    }, [])

    // const handleSubmit = useCallback(async () => {
    //     if (!validateEventData()) {
    //         toast.error('Please fix the errors in the form.')
    //         return
    //     }

    //     setLoading(true)

    //     try {
    //         const formattedAgenda = agendas.map((agenda) => ({
    //             id: agenda.id,
    //             title: agenda.title || 'Untitled Agenda',
    //             active: agenda.active,
    //             items: agenda.items.map((item) => ({
    //                 id: item.id,
    //                 title: item.title || 'Untitled Item',
    //                 description: item.description || '',
    //                 host: item.host || '',
    //                 startTime: item.startTime || '',
    //                 endTime: item.endTime || '',
    //                 isNew: item.isNew
    //             })),
    //         }))

    //         const eventPayload = {
    //             ...eventData,
    //             agenda: formattedAgenda,
    //         }

    //         const result = await createEvent(eventPayload)

    //         if (!result) {
    //             throw new Error('Failed to create event')
    //         }

    //         toast.success('Event created successfully!')
    //         router.replace('/organization/events')
    //     } catch (error: any) {
    //         console.error('Error creating event:', error)
    //         toast.warning('Failed to create event. Please try again.')
    //     } finally {
    //         setLoading(false)
    //     }
    // }, [eventData, agendas, validateEventData, router])

    const handleSubmit = useCallback(async () => {
        if (!validateEventData()) {
          toast.error('Please fix the errors in the form.')
          return
        }
    
        setLoading(true)
    
        try {
          const formattedAgenda = agendas.map((agenda) => ({
            id: agenda.id,
            title: agenda.title || 'Untitled Agenda',
            active: agenda.active,
            items: agenda.items.map((item) => ({
              id: item.id,
              title: item.title || 'Untitled Item',
              description: item.description || '',
              host: item.host || '',
              startTime: item.startTime || '',
              endTime: item.endTime || '',
              isNew: item.isNew
            })),
          }))
    
          const eventPayload = {
            ...eventData,
            agenda: formattedAgenda,
          }
    
          const result = await createEvent(eventPayload)
          return result;
        } catch (error: any) {
          console.error('Error creating event:', error)
          toast.warning('Failed to create event. Please try again.')
          throw error;
        } finally {
          setLoading(false)
        }
      }, [eventData, agendas, validateEventData])

    const handleTitleChange = useCallback((title: string) => {
        setEventData((prev) => ({ ...prev, title }))
    }, [])

    const handleSummaryChange = useCallback((summary: string) => {
        setEventData((prev) => ({ ...prev, summary }))
    }, [])

    return {
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
        validateEventData
    }
}