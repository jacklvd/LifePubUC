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
      message: response.data.message || 'Please check your email to verify your account.',
      canResend: response.data.canResend || false,
      email: response.data.email || null,
      toast: {
        title: 'Signup successful',
        description: 'Please check your email to verify your account. The verification link will expire in 24 hours.',
        variant: 'default',
      },
    }
  } catch (error: any) {
    console.error('Signup error:', error)
    // Check if we got a canResend flag from the backend
    if (error.response?.data?.canResend) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed. Please try again.',
        canResend: true,
        email: error.response?.data?.email || null
      }
    }
    return {
      success: false,
      error: error.response?.data?.message || 'Signup failed. Please try again.',
    }
  }
}

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/resend-verification`,
      { email }
    )
    
    return {
      success: true,
      message: response.data.message || 'Verification email resent successfully!',
      expiresIn: response.data.expiresIn || '24 hours',
    }
  } catch (error: any) {
    console.error('Resend verification error:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to resend verification email.',
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
  // Existing implementation with improved error handling
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
        message: response.data.message || 'Email verified successfully!',
      }
    } else {
      return {
        success: false,
        message: response.data.message || 'Verification failed.',
      }
    }
  } catch (error: any) {
    console.error('Verification error:', error)
    // Check if the token has expired
    if (error.response?.status === 400 && error.response?.data?.message?.includes('expired')) {
      return {
        success: false,
        message: 'Your verification link has expired. Please request a new one.',
        expired: true,
        email: error.response?.data?.email || null
      }
    }
    return {
      success: false,
      message:
        error.response?.data?.message ||
        'Error verifying email. Please try again.',
    }
  }
}

