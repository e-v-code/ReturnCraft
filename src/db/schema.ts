import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// UUID 확장 활성화
sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute;

// 개별 테이블 직접 export
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const loginLogs = pgTable('login_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  loginTime: timestamp('login_time').defaultNow(),
});