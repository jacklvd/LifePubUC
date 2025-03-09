import React from 'react'
import Navbar from '@/components/navbar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { checkStripeOnboardingStatus } from '@/lib/actions/stripe-actions'

const LayoutPage = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  if (!session) redirect('/sign-in')

//   console.log('Hello world')
  // const { isOnboarded } = await checkStripeOnboardingStatus();

  // console.log(isOnboarded);
  // if (!isOnboarded) {
  //   redirect('/organization/onboarding')
  // }

  return (
    <div className="flex-col w-full min-h-full">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default LayoutPage
