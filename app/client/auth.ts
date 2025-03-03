import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import { API_BASE_URL } from './constants'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          })

          if (!data?.data) {
            return null
          }

          // Check if the user is verified
          if (!data.data.user.isVerified) {
            throw new Error('Email not verified. Please check your email.')
          }

          return {
            id: data.data._id || data.data.id || '',
            email: data.data.email || '',
            name: data.data.fullName || '',
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

      const isLoggedIn = !!auth?.user
      const publicRoutes = ['/', '/sign-in', '/sign-up']

      if (publicRoutes.includes(pathname)) {
        if (isLoggedIn && ['/sign-in', '/sign-up'].includes(pathname)) {
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
