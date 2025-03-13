'use client'

import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import { Icon } from './icons'

const SessionTimeout = () => {
  const { data: session, update } = useSession()
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const [showPopup, setShowPopup] = useState(false)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!session?.expires) {
      // console.log("No active session. Hiding popup.");
      setShowPopup(false) // Hide popup when session disappears (user logged out)
      return
    }

    const expirationTime = new Date(session.expires).getTime()
    const currentTime = new Date().getTime()
    const timeUntilExpiration = expirationTime - currentTime
    const warningTime = 60 * 1000 // Show warning 1 minute before expiry

    if (timeUntilExpiration <= 0) {
      // console.log("Session already expired. Signing out.");
      signOut()
      return
    }

    if (timeUntilExpiration <= warningTime) {
      // console.log("Triggering session warning popup.");
      setShowPopup(true)
      startCountdown(Math.floor(timeUntilExpiration / 1000))
    } else {
      const warningTimer = setTimeout(() => {
        console.log('Showing warning popup')
        setShowPopup(true)
        startCountdown(60)
      }, timeUntilExpiration - warningTime)

      return () => clearTimeout(warningTimer)
    }
  }, [session])

  const startCountdown = (seconds: number) => {
    setTimeLeft(seconds)

    if (countdownRef.current) clearInterval(countdownRef.current)

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!)
          signOut()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const continueSession = async () => {
    // console.log("User chose to continue session.");
    setShowPopup(false)
    if (countdownRef.current) clearInterval(countdownRef.current)

    try {
      const newSession = await update()
      console.log('Session updated:', newSession)
    } catch (error) {
      console.error('Error updating session:', error)
    }
  }

  return (
    showPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
        <div className="bg-white-100 p-6 rounded-xl shadow-xl text-center w-full max-w-[400px]">
          <p className="text-xl font-bold text-gray-800">
            ⚠️ Session Expiring Soon
          </p>
          <p className="mt-2 text-gray-600">
            Your session will expire in{' '}
            <span className="font-semibold text-red-600">{timeLeft}</span>{' '}
            seconds.
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all"
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            ></div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
            <button
              className="flex-1 px-4 py-2 bg-green-500 text-white font-medium rounded-lg transition hover:bg-green-600 text-gray-200"
              onClick={continueSession}
            >
              <Icon name="RefreshCcw" /> Continue
            </button>
            <button
              className="flex-1 px-4 py-2 bg-slate-600 text-white font-medium rounded-lg transition hover:bg-slate-700 text-gray-200"
              onClick={() => signOut()}
            >
              <Icon name="LogOut" /> Log Out
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default SessionTimeout
