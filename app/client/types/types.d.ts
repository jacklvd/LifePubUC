/* eslint-disable @typescript-eslint/no-explicit-any */
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
  createdAt?: Date
  updatedAt?: Date
}

interface Category {
  title: string
  url: string
}
