'use server'
import { auth } from '@/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createItem({ formData }: { formData: any }) {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  console.log(formData)
  formData?.append('userId', session.user.id)

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/items`,
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData || 'Failed to create account')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating Item account:', error)
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/items/${itemId}`,
      {
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to get item')
    }

    return await response.json()
  } catch (error) {
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

  const queryParams = new URLSearchParams()
  if (status && !includeAll) queryParams.append('status', status)
  if (page) queryParams.append('page', page.toString())
  if (limit) queryParams.append('limit', limit.toString())
  if (sort) queryParams.append('sort', sort)
  if (q) queryParams.append('q', q)

  const queryString = queryParams.toString()
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sellers/${session.user.id}/items${queryString ? `?${queryString}` : ''}`

  try {
    const response = await fetch(url, {
      method: 'GET',
    })

    if (!response.ok) {
      const errorData = await response.text()
      // Check if the error is related to Stripe onboarding
      if (errorData.includes('Stripe Connect onboarding')) {
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

    const result = await response.json()
    return {
      ...result,
      error: null,
      requiresOnboarding: false,
    }
  } catch (error) {
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sellers/${session?.user?.id}/items/${itemId}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to delete Item')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating Item account:', error)
    throw error
  }
}

export async function getCategories() {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/items/categories`,
      {
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to get categories')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating Item account:', error)
    throw error
  }
}

export async function getConditions() {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/items/conditions`,
      {
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to get conditions')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating Item account:', error)
    throw error
  }
}
