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
          src="https://img.freepik.com/free-vector/school-supplies-abstract-concept-vector-illustration-back-school-shopping-list-online-wholesale-kids-stationery-verified-supplier-materials-buy-classroom-equipment-abstract-metaphor_335657-5882.jpg"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
    </main>
  )
}

export default Layout
