// store/useEventStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getWeekDaysForDate } from '@/lib/utils'

// Initialize with current date
const today = new Date()
const initialDate = {
  year: today.getFullYear(),
  month: today.getMonth(),
  day: today.getDate(),
}

// Create the store
const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      filteredEvents: [],
      isLoading: false,
      searchQuery: '',
      filterValue: 'upcoming',
      viewMode: 'list',

      calendarView: 'month',
      date: initialDate,
      weekDays: getWeekDaysForDate(
        initialDate.year,
        initialDate.month,
        initialDate.day,
      ),
      selectedEvent: null,
      popupPosition: null,
      showMonthSelector: false,

      // Actions for general state
      setEvents: (events) => set({ events, filteredEvents: events }),
      setFilteredEvents: (filteredEvents) => set({ filteredEvents }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilterValue: (filterValue) => set({ filterValue }),
      setViewMode: (viewMode) => set({ viewMode }),

      // Actions for calendar state
      setCalendarView: (calendarView) => set({ calendarView }),
      setDate: (dateUpdate) => {
        if (typeof dateUpdate === 'function') {
          const currentDate = get().date
          const newDate = dateUpdate(currentDate)
          const weekDays = getWeekDaysForDate(
            newDate.year,
            newDate.month,
            newDate.day,
          )
          set({ date: newDate, weekDays })
        } else {
          const weekDays = getWeekDaysForDate(
            dateUpdate.year,
            dateUpdate.month,
            dateUpdate.day,
          )
          set({ date: dateUpdate, weekDays })
        }
      },

      setSelectedEvent: (selectedEvent) => {
        // If we're clearing the selected event, also clear the popup position
        if (selectedEvent === null) {
          set({ selectedEvent: null, popupPosition: null })
        } else {
          set({ selectedEvent })
        }
      },

      setPopupPosition: (position) => {
        // Custom position handling with viewport constraints
        if (position !== null && typeof window !== 'undefined') {
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          // For mobile devices, we'll manage positioning in the component
          if (viewportWidth < 640) {
            set({ popupPosition: position })
            return
          }

          let top =
            typeof position.top === 'number'
              ? position.top
              : parseInt(position.top as string, 10)
          let left =
            typeof position.left === 'number'
              ? position.left
              : parseInt(position.left as string, 10)

          // Approximate popup dimensions
          const popupWidth = 288 // 18rem
          const popupHeight = 350 // Approximate

          // Ensure popup stays within viewport
          if (left + popupWidth > viewportWidth - 20) {
            left = Math.max(20, viewportWidth - popupWidth - 20)
          }

          if (top + popupHeight > viewportHeight - 20) {
            top = Math.max(20, viewportHeight - popupHeight - 20)
          }

          // Make sure popup doesn't go off left or top edges
          if (left < 20) left = 20
          if (top < 20) top = 20

          set({ popupPosition: { top, left } })
        } else {
          set({ popupPosition: position })
        }
      },

      setShowMonthSelector: (showMonthSelector) => set({ showMonthSelector }),

      // Calendar operations
      prevPeriod: () => {
        const { calendarView, date } = get()
        const newDate = { ...date }

        if (calendarView === 'month') {
          if (newDate.month === 0) {
            newDate.month = 11
            newDate.year--
          } else {
            newDate.month--
          }
        } else {
          // Week view - go back 7 days
          const tempDate = new Date(
            newDate.year,
            newDate.month,
            newDate.day - 7,
          )
          newDate.year = tempDate.getFullYear()
          newDate.month = tempDate.getMonth()
          newDate.day = tempDate.getDate()
        }

        const weekDays = getWeekDaysForDate(
          newDate.year,
          newDate.month,
          newDate.day,
        )
        set({ date: newDate, weekDays })
      },

      nextPeriod: () => {
        const { calendarView, date } = get()
        const newDate = { ...date }

        if (calendarView === 'month') {
          if (newDate.month === 11) {
            newDate.month = 0
            newDate.year++
          } else {
            newDate.month++
          }
        } else {
          // Week view - go forward 7 days
          const tempDate = new Date(
            newDate.year,
            newDate.month,
            newDate.day + 7,
          )
          newDate.year = tempDate.getFullYear()
          newDate.month = tempDate.getMonth()
          newDate.day = tempDate.getDate()
        }

        const weekDays = getWeekDaysForDate(
          newDate.year,
          newDate.month,
          newDate.day,
        )
        set({ date: newDate, weekDays })
      },

      goToToday: () => {
        const today = new Date()
        const newDate = {
          year: today.getFullYear(),
          month: today.getMonth(),
          day: today.getDate(),
        }
        const weekDays = getWeekDaysForDate(
          newDate.year,
          newDate.month,
          newDate.day,
        )
        set({ date: newDate, weekDays })
      },

      getEventsForDate: (year, month, day) => {
        const { events } = get()
        const targetDate = new Date(year, month, day).toDateString()

        return events.filter((event) => {
          if (!event.date) return false
          const eventDate = new Date(String(event.date)).toDateString()
          return eventDate === targetDate
        })
      },

      // Delete event
      deleteEvent: (eventId) => {
        const { events } = get()
        const updatedEvents = events.filter(
          (event) => event._id !== eventId && event.eventId !== eventId,
        )
        set({ events: updatedEvents, filteredEvents: updatedEvents })
      },
    }),
    {
      name: 'event-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        filterValue: state.filterValue,
        viewMode: state.viewMode,
        calendarView: state.calendarView,
      }),
    },
  ),
)

export default useEventStore
