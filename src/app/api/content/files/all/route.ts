import { NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';

export async function DELETE() {
  try {
    const { blobs } = await list();
    await Promise.all(blobs.map(blob => del(blob.pathname)));
    
    return NextResponse.json({ 
      message: '모든 파일이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('전체 파일 삭제 오류:', error);
    return NextResponse.json(
      { error: '파일 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 