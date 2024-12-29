import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { users } from "@/db/schema";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const foundUser = await db.select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1)
            .then(rows => rows[0]);

          if (!foundUser) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            foundUser.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: foundUser.id.toString(),
            email: foundUser.email,
          };
        } catch {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    }
  }
}; 