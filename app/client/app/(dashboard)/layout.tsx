import React from 'react'
import Navbar from '@/components/navbar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const LayoutPage = async ({ children }: { children: React.ReactNode }) => {
<<<<<<< HEAD
  // const session = await auth();

  // if (!session) redirect("/sign-in");
=======
  const session = await auth()

  if (!session) redirect('/sign-in')
>>>>>>> master

  return (
    <div className="flex-col w-full min-h-full">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default LayoutPage
