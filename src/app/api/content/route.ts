import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// 테이블 생성 함수
async function createTableIfNotExists() {
  try {
    const client = await db.connect();
    await client.sql`
      CREATE TABLE IF NOT EXISTS editor_contents (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    client.release();
    console.log('테이블 생성 완료 또는 이미 존재함');
  } catch (error) {
    console.error('테이블 생성 오류:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  let client;
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: '내용이 비어있습니다.' },
        { status: 400 }
      );
    }

    // 테이블이 없다면 생성
    await createTableIfNotExists();
    
    // 새로운 내용 저장
    client = await db.connect();
    const result = await client.sql`
      INSERT INTO editor_contents (message)
      VALUES (${content})
      RETURNING id;
    `;

    console.log('저장 완료:', result);

    return NextResponse.json({ 
      message: '저장되었습니다.',
      id: result.rows[0].id 
    });
  } catch (error: any) {
    console.error('저장 오류 상세:', error);
    return NextResponse.json(
      { error: '저장 중 오류가 발생했습니다: ' + (error?.message || '알 수 없는 오류') },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}

export async function GET() {
    let client;
    try {
      await createTableIfNotExists();
      
      client = await db.connect();
      const result = await client.sql`
        SELECT id, message, created_at
        FROM editor_contents
        ORDER BY created_at DESC;
      `;
  
      return NextResponse.json({ 
        contents: result.rows
      });
    } catch (error: any) {
      console.error('불러오기 오류 상세:', error);
      return NextResponse.json(
        { error: '불러오기 중 오류가 발생했습니다: ' + (error?.message || '알 수 없는 오류') },
        { status: 500 }
      );
    } finally {
      if (client) client.release();
    }
  }
  
  export async function DELETE(request: Request) {
    let client;
    try {
      const { id } = await request.json();
      
      client = await db.connect();
      await client.sql`
        DELETE FROM editor_contents
        WHERE id = ${id};
      `;
  
      return NextResponse.json({ 
        message: '삭제되었습니다.'
      });
    } catch (error: any) {
      console.error('삭제 오류 상세:', error);
      return NextResponse.json(
        { error: '삭제 중 오류가 발생했습니다: ' + (error?.message || '알 수 없는 오류') },
        { status: 500 }
      );
    } finally {
      if (client) client.release();
    }
  
}