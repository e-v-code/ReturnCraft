import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE() {
  let client;
  try {
    client = await db.connect();
    await client.sql`TRUNCATE TABLE editor_contents;`;
    
    return NextResponse.json({ 
      message: '모든 메시지가 삭제되었습니다.'
    });
  } catch (error: any) {
    console.error('전체 삭제 오류:', error);
    return NextResponse.json(
      { error: '삭제 중 오류가 발생했습니다: ' + (error?.message || '알 수 없는 오류') },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
} 