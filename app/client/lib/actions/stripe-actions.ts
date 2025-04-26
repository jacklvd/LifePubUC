'use server'

import { auth } from '@/auth'
import axios from 'axios'
import { API_BASE_URL } from '@/constants'

export async function createStripeAccount() {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/payment/accounts`, {
      userId: session.user.id,
    })

    return response.data
  } catch (error) {
    console.error('Error creating Stripe account:', error)
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || 'Failed to create account')
    }
    throw error
  }
}

export async function createStripeAccountLink(accountId: string) {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    console.log(`Making request to: ${API_BASE_URL}/api/payment/account-links`)

    const response = await axios.post(
      `${API_BASE_URL}/api/payment/account-links`,
      {
        account: accountId,
        userId: session?.user?.id,
      },
    )

    return response.data
  } catch (error) {
    console.log('Error: ', error)
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || 'Failed to create account link')
    }
    throw error
  }
}

export async function getUserOnboardingStripe(accountId: string) {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/user/onboarding`, {
      account: accountId,
      userId: session?.user?.id,
    })

    return response.data
  } catch (error) {
    console.log('Error: ', error)
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data || 'Failed to get user onboarding status',
      )
    }
    throw error
  }
}

export async function checkStripeOnboardingStatus() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Authentication required',
        isOnboarded: false,
      }
    }

    // Use axios.get instead of post since your backend expects GET for checking status
    const response = await axios.post(`${API_BASE_URL}/api/user/onboarding`, {
      userId: session.user.id,
    })

    // Handle the case where the API returns a 400 status code
    const responseData = response.data
    const isOnboarded = responseData?.data || false

    return {
      success: true,
      isOnboarded: isOnboarded,
    }
  } catch (error) {
    console.error('Error checking onboarding status:', error)

    if (axios.isAxiosError(error) && error.response?.status === 400) {
      // If the error is specifically about not being onboarded (400 status)
      // This is the expected response from your backend when not onboarded
      return {
        success: false,
        error: error.response?.data?.message || "User hasn't finish onboarding",
        isOnboarded: false,
      }
    }

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        isOnboarded: false,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      isOnboarded: false,
    }
  }
}

export async function getUserStripe() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Authentication required',
        isOnboarded: false,
      }
    }

    const response = await axios.post(`${API_BASE_URL}/api/user/onboarding`, {
      userId: session.user.id,
    })

    const responseData = response.data
    const user = responseData?.data || false

    return {
      success: true,
      data: user,
    }
  } catch (error) {
    console.error('Error getting user data:', error)

    if (axios.isAxiosError(error) && error.response?.status === 400) {
      // If the error is specifically about not being onboarded
      return {
        success: false,
        isOnboarded: false,
        error: error.response?.data?.message || "User hasn't finish onboarding",
      }
    }

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        isOnboarded: false,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      isOnboarded: false,
    }
  }
}

export async function createStripePaymentIntent({
  cartItems,
}: {
  cartItems: Item[]
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Authentication required',
        isOnboarded: false,
      }
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/payment/payment-intent`,
      {
        buyerId: session.user.id,
        cartItems: cartItems,
      },
    )

    const responseData = response.data
    const data = responseData?.data || false

    return {
      success: true,
      data: data.clientSecret,
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    }
  }
}
