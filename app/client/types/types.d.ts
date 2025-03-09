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
  seller?: string  // User ID reference
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
