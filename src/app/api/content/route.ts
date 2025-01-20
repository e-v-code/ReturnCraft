import { NextResponse } from 'next/server';
import { writeFile, readFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const FILE_NAME = 'code.txt';
const DIR_PATH = path.join(process.cwd(), 'public', 'contents');
const FILE_PATH = path.join(DIR_PATH, FILE_NAME);


// 파일 저장 (덮어쓰기)
export async function POST(request: Request) {
    try {
      const { content } = await request.json();
      
      // contents 디렉토리가 없으면 생성
      if (!existsSync(DIR_PATH)) {
        await mkdir(DIR_PATH, { recursive: true });
      }
      
      // 파일을 덮어씌움
      await writeFile(FILE_PATH, content, 'utf-8');
      return NextResponse.json({ message: '저장되었습니다.' });
    } catch (error) {
      console.error('파일 저장 오류:', error);
      return NextResponse.json(
        { error: '저장 중 오류가 발생했습니다.' }, 
        { status: 500 }
      );
    }
  }
  

// 파일 읽기
export async function GET() {
    try {
      // 디렉토리가 없으면 생성
      if (!existsSync(DIR_PATH)) {
        await mkdir(DIR_PATH, { recursive: true });
      }
  
      if (!existsSync(FILE_PATH)) {
        return NextResponse.json(
          { error: '저장된 내용이 없습니다.' },
          { status: 404 }
        );
      }
  
      const content = await readFile(FILE_PATH, 'utf-8');
      return NextResponse.json({ content });
    } catch (error) {
      console.error('파일 읽기 오류:', error);
      return NextResponse.json(
        { error: '불러오기 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  }

// 파일 삭제
export async function DELETE() {
    try {
      if (!existsSync(FILE_PATH)) {
        return NextResponse.json(
          { error: '삭제할 파일이 없습니다.' }, 
          { status: 404 }
        );
      }
      await unlink(FILE_PATH);
      return NextResponse.json({ message: '삭제되었습니다.' });
    } catch (error) {
      console.error('파일 삭제 오류:', error);
      return NextResponse.json(
        { error: '삭제 중 오류가 발생했습니다.' }, 
        { status: 500 }
      );
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