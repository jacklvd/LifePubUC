/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { signIn, signOut } from '@/auth'

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, 'email' | 'password'>,
) => {
  const { email, password } = params

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { success: false, error: result.error }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Signin error:', error)
    return {
      success: false,
      error: error.message || 'Signin failed. Please try again.',
    }
  }
}

export const signUp = async (params: AuthCredentials) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      },
    )

    if (!response.ok) {
      const errorResponse = await response.json()
      return { success: false, error: errorResponse.message }
    }

    return {
      success: true,
      message: 'Please check your email to verify your account.',
    }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error: 'Signup failed. Please try again.' }
  }
}

export const signOutUser = async () => {
  try {
    await signOut({
      redirect: false,
    })

    return {
      success: true,
      url: '/sign-in', // or whatever URL you want to redirect to
    }
  } catch (error) {
    console.error('Signout error:', error)
    return {
      success: false,
      error: 'Failed to sign out',
    }
  }
}
