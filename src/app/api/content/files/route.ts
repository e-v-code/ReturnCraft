import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
  try {
    const { blobs } = await list();
    return NextResponse.json({ 
      files: blobs.map(blob => ({
        id: blob.pathname,
        name: blob.pathname,
        uploadedAt: blob.uploadedAt
      }))
    });
  } catch (error) {
    console.error('파일 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '파일 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 