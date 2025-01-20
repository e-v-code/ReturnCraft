import { NextResponse } from 'next/server';
import { put, del, head } from '@vercel/blob';

const BLOB_FILE_NAME = 'uploaded-file';

// 파일 업로드
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 기존 파일 삭제
    const existingFileResponse = await fetch(
      `${process.env.VERCEL_URL}/api/upload/exists`
    );
    if (existingFileResponse.ok) {
      const existingFileData = await existingFileResponse.json();
      if (existingFileData.fileUrl) {
        await del(existingFileData.fileUrl);
      }
    }

    const blob = await put(BLOB_FILE_NAME, file, {
      access: 'public',
    });

    return NextResponse.json({
      message: '파일이 업로드되었습니다.',
      fileUrl: blob.url,
      fileName: file.name,
    });
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 현재 업로드된 파일 확인
export async function GET() {
  try {
    const blob = await head(BLOB_FILE_NAME);
    if (blob) {
      return NextResponse.json({ fileUrl: blob.url, fileName: blob.pathname });
    }
    return NextResponse.json({ fileUrl: null, fileName: null });
  } catch (error) {
    return NextResponse.json({ fileUrl: null, fileName: null });
  }
}

// 파일 삭제
export async function DELETE() {
  try {
    const existingFileResponse = await fetch(
      `${process.env.VERCEL_URL}/api/upload/exists`
    );
    if (existingFileResponse.ok) {
      const existingFileData = await existingFileResponse.json();
      if (existingFileData.fileUrl) {
        await del(existingFileData.fileUrl);
        return NextResponse.json({ message: '파일이 삭제되었습니다.' });
      }
    }
    return NextResponse.json({ message: '삭제할 파일이 없습니다.' });
  } catch (error) {
    console.error('파일 삭제 오류:', error);
    return NextResponse.json(
      { error: '파일 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 