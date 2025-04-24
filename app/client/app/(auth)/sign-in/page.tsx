'use client'

import { useState } from 'react'
import AuthForm from '@/app/(auth)/components/authform'
import { signInSchema } from '@/lib/validations'
import { signInWithCredentials } from '@/lib/actions/auth-actions'
import ResendVerification from '@/app/(auth)/components/resent-email'
import { Card } from '@/components/ui/card'

const Page = () => {
  const [isUnverified, setIsUnverified] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const handleSubmit = async (data: { email: string; password: string }) => {
    // Store the email in case we need to offer resend verification
    setUserEmail(data.email)

    const result = await signInWithCredentials(data)

    // Check if the error indicates an unverified email
    if (!result.success &&
      result.error &&
      result.error.toLowerCase().includes('not verified')) {
      setIsUnverified(true)
    } else {
      setIsUnverified(false)
    }

    return result
  }

  return (
    <>
      <AuthForm
        type="SIGN_IN"
        schema={signInSchema}
        defaultValues={{
          email: '',
          password: '',
        }}
        onSubmit={handleSubmit}
      />

      {isUnverified && userEmail && (
        <Card className="mt-6 bg-slate-800 border border-slate-700 p-4 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-white mb-2">Email Not Verified</h3>
          <p className="text-slate-300 mb-4">
            It looks like your email address hasn&apos;t been verified yet.
            Please check your inbox for the verification email or request a new one.
          </p>
          <ResendVerification
            email={userEmail}
          />
        </Card>
      )}
    </>
  )
}

export default Page