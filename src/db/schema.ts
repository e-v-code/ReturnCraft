import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const loginLogs = pgTable('login_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  loginTime: timestamp('login_time').defaultNow(),
});

// 타입 정의
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type LoginLog = typeof loginLogs.$inferSelect;
export type NewLoginLog = typeof loginLogs.$inferInsert;