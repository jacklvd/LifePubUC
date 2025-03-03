import { ReactNode } from 'react'
import Image from 'next/image'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()

  if (session) redirect('/')

  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-3">
            <h1 className="text-2xl font-semibold text-white">LIFEPUB</h1>
          </div>

          <div>{children}</div>
        </div>
      </section>

      <section className="auth-illustration">
        <Image
          src="https://littletonpublicschools.net/sites/default/files/styles/default/public/Emily%20Foster%20Painting%202010.jpg?itok=_jZCs1rP"
          alt="Illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
    </main>
  )
}

export default Layout
