import { sql } from '@vercel/postgres';

export async function createUsersTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        image VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Users 테이블이 생성되었습니다');
  } catch (error) {
    console.error('Users 테이블 생성 중 오류:', error);
    throw error;
  }
}

export async function saveUser(email: string, name: string | null, image: string | null) {
  try {
    await sql`
      INSERT INTO users (email, name, image)
      VALUES (${email}, ${name}, ${image})
      ON CONFLICT (email) 
      DO UPDATE SET
        name = EXCLUDED.name,
        image = EXCLUDED.image;
    `;
    console.log('사용자 정보가 저장되었습니다');
  } catch (error) {
    console.error('사용자 정보 저장 중 오류:', error);
    throw error;
  }
} 