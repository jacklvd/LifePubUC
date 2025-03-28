/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { signIn, signOut } from '@/auth'
import axios from 'axios'
import { API_BASE_URL } from '@/constants'

/**
 * Sign in with credentials
 */
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

    return { success: true, message: 'Signin successful!' }
  } catch (error: any) {
    console.error('Signin error:', error)
    return {
      success: false,
      error: error.message || 'Signin failed. Please try again.',
    }
  }
}

/**
 * Sign up a new user
 */
export const signUp = async (params: AuthCredentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/register`,
      params,
    )
    if (!response.data) {
      throw new Error('No response data')
    }

    return {
      success: true,
      message: 'Please check your email to verify your account.',
      toast: {
        title: 'Signup successful',
        description: 'Please check your email to verify your account.',
        variant: 'default',
      },
    }
  } catch (error: any) {
    console.error('Signup error:', error)
    return {
      success: false,
      error:
        error.response?.data?.message || 'Signup failed. Please try again.',
    }
  }
}

/**
 * Sign out the user
 */
export const signOutUser = async () => {
  try {
    await signOut({ redirect: false })

    return {
      success: true,
      url: '/sign-in', // Redirect URL after sign-out
      message: 'Signout successful!',
    }
  } catch (error: any) {
    console.error('Signout error:', error)
    return {
      success: false,
      error: 'Failed to sign out',
    }
  }
}

/**
 * Verify email with token
 */
export const verifyEmail = async (emailToken: string | null) => {
  if (!emailToken) {
    return { success: false, message: 'Invalid verification link.' }
  }

  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/auth/verify-email`,
      {
        emailToken: emailToken,
      },
    )

    // Check HTTP status code instead of a property that doesn't exist
    if (response.status === 200) {
      return { 
        success: true, 
        message: response.data.message || 'Email verified successfully!' 
      }
    } else {
      return {
        success: false,
        message: response.data.message || 'Verification failed.',
      }
    }
  } catch (error: any) {
    console.error('Verification error:', error)
    return {
      success: false,
      message:
        error.response?.data?.message ||
        'Error verifying email. Please try again.',
    }
  }
}
