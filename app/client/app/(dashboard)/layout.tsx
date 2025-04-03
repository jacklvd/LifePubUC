import React from 'react'
import Navbar from '@/components/navbar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Footer from '@/components/ui/footer'

const LayoutPage = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  // console.log(session)
  if (!session) redirect('/sign-in')

  return (
    <div className="flex-col w-full min-h-full">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default LayoutPage
