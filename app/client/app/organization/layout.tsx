import { ReactNode } from 'react'
import Navbar from '@/components/navbar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import OrganizationSideBar from '@/app/organization/components/organization-sidebar'

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()

  if (!session) redirect('/sign-in')
  return (
    <div className="flex-col w-full min-h-full">
      <Navbar />
      <main>
        <div className="flex h-screen bg-white-100">
          <OrganizationSideBar />
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
