import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  gender: text('gender').notNull(),
  age: integer('age').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const loginLogs = pgTable('login_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  loginTime: timestamp('login_time').defaultNow(),
});

export const contents = pgTable('contents', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

// 타입 정의
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type LoginLog = typeof loginLogs.$inferSelect;
export type NewLoginLog = typeof loginLogs.$inferInsert;

export type Content = typeof contents.$inferSelect;
export type NewContent = typeof contents.$inferInsert;