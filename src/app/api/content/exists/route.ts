import { NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';

const FILE_NAME = 'code.txt';
const DIR_PATH = path.join(process.cwd(), 'public', 'contents');
const FILE_PATH = path.join(DIR_PATH, FILE_NAME);

export async function GET() {
  return NextResponse.json({ exists: existsSync(FILE_PATH) });
} 