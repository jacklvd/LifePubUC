// hooks/use-eventprocessing.ts
import { useCallback, useMemo, useEffect } from 'react'
import useEventStore from '@/store/useEventStore'
import { useDebounce } from '@/hooks/use-debouce'

export const useEventProcessing = (userEmail?: string | null) => {
  const {
    events,
    filteredEvents,
    isLoading,
    searchQuery,
    filterValue,
    setFilteredEvents,
    deleteEvent: removeEventFromStore,
  } = useEventStore()

  // Use debounce for search to prevent too many re-renders
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Apply filters to events - memoized for performance
  const applyFilters = useCallback(
    (
      allEvents: Event[],
      filter: 'upcoming' | 'past' | 'draft' | 'all',
      search: string,
    ) => {
      const today = new Date()

      // First apply status filter
      let filtered = [...allEvents]

      switch (filter) {
        case 'upcoming':
          filtered = filtered.filter((event) => {
            if (!event.date) return false
            return new Date(String(event.date)) >= today
          })
          break
        case 'past':
          filtered = filtered.filter((event) => {
            if (!event.date) return false
            return new Date(String(event.date)) < today
          })
          break
        case 'draft':
          filtered = filtered.filter((event) => event.status === 'draft')
          break
        // 'all' doesn't need filtering
      }

      // Then apply search filter if needed
      if (search.trim()) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(
          (event) =>
            event.title?.toLowerCase().includes(searchLower) ||
            false ||
            event.summary?.toLowerCase().includes(searchLower) ||
            false ||
            event.location?.toLowerCase().includes(searchLower) ||
            false,
        )
      }

      return filtered
    },
    [],
  )

  // Calculate filtered events whenever dependencies change
  const processedEvents = useMemo(() => {
    return applyFilters(events, filterValue, debouncedSearch)
  }, [events, filterValue, debouncedSearch, applyFilters])

  // Update filteredEvents in the store whenever processedEvents changes
  useEffect(() => {
    setFilteredEvents(processedEvents)
  }, [processedEvents, setFilteredEvents])

  // Calculate summary statistics
  const statistics = useMemo(() => {
    const stats = {
      total: events.length,
      upcoming: 0,
      past: 0,
      draft: 0,
      sold: 0,
      capacity: 0,
    }

    const today = new Date()

    events.forEach((event) => {
      // Count by status
      if (event.date) {
        const eventDate = new Date(String(event.date))
        if (eventDate >= today) {
          stats.upcoming++
        } else {
          stats.past++
        }
      }

      if (event.status === 'draft') {
        stats.draft++
      }

      // Count tickets
      if (event.tickets && event.tickets.length > 0) {
        event.tickets.forEach((ticket) => {
          stats.sold += ticket.sold || 0
          stats.capacity += ticket.capacity || 0
        })
      }
    })

    return stats
  }, [events])

  // Delete event handler
  const deleteEvent = useCallback(
    async (
      eventId: string,
      apiDeleteFn: (id: string, email?: string) => Promise<any>,
    ) => {
      if (!userEmail) return false

      try {
        // Call API to delete the event
        await apiDeleteFn(eventId, userEmail)

        // Remove from store
        removeEventFromStore(eventId)
        return true
      } catch (error) {
        console.error('Error deleting event:', error)
        return false
      }
    },
    [userEmail, removeEventFromStore],
  )

  return {
    events,
    filteredEvents: processedEvents,
    isLoading,
    statistics,
    deleteEvent,
  }
}

export default useEventProcessing
