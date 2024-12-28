import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// UUID 확장 활성화
sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute;

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  gender: varchar('gender', { length: 10 }).notNull(),
  age: integer('age').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

export const loginLogs = pgTable('login_logs', {
  id: serial('id').primaryKey(),
  userEmail: text('user_email').notNull(),
  ipAddress: text('ip_address').notNull(),
  userAgent: text('user_agent').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})