import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  let client;
  try {
    client = await db.connect();
    const result = await client.sql`
      SELECT filename, content
      FROM file_contents
      WHERE id = ${parseInt(params.id)};
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '파일을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const file = result.rows[0];
    const buffer = Buffer.from(file.content);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('파일 다운로드 오류:', error);
    return NextResponse.json(
      { error: '파일 다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
} 