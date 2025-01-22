import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await del(params.id);
    return NextResponse.json({ 
      message: '파일이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('파일 삭제 오류:', error);
    return NextResponse.json(
      { error: '파일 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 