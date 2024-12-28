import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// UUID 확장 활성화
sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute;

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

export const loginLogs = pgTable('login_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  loginTime: timestamp('login_time').defaultNow()
})

export const schema = {
  // ... 스키마 정의
};