import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  let client;
  try {
    client = await db.connect();
    const result = await client.sql`
      SELECT id, filename, created_at
      FROM file_contents
      ORDER BY created_at DESC;
    `;

    return NextResponse.json({ 
      files: result.rows.map(row => ({
        id: row.id,
        name: row.filename,
        uploadedAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('파일 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '파일 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
} 