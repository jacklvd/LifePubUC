import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

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

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          )

          if (!response.ok) {
            return null
          }

          const res = await response.json()

          if (!res?.data) {
            return null
          }

          if (!res.data.user.isVerified) {
            throw new Error('Email not verified. Please check your email.')
          }

          const { data } = res
          // console.log(data);

          return {
            id: data.user._id || data.user.id || '',
            email: data.user.email || '',
            name: data.user.fullName || '',
            universityId: data.user.universityId,
          } as User
        } catch (error) {
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
