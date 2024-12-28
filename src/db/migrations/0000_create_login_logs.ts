import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const loginLogs = pgTable('login_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userEmail: text('user_email').notNull(),
  ipAddress: text('ip_address').notNull(),
  userAgent: text('user_agent').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}); 