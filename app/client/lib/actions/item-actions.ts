'use server'
import { auth } from '@/auth'
import axios from 'axios'
import { API_BASE_URL } from '@/constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createItem({ formData }: { formData: any }) {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  console.log(formData)
  formData?.append('userId', session.user.id)

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/items`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error creating Item:',
        error.response?.data || error.message,
      )
      throw new Error(error.response?.data || 'Failed to create item')
    }
    console.error('Error creating Item:', error)
    throw error
  }
}

export async function getItemById({
  itemId,
}: {
  itemId: string | string[] | undefined
}) {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/items/${itemId}`)

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error getting item:',
        error.response?.data || error.message,
      )
      throw new Error('Failed to get item')
    }
    console.error('Error getting item:', error)
    throw error
  }
}

export async function getItemsForSeller({
  status,
  page = 1,
  limit = 100, // Increased limit to get more items for reports
  sort = '-createdAt',
  q,
  includeAll = false, // New parameter to get all items regardless of status
}: {
  status?: string
  page?: number
  limit?: number
  sort?: string
  q?: string
  includeAll?: boolean
} = {}) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      data: [],
      pagination: {
        total: 0,
        page,
        pages: 0,
        limit,
      },
      error: 'Authentication required',
      requiresOnboarding: false,
    }
  }

  // Build params object for axios
  const params: Record<string, string | number | boolean> = {}
  if (status && !includeAll) params.status = status
  if (page) params.page = page
  if (limit) params.limit = limit
  if (sort) params.sort = sort
  if (q) params.q = q

  const url = `${API_BASE_URL}/api/sellers/${session.user.id}/items`

  try {
    const response = await axios.get(url, { params })
    const result = response.data

    return {
      ...result,
      error: null,
      requiresOnboarding: false,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || error.message

      // Check if the error is related to Stripe onboarding
      if (
        typeof errorData === 'string' &&
        errorData.includes('Stripe Connect onboarding')
      ) {
        return {
          data: [],
          pagination: {
            total: 0,
            page,
            pages: 0,
            limit,
          },
          error: 'Seller has not completed Stripe Connect onboarding',
          requiresOnboarding: true,
        }
      }

      return {
        data: [],
        pagination: {
          total: 0,
          page,
          pages: 0,
          limit,
        },
        error: errorData || 'Failed to fetch seller items',
        requiresOnboarding: false,
      }
    }

    console.error('Error fetching seller items:', error)
    return {
      data: [],
      pagination: {
        total: 0,
        page,
        pages: 0,
        limit,
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      requiresOnboarding: false,
    }
  }
}

export async function deleteItem({ itemId }: { itemId: string }) {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/sellers/${session?.user?.id}/items/${itemId}`,
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error deleting item:',
        error.response?.data || error.message,
      )
      throw new Error('Failed to delete Item')
    }
    console.error('Error deleting item:', error)
    throw error
  }
}

export async function getCategories() {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/items/categories`)

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error getting categories:',
        error.response?.data || error.message,
      )
      throw new Error('Failed to get categories')
    }
    console.error('Error getting categories:', error)
    throw error
  }
}

export async function getConditions() {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/items/conditions`)

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error getting conditions:',
        error.response?.data || error.message,
      )
      throw new Error('Failed to get conditions')
    }
    console.error('Error getting conditions:', error)
    throw error
  }
}

export async function getAllItems({
  category,
  condition,
  minPrice,
  maxPrice,
  status = 'available',
  sort = '-createdAt',
  page = 1,
  limit = 10,
  q,
}: {
  category?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  status?: string
  sort?: string
  page?: number
  limit?: number
  q?: string
} = {}) {
  try {
    // Build params object for axios
    const params: Record<string, string | number> = {}
    if (category) params.category = category
    if (condition) params.condition = condition
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    if (status) params.status = status
    if (sort) params.sort = sort
    if (page) params.page = page
    if (limit) params.limit = limit
    if (q) params.q = q

    const response = await axios.get(`${API_BASE_URL}/api/items`, {
      params,
      headers: {
        'Cache-Control': 'no-store', // Disable caching for fresh data
      },
    })

    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error fetching items:',
        error.response?.data || error.message,
      )
    } else {
      console.error('Error fetching items:', error)
    }
    return []
  }
}

export async function getRecentItems(limit = 12) {
  try {
    return getAllItems({
      status: 'available',
      sort: '-createdAt', // Sort by newest first
      limit: limit,
    })
  } catch (error) {
    console.error('Error fetching recent items:', error)
    return []
  }
}
