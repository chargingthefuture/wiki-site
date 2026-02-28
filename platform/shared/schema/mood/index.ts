/**
 * MOOD App Schema
 * 
 * Contains all database tables, relations, and Zod schemas for the MOOD mini-app.
 */

import { sql } from 'drizzle-orm';
import {
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Mood Checks (anonymous, using clientId)
export const moodChecks = pgTable("mood_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id", { length: 100 }).notNull(), // Random UUID from client
  moodValue: integer("mood_value").notNull(), // 1-5 (very sad to very happy)
  date: date("date").notNull(), // Date of mood check (ISO date)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMoodCheckSchema = createInsertSchema(moodChecks).omit({
  id: true,
  createdAt: true,
}).extend({
  moodValue: z.number().int().min(1).max(5),
  clientId: z.string().min(1),
  date: z.coerce.date(),
});

export type InsertMoodCheck = z.infer<typeof insertMoodCheckSchema>;
export type MoodCheck = typeof moodChecks.$inferSelect;

// Mood Announcements
export const moodAnnouncements = pgTable("mood_announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).notNull().default('info'),
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMoodAnnouncementSchema = createInsertSchema(moodAnnouncements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  expiresAt: z.coerce.date().optional().nullable(),
});

export type InsertMoodAnnouncement = z.infer<typeof insertMoodAnnouncementSchema>;
export type MoodAnnouncement = typeof moodAnnouncements.$inferSelect;
