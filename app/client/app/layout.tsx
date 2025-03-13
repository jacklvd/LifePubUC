import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import SessionTimeout from '@/components/timeout'

export const metadata: Metadata = {
  title: 'LifePub',
  description:
    'A place for student to understand more about their school life and collaborate with other student to deal with more sh*t',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={` antialiased`}>
          {children}
          <Toaster richColors />
          <SessionTimeout />
        </body>
      </SessionProvider>
    </html>
  )
}
export default RootLayout
