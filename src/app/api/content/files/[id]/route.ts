import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  let client;
  try {
    client = await db.connect();
    
    // 파일 삭제
    await client.sql`
      DELETE FROM file_contents
      WHERE id = ${parseInt(params.id)};
    `;

    return NextResponse.json({ 
      message: '파일이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('파일 삭제 오류:', error);
    return NextResponse.json(
      { error: '파일 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
} 