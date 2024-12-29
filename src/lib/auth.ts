import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (!user || user.length === 0) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user[0].password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: 1,
          email: user[0].email,
          name: user[0].name,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await db.select()
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1);

          if (!existingUser.length) {
            await db.insert(users).values({
              email: user.email!,
              name: user.name!,
              password: '',
              gender: 'UNKNOWN',
              age: 0,
              createdAt: new Date()
            });
          }
        } catch (error: any) {
          console.error("구글 로그인 에러:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token }) {
      if (token) {
        return {
          ...token,
          customField: 'value'
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
  },
  pages: {
    signIn: '/login',
  },
}; 