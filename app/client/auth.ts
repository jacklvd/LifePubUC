/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import { API_BASE_URL } from './constants'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 4 * 60 * 60,
    updateAge: 60 * 30,
  },
  jwt: {
    maxAge: 4 * 60 * 60, // expires in 4 hour
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const {
            data: { data },
          } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          })

          if (!data.user) {
            return null
          }
          const user = data.user

          // Check if the user is verified
          if (!user.isVerified) {
            throw new Error('Email not verified. Please check your email.')
          }
          return {
            id: user._id || user.id || '',
            email: user.email || '',
            name: user.fullName || '',
            universityId: user.universityId,
          } as User
        } catch (error: any) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl

      if (pathname.includes('/verify-credential')) {
        return true
      }

      if (pathname.includes('/forgot-password') || pathname.includes('/reset-password')) {
        return true
      }

      const isLoggedIn = !!auth?.user
      const publicRoutes = ['/', '/sign-in', '/sign-up', '/forgot-password', '/reset-password']

      if (publicRoutes.includes(pathname)) {
        if (isLoggedIn && ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'].includes(pathname)) {
          return Response.redirect(new URL('/', request.nextUrl))
        }
        return true
      }

      if (!isLoggedIn) {
        return false
      }

      return true
    },
  },
  trustHost: true,
})
