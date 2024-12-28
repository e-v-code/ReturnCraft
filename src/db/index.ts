import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

console.log('Database URL:', process.env.DATABASE_URL); // 디버깅용 로그

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true
  },
  timezone: 'Asia/Seoul'
})

export const db = drizzle(pool)