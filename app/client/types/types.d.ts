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
