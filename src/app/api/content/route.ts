import { NextResponse } from 'next/server';
import { writeFile, readdir, readFile, unlink } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `content-${timestamp}.txt`;
    const filePath = path.join(process.cwd(), 'public', 'contents', fileName);
    await writeFile(filePath, content, 'utf-8');
    return NextResponse.json({ message: '저장되었습니다.', fileName }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const contentsDir = path.join(process.cwd(), 'public', 'contents');
    const files = await readdir(contentsDir);
    const lastFile = files[files.length - 1];
    if (!lastFile) {
      return NextResponse.json({ error: '저장된 내용이 없습니다.' }, { status: 404 });
    }
    const content = await readFile(path.join(contentsDir, lastFile), 'utf-8');
    return NextResponse.json({ content, fileName: lastFile });
  } catch (error) {
    return NextResponse.json({ error: '불러오기 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const contentsDir = path.join(process.cwd(), 'public', 'contents');
    const files = await readdir(contentsDir);
    const lastFile = files[files.length - 1];
    if (!lastFile) {
      return NextResponse.json({ error: '삭제할 파일이 없습니다.' }, { status: 404 });
    }
    await unlink(path.join(contentsDir, lastFile));
    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 원본 파일 이름 유지하면서 타임스탬프 추가
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${timestamp}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public', 'contents', fileName);

    await writeFile(filePath, buffer);
    
    // 텍스트 파일인 경우 내용 반환
    if (file.type === 'text/plain') {
      const content = buffer.toString('utf-8');
      return NextResponse.json({ 
        message: '파일이 업로드되었습니다.',
        fileName,
        content 
      });
    }

    return NextResponse.json({ 
      message: '파일이 업로드되었습니다.',
      fileName 
    });
  } catch (error) {
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 