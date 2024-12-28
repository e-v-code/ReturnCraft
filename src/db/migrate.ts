import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

// .env 파일 로드
dotenv.config();

// 데이터베이스 연결 설정을 로깅
console.log('Attempting to connect to:', process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true
    }
});

const db = drizzle(pool);

async function main() {
    console.log('Starting migration...');
    try {
        // UUID 확장 설치
        await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        
        await migrate(db, { migrationsFolder: 'drizzle' });
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});