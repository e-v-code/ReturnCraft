import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let client;
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    client = await db.connect();
    
    // 바이너리 데이터를 저장하기 위한 테이블 생성
    await client.sql`
      CREATE TABLE IF NOT EXISTS file_contents (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        content BYTEA NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 파일 저장 - buffer를 문자열로 변환
    const result = await client.sql`
      INSERT INTO file_contents (filename, content)
      VALUES (${file.name}, ${buffer.toString('base64')})
      RETURNING id;
    `;

    return NextResponse.json({
      message: '파일이 업로드되었습니다.',
      id: result.rows[0].id
    });
  } catch (error: any) {
    console.error('파일 업로드 오류:', error);
    return NextResponse.json(
      { error: '업로드 중 오류가 발생했습니다: ' + (error?.message || '알 수 없는 오류') },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
} 