'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { checkStripeOnboardingStatus } from '@/lib/actions/stripe-actions'
import { useSession } from 'next-auth/react'

interface OnboardingContextType {
    isOnboarded: boolean
    isLoading: boolean
    error: string | null
    checkOnboardingStatus: () => Promise<void>
}

const OnboardingContext = createContext<OnboardingContextType>({
    isOnboarded: false,
    isLoading: true,
    error: null,
    checkOnboardingStatus: async () => { },
})

export const useOnboarding = () => useContext(OnboardingContext)

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOnboarded, setIsOnboarded] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const pathname = usePathname()
    const { status } = useSession()

    // Use refs to track if we've already checked the status and when
    const hasCheckedRef = useRef(false)
    const lastCheckTimeRef = useRef(0)

    // Cache check results for 5 minutes (300000 ms)
    const CACHE_DURATION = 300000

    const checkOnboardingStatus = useCallback(async (force = false) => {
        if (status !== 'authenticated') {
            setIsLoading(false)
            return
        }

        // Skip check if already done and not forced
        const now = Date.now()
        if (
            !force &&
            hasCheckedRef.current &&
            (now - lastCheckTimeRef.current) < CACHE_DURATION
        ) {
            // Use cached result
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            const result = await checkStripeOnboardingStatus()

            setIsOnboarded(result.isOnboarded)

            if (!result.success && result.error) {
                setError(result.error)
            }

            // Update refs
            hasCheckedRef.current = true
            lastCheckTimeRef.current = now
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to check onboarding status')
            console.error('Error checking onboarding status:', err)
        } finally {
            setIsLoading(false)
        }
    }, [status])

    // Check once on initial render or when session status changes
    useEffect(() => {
        if (status === 'authenticated' && !hasCheckedRef.current) {
            checkOnboardingStatus()
        }
    }, [status, checkOnboardingStatus])

    // Handle redirects and access control
    useEffect(() => {
        if (isLoading || status !== 'authenticated') return

        const isOnboardingPage = pathname === '/organization/onboarding'
        const isOrganizationPage = pathname.startsWith('/organization')

        if (!isOnboarded && isOrganizationPage && !isOnboardingPage) {
            // If not onboarded and trying to access any organization page other than onboarding
            router.push('/organization/onboarding')
        } else if (isOnboarded && isOnboardingPage) {
            // If already onboarded and trying to access the onboarding page
            router.push('/organization/home')
        }
    }, [isOnboarded, isLoading, pathname, status, router])

    const value = {
        isOnboarded,
        isLoading,
        error,
        checkOnboardingStatus: () => checkOnboardingStatus(true), // Force check when explicitly called
    }

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    )
}