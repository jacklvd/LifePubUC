'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { resendVerificationEmail } from '@/lib/actions/auth-actions'
import { Icon } from '@/components/icons'

interface ResendVerificationProps {
  email: string
}

export default function ResendVerification({ email }: ResendVerificationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleResend = async () => {
    if (isSubmitting || countdown > 0) return

    setIsSubmitting(true)
    try {
      const result = await resendVerificationEmail(email)

      if (result.success) {
        toast.success('Verification email sent!', {
          description: `We've sent a new verification email to ${email}. It will expire in ${result.expiresIn || '24 hours'}.`,
        })

        // Start countdown to prevent spam (60 seconds)
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        toast.error('Failed to resend', {
          description:
            result.error || 'Something went wrong. Please try again.',
        })
      }
    } catch (error) {
      console.error('Error resending verification:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="text-center mt-4">
      <p className="text-sm text-slate-400 mb-2">
        {countdown > 0
          ? `You can request a new verification email in ${countdown} seconds`
          : "Didn't receive the verification email?"}
      </p>
      <Button
        onClick={handleResend}
        disabled={isSubmitting || countdown > 0}
        variant="outline"
        className="text-primary"
        size="sm"
      >
        {isSubmitting ? (
          <>
            <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : countdown > 0 ? (
          `Wait ${countdown}s`
        ) : (
          <>
            <Icon name="RefreshCw" className="mr-2 h-4 w-4" />
            Resend Verification Email
          </>
        )}
      </Button>
    </div>
  )
}
