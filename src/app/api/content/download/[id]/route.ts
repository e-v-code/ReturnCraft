import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // URL 디코딩
    const fileId = decodeURIComponent(params.id);
    
    // Vercel Blob Storage에서 파일 목록 가져오기
    const { blobs } = await list();
    const blob = blobs.find(b => b.pathname === fileId);
    
    if (!blob) {
      return NextResponse.json(
        { error: '파일을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 파일 다운로드를 위한 응답 생성
    const response = await fetch(blob.url);
    if (!response.ok) {
      throw new Error('파일 데이터를 가져오는데 실패했습니다.');
    }
    
    const fileBlob = await response.blob();
    const headers = new Headers({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileId)}`,
      'Content-Length': blob.size.toString(),
    });

    return new NextResponse(fileBlob, { headers });

  } catch (error) {
    console.error('파일 다운로드 오류:', error);
    return NextResponse.json(
      { error: '파일 다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 