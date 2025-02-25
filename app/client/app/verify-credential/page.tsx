/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function VerifyEmail() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const emailToken = searchParams.get('emailToken')
  const [message, setMessage] = useState('Verifying...')
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (!emailToken) {
      setMessage('Invalid verification link.')
      return
    }

    const verifyUser = async () => {
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-email`,
          {
            emailToken: emailToken,
          },
        )

        if (response.data.status === 'Success') {
          setIsVerified(true)
          setMessage('Email verified successfully!')
        } else {
          setMessage(response.data.message || 'Verification failed.')
        }

        console.log('Verification Response:', response)
      } catch (error: any) {
        console.error('Verification error:', error)
        setMessage('Error verifying email. Please try again.')
      }

      // Redirect to sign-in page after 5 seconds
      setTimeout(() => {
        router.push('/sign-in')
      }, 5000)
    }

    verifyUser()
  }, [emailToken, router])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isVerified ? (
        <h1 className="text-2xl font-bold text-green-600">
          ✅ Email Verified!
        </h1>
      ) : (
        <h1 className="text-2xl font-bold text-yellow-600">🔄 Verifying...</h1>
      )}
      <p className="text-gray-500 mt-2">{message}</p>
      <p className="text-gray-400 mt-4">Redirecting to sign-in...</p>
    </div>
  )
}
