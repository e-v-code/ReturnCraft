import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

const handler = NextAuth(authOptions);

// Next.js 13+ App Router에서는 GET, POST 함수만 export
export const GET = handler;
export const POST = handler;