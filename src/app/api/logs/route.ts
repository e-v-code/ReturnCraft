import { NextResponse } from 'next/server'
import { db } from '@/db'
import { desc } from 'drizzle-orm'
import { loginLogs } from '@/db/schema'

export async function GET(_request: Request) {
  try {
    const logs = await db.select()
      .from(loginLogs)
      .orderBy(desc(loginLogs.loginTime));
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json({ success: true, data: body });
  } catch (_error) {
    console.error('Error in logs API:', _error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}