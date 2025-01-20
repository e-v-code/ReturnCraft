import { createPool } from '@vercel/postgres';

// 데이터베이스 연결 정보를 직접 객체로 전달
export const db = createPool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false // 개발 환경에서만 사용
  }
});

// 연결 테스트 함수
export async function testConnection() {
  const client = await db.connect();
  try {
    await client.sql`SELECT NOW();`;
    console.log('데이터베이스 연결 성공');
    return true;
  } catch (error) {
    console.error('데이터베이스 연결 오류:', error);
    return false;
  } finally {
    client.release();
  }
} 