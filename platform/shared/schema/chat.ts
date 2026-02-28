import { sql } from 'drizzle-orm';
import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const chatMessages = pgTable('chat_messages', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  channelId: varchar('channel_id').notNull().default('community-support'),
  userId: varchar('user_id').notNull(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  userImage: text('user_image'),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertChatMessageSchema = z.object({
  channelId: z.string().optional(),
  userId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  userImage: z.string().optional(),
  text: z.string().min(1),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Helper to format name for display (e.g., "John D")
export function formatChatName(firstName?: string | null, lastName?: string | null): string {
  if (!firstName) return 'Anonymous';
  if (lastName) {
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstName} ${lastInitial}`;
  }
  return firstName;
}
