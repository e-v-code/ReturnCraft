import { NextResponse } from 'next/server';
import { head } from '@vercel/blob';

const BLOB_FILE_NAME = 'uploaded-file';

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