import { NextResponse } from 'next/server';
import { del, head } from '@vercel/blob';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // URL 디코딩
    const decodedId = decodeURIComponent(params.id);
    
    // 파일 존재 여부 확인
    const blob = await head(decodedId);
    if (!blob) {
      return NextResponse.json(
        { error: '파일을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 파일 삭제
    await del(decodedId);
    
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