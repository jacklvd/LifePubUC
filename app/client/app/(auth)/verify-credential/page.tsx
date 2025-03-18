/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { verifyEmail } from '@/lib/actions/auth'
import { Icon } from '@/components/icons'

export default function VerifyEmail() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const emailToken = searchParams.get('emailToken')
  const [message, setMessage] = useState('Verifying...')
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const processVerification = async () => {
      const result = await verifyEmail(emailToken)

      if (result.success) {
        setIsVerified(true)
        setMessage(result.message)
      } else {
        setMessage(result.message)
      }

      // Redirect to sign-in page after 5 seconds
      setTimeout(() => {
        router.push('/sign-in')
      }, 5000)
    }

    processVerification()
  }, [emailToken, router])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isVerified ? (
        <h1 className="text-2xl font-bold text-green-600">
          <Icon name="BadgeCheck" /> Email Verified!
        </h1>
      ) : (
        <h1 className="text-2xl font-bold text-yellow-600">
          <Icon name="RefreshCcw" /> Verifying...
        </h1>
      )}
      <p className="text-gray-500 mt-2">{message}</p>
      <p className="text-gray-400 mt-4">Redirecting to sign-in...</p>
    </div>
  )
}
