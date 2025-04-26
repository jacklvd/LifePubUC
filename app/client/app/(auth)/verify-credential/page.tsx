'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { verifyEmail } from '@/lib/actions/auth-actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Icon } from '@/components/icons'
import ResendVerification from '../components/resent-email'

export default function VerifyEmail() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const emailToken = searchParams.get('emailToken')
  const [message, setMessage] = useState('We are verifying your email address')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(5)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [tokenExpired, setTokenExpired] = useState(false)
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const processVerification = async () => {
      try {
        // Short delay to show the loading animation
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const result = await verifyEmail(emailToken)

        // Check if verification was successful
        if (result.success) {
          setStatus('success')
          setMessage(
            result.message || 'Your email has been successfully verified!',
          )
        } else {
          setStatus('error')
          setMessage(
            result.message || 'There was a problem verifying your email.',
          )

          // Check if token is expired
          if (result.expired) {
            setTokenExpired(true)
            setUserEmail(result.email)
          }
        }

        // Start countdown timer (only for success or non-expired errors)
        if (result.success || !result.expired) {
          const timer = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev <= 1) {
                clearInterval(timer)
                if (!result.expired) {
                  redirectTimeoutRef.current = setTimeout(() => {
                    router.push('/sign-in')
                  }, 0)
                }
                return 0
              }
              return prev - 1
            })
          }, 1000)

          // Cleanup
          return () => {
            clearInterval(timer)
            if (redirectTimeoutRef.current) {
              clearTimeout(redirectTimeoutRef.current)
            }
          }
        }
      } catch (error) {
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
        console.log('Error verifying email:', error)
      }
    }

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5
      })
    }, 250)

    processVerification()

    return () => {
      clearInterval(progressInterval)
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [emailToken, router])

  // Effect to handle redirect after countdown reaches zero
  useEffect(() => {
    if (
      timeLeft === 0 &&
      (status === 'success' || (status === 'error' && !tokenExpired))
    ) {
      redirectTimeoutRef.current = setTimeout(() => {
        router.push('/sign-in')
      }, 100)

      return () => {
        if (redirectTimeoutRef.current) {
          clearTimeout(redirectTimeoutRef.current)
        }
      }
    }
  }, [timeLeft, status, router, tokenExpired])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <Icon
            name="Loader2"
            className="h-16 w-16 text-primary animate-spin"
          />
        )
      case 'success':
        return <Icon name="CheckCircle2" className="h-16 w-16 text-green-500" />
      case 'error':
        return <Icon name="XCircle" className="h-16 w-16 text-red-500" />
    }
  }

  const handleGoToSignIn = () => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current)
    }
    router.push('/sign-in')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800 shadow-xl">
          <CardHeader className="pb-6">
            <div className="w-20 h-20 mx-auto bg-slate-700 rounded-full flex items-center justify-center mb-4">
              {status === 'loading' ? (
                <Icon name="Mail" className="h-10 w-10 text-primary" />
              ) : (
                getStatusIcon()
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white">
              {status === 'loading' && 'Verifying Your Email'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Status'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-slate-300 text-center mb-6">{message}</p>

            {status === 'loading' && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2 bg-slate-700" />
                <p className="text-sm text-slate-400 text-center">
                  Please wait while we verify your email
                </p>
              </div>
            )}

            {(status === 'success' ||
              (status === 'error' && !tokenExpired)) && (
              <div className="bg-slate-700 rounded-lg p-4 mt-4">
                <p className="text-slate-300 text-center">
                  Redirecting to sign-in in {timeLeft} seconds...
                </p>
              </div>
            )}

            {tokenExpired && userEmail && (
              <ResendVerification email={userEmail} />
            )}
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleGoToSignIn}
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Please wait...' : 'Go to Sign In'}
              <Icon name="ArrowRight" className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Thank you for joining LifePub. We&apos;re excited to have you on
            board!
          </p>
        </div>
      </div>
    </div>
  )
}
