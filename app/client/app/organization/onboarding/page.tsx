/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import {
  ArrowRight,
  CheckCircle,
  AlertCircle,
  CreditCard,
  User,
  Building,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'
import {
  createStripeAccount,
  createStripeAccountLink,
} from '@/lib/actions/stripe-actions'

export default function OrganizationOnboarding() {
  const [accountCreatePending, setAccountCreatePending] = useState(false)
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectedAccountId, setConnectedAccountId] = useState(null)
  const [step, setStep] = useState(1)

  const createConnectAccount = async () => {
    setAccountCreatePending(true)
    setError(null)

    // const session = await auth();
    // console.log(session);

    try {
      const data = await createStripeAccount()

      console.log('API Response:', data)

      if (data.account) {
        setConnectedAccountId(data.account)
        setStep(2)
      } else if (data.error) {
        setError(data.error)
      }
    } catch (err: any) {
      console.error('API Error details:', err)
      setError(
        `Failed to create your account: ${err.message || 'Unknown error'}`,
      )
    } finally {
      setAccountCreatePending(false)
    }
  }

  const startOnboarding = async () => {
    if (!connectedAccountId) return

    setAccountLinkCreatePending(true)
    setError(null)

    try {
      const data = await createStripeAccountLink(connectedAccountId)

      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        throw Error('Stripe not found')
      }
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            LifePub
          </Link>
          <nav>
            <Link
              href="/help"
              className="text-sm text-gray-600 hover:text-primary"
            >
              Need help?
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700">
              Step {step} of 2:{' '}
              {step === 1 ? 'Create account' : 'Set up payments'}
            </div>
            <div className="text-sm text-gray-500">
              {step === 2 ? 'Almost there!' : 'Getting started'}
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-100 h-full rounded-full transition-all duration-500 ease-in-out"
              style={{ width: step === 1 ? '50%' : '100%' }}
            ></div>
          </div>
        </div>

        {/* Content area */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header area with illustration */}
          <div className="relative bg-primary-50 px-6 py-8 sm:px-10 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {!connectedAccountId
                    ? 'Become an Organizer on LifePub'
                    : 'Complete your payment setup'}
                </h1>
                <p className="text-gray-600 max-w-xl">
                  {!connectedAccountId
                    ? 'Start selling tickets to your events or listing your products. Set up your organizer account to receive payments directly to your bank account.'
                    : 'We partner with Stripe to securely process payments. Your information is encrypted and protected.'}
                </p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <DollarSign size={40} className="text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 sm:p-10">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Something went wrong</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Step 1: Create Account */}
            {!connectedAccountId && (
              <div>
                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">Create Profile</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Set up your organizer identity for events and listings
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">Connect Payments</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Securely link your bank account to receive payments
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <Building className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">Start Selling</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Create events, list products and start making money
                    </p>
                  </div>
                </div>

                <button
                  onClick={createConnectAccount}
                  disabled={accountCreatePending}
                  className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-50 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {accountCreatePending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Setting up your account...
                    </>
                  ) : (
                    <>
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Connect to Stripe */}
            {connectedAccountId && (
              <div>
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Account created successfully!</p>
                    <p className="text-sm">
                      Now let&apos;s set up your payment information with
                      Stripe.
                    </p>
                  </div>
                </div>

                <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <h3 className="font-medium mb-2">
                    What you&apos;ll need to provide:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>Basic personal information</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>
                        Your bank account details for receiving payments
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>
                        A valid government ID for identity verification
                      </span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={startOnboarding}
                  disabled={accountLinkCreatePending}
                  className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {accountLinkCreatePending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Preparing form...
                    </>
                  ) : (
                    <>
                      Continue to Stripe <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>

                {connectedAccountId && (
                  <div className="mt-4 text-xs text-gray-500">
                    Your account ID:{' '}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">
                      {connectedAccountId}
                    </code>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional information */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="px-6 py-5">
              <h2 className="text-lg font-medium">
                Frequently Asked Questions
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 divide-y divide-gray-200">
            <div className="py-4">
              <h3 className="text-sm font-medium text-gray-900">
                How long does verification take?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Verification is typically instant, but may take up to 24 hours
                in some cases.
              </p>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-medium text-gray-900">
                When will I receive my payments?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Payments are typically deposited within 2-7 business days after
                a successful transaction.
              </p>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-medium text-gray-900">
                Are there any fees?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                LifePub charges a 5% platform fee plus payment processing fees
                (2.9% + $0.30 per transaction).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>LifePub partners with Stripe for secure payment processing.</p>
            <p className="mt-2">
              <Link
                href="/terms"
                className="text-primary hover:text-primary-600 mr-4"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-primary hover:text-primary-600"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
