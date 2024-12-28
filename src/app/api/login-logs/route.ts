import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, loginTime } = await request.json();

    // login_logs 테이블에 데이터 삽입
    await sql`
      INSERT INTO login_logs (user_id, login_time)
      VALUES (${userId}, ${loginTime})
    `;

    return NextResponse.json({ message: '로그인 기록이 저장되었습니다.' }, { status: 201 });
  } catch (error) {
    console.error('로그인 기록 저장 중 오류:', error);
    return NextResponse.json(
      { error: '로그인 기록 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 