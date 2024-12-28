import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, gender, age } = await request.json();

    // users 테이블에 데이터 삽입
    await sql`
      INSERT INTO users (name, gender, age)
      VALUES (${name}, ${gender}, ${age})
    `;

    return NextResponse.json({ message: '사용자가 성공적으로 등록되었습니다.' }, { status: 201 });
  } catch (error) {
    console.error('사용자 등록 중 오류:', error);
    return NextResponse.json(
      { error: '사용자 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 