import { NextResponse } from 'next/server'
import { db } from '@/db'
import { loginLogs } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const logs = await db.query.loginLogs.findMany({
      orderBy: [desc(loginLogs.createdAt)]
    })
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Failed to fetch logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}

export async function POST(_request: Request) {
  try {
    // ... 함수 내용 ...
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}