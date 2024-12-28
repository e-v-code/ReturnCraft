import { type NextAuthOptions as _NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from '@/db'
import { loginLogs } from '@/db/schema'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ _error }) {
      if (account?.provider === 'google') {
        try {
          // 로그인 로그 기록
          await db.insert(loginLogs).values({
            email: user.email!,
            userId: user.id
          });
        } catch (error) {
          console.error('로그인 로그 기록 실패:', error);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        // 사용자 정보를 세션에 추가
        const userInfo = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, session.user.email!)
        });
        
        if (userInfo) {
          session.user.name = userInfo.name;
          session.user.id = userInfo.id;
        }
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };

async function _refreshAccessToken(_token: any) {
  try {
    // ... 함수 내용 ...
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}