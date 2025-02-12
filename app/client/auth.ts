import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          
          // Make sure data.data exists and has the required fields
          if (!data?.data) {
            return null;
          }

          return {
            id: data.data._id || data.data.id || '', 
            email: data.data.email || '',
            name: data.data.fullName || '',
          } as User;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      
      const isLoggedIn = !!auth?.user

      const isAuthRoute = ['/sign-in', '/sign-up'].includes(pathname)
      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/', request.nextUrl))
        }
        return true
      }

      // Protected routes - if not logged in, redirect to sign-in
      if (!isLoggedIn) {
        return false // Will redirect to sign-in page
      }

      return true
    },

  }, 

  trustHost: true,
});