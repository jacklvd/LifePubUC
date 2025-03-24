/* eslint-disable @typescript-eslint/no-explicit-any */

interface EventState {
  // UI State
  events: Event[]
  filteredEvents: Event[]
  isLoading: boolean
  searchQuery: string
  filterValue: 'upcoming' | 'past' | 'draft' | 'all'
  viewMode: 'list' | 'calendar'

  // Calendar specific state
  calendarView: ViewType
  date: DateState
  weekDays: WeekDay[]
  selectedEvent: Event | null
  popupPosition: PopupPosition | null
  showMonthSelector: boolean

  // Actions
  setEvents: (events: Event[]) => void
  setFilteredEvents: (events: Event[]) => void
  setIsLoading: (isLoading: boolean) => void
  setSearchQuery: (query: string) => void
  setFilterValue: (filter: 'upcoming' | 'past' | 'draft' | 'all') => void
  setViewMode: (mode: 'list' | 'calendar') => void

  setCalendarView: (view: ViewType) => void
  setDate: (date: DateState | ((prev: DateState) => DateState)) => void
  setSelectedEvent: (event: Event | null) => void
  setPopupPosition: (position: PopupPosition | null) => void
  setShowMonthSelector: (show: boolean) => void

  // Calendar operations
  prevPeriod: () => void
  nextPeriod: () => void
  goToToday: () => void
  getEventsForDate: (year: number, month: number, day: number) => Event[]

  // Delete event
  deleteEvent: (eventId: string) => void
}

interface DateState {
  year: number
  month: number
  day: number
}

interface PopupPosition {
  top: number
  left: number
}

interface WeekDay {
  date: number
  month: number
  year: number
  day: string
  fullDate: Date
}

interface EventPosition {
  top: number
  height: number
  width: number
}

interface PublishEventResponse {
  message: string
  errors?: string[]
  event?: any // Replace with your actual event type
}

interface AgendaItem {
  id: string | null
  title: string
  description?: string
  host?: string
  startTime: string
  endTime: string
  isNew?: boolean // explicitly optional
}

interface Agenda {
  id: string
  title: string
  active: boolean
  items: AgendaItem[]
}

interface EventData {
  email: string
  title: string
  summary: string
  description: string
  media?: string
  mediaType: 'image' | 'video'
  location: string
  date: string
  startTime: string
  endTime: string
  agenda: Agenda[]
  highlights?: {
    ageRestriction?: string
    doorTime?: string
    parkingInfo?: string
  }
  faqs?: Array<{
    question: string
    answer: string
  }>
}

interface Ticket {
  id: string
  name: string
  sold: number
  capacity: number
  type: 'Free' | 'Paid' | 'Donation'
  price?: number
  saleStart: Date
  saleEnd: Date
  startTime: string
  endTime: string
  minPerOrder?: number
  maxPerOrder?: number
}

interface TicketFormData {
  name: string
  capacity: number
  type: 'Free' | 'Paid' | 'Donation'
  price?: number
  saleStart: Date
  saleEnd: Date
  startTime: string
  endTime: string
  minPerOrder?: number
  maxPerOrder?: number
  updateTotalCapacity?: boolean
}

interface LocationSuggestion {
  place_id: string
  description: string
}

interface Event {
  _id: string
  eventId: string
  email: string
  title: string
  summary: string
  description?: string
  media?: string // URL for image or video
  mediaType: 'image' | 'video'
  location: string
  date: Date | string
  startTime: string
  endTime: string
  agenda?: AgendaItem[]
  highlights?: EventHighlights
  faqs?: EventFAQ[]
  tickets?: Ticket[]
  totalCapacity?: number
  status: 'draft' | 'on sale'
  publishedAt?: Date | string
  publishedBy?: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface CloudinaryResult {
  event: file
  info: {
    secure_url: string
    resource_type: string
  }
}

interface AuthCredentials {
  fullName: string
  email: string
  password: string
  universityId: string
  stripeConnectOnboardingComplete?: boolean
}

interface User {
  fullName: string
  email: string
  password: string
  universityId: string
  stripeConnectOnboardingComplete?: boolean
  createdAt: Date
  updatedAt: Date
}

interface Item {
  _id: string
  id?: string
  title: string
  description: string
  seller?: string // User ID reference
  category: string
  condition: string
  price: {
    amount: number
  }
  images: string[]
  status: string
  views: number
  rating?: number
  featured?: boolean
  currency?: string
  createdAt: Date
  updatedAt: Date
}

interface Category {
  title: string
  url: string
}

interface PriceData {
  amount: string | number
}

// Section type definition
interface Section {
  id: string
  label: string
}
