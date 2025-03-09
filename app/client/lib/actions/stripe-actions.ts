'use server'

import { auth } from '@/auth'

export async function createStripeAccount() {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/accounts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData || 'Failed to create account')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating Stripe account:', error)
    throw error
  }
}

export async function createStripeAccountLink(accountId: string) {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    console.log(
      `Fetch request to: ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/account-links`,
    )

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/account-links`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: accountId,
          userId: session?.user?.id,
        }),
      },
    )

    const data = await response.json()

    return data
  } catch (error) {
    console.log('Error: ', error)
  }
}

export async function getUserOnboardingStripe(accountId: string) {
  const session = await auth()

  if (!session?.user?.id || '') {
    throw new Error('Authentication required')
  }

  try {
    console.log(
      `Fetch request to: ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/account-links`,
    )

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/onboarding`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: accountId,
          userId: session?.user?.id,
        }),
      },
    )

    const data = await response.json()
    //   console.log("API Response:", data);
    return data
  } catch (error) {
    console.log('Error: ', error)
  }
}

export async function checkStripeOnboardingStatus() {
  try {
    const session = await auth()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/onboarding`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session?.user?.id }),
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      console.error('API error:', response.status)
      return {
        success: false,
        error: `API error: ${response.status}`,
        isOnboarded: false,
      }
    }

    const responseData = await response.json()
    const isOnboarded = responseData?.data || false

    return {
      success: true,
      isOnboarded: isOnboarded,
    }
  } catch (error) {
    console.error('Error checking onboarding status:', error)
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/onboarding`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session?.user?.id }),
   
      },
    )

    if (!response.ok) {
      console.error('API error:', response.status)
      return {
        success: false,
        error: `API error: ${response.status}`,
        isOnboarded: false,
      }
    }

    const responseData = await response.json()
    const user = responseData?.data || false

    return {
      success: true,
      data: user,
    }
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      isOnboarded: false,
    }
  }
}

export async function createStripePaymentIntent({ cartItems  }: { cartItems: Item[], }) {
  try {
    const session = await auth()
    

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/payment-intent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ buyerId: session?.user?.id, cartItems: cartItems }),
      },
    )

    if (!response.ok) {
      console.error('API error:', response.status)
      return {
        success: false,
        error: `API error: ${response.status}`,
        isOnboarded: false,
      }
    }

    const responseData = await response.json()
    const data = responseData?.data || false

    
    return {
      success: true,
      data: data.clientSecret,
    }

  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      isOnboarded: false,
    }
  }
}
