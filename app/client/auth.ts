import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import UserModel from "@/databases/schemas";  // Use default export

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await connectToDatabase();  // Ensure database is connected

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find the user by email
        const user = await UserModel.findOne({ email: credentials.email.toString() });

        if (!user) return null;

        // Verify the user's password
        const isPasswordValid = await compare(credentials.password.toString(), user.password);
        if (!isPasswordValid) return null;

        // Return the user details for the JWT
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.fullName,
        } as User;
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
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
});
