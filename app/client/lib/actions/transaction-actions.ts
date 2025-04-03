'use server'

import { auth } from '@/auth'

export async function getTransactionsTotalSales() {
  try {
    const session = await auth()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions/${session?.user?.id}/total-sale`,
      {
        method: 'GET',
      },
    )

    const responseData = await response.json()

    if (!response.ok) {
      console.error('API error:', response.status)
      return {
        success: false,
        error: `API error: ${response.status}`,
        message: responseData.message,
      }
    }

    const { data } = responseData
    console.log(data)

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error('Error getting transaction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
