/**
 * WORKFORCE RECRUITER TRACKER App Schema
 * 
 * Contains all database tables, relations, and Zod schemas for the WORKFORCE RECRUITER TRACKER mini-app.
 */

import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  decimal,
  numeric,
  date,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "../core/users";
import { skillsJobTitles } from "../skills";

// Workforce Recruiter Tracker user profiles
export const workforceRecruiterProfiles = pgTable("workforce_recruiter_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id),
  isVerified: boolean("is_verified").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workforceRecruiterProfilesRelations = relations(workforceRecruiterProfiles, ({ one }) => ({
  user: one(users, {
    fields: [workforceRecruiterProfiles.userId],
    references: [users.id],
  }),
}));

export const insertWorkforceRecruiterProfileSchema = createInsertSchema(workforceRecruiterProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true, // Added by server from authenticated user
}).extend({
  // Keep userId optional for validation since the server injects it after auth
  userId: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export type InsertWorkforceRecruiterProfile = z.infer<typeof insertWorkforceRecruiterProfileSchema>;
export type WorkforceRecruiterProfile = typeof workforceRecruiterProfiles.$inferSelect;

// Workforce Recruiter Tracker configuration
export const workforceRecruiterConfig = pgTable("workforce_recruiter_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  population: integer("population").notNull().default(5000000),
  workforceParticipationRate: decimal("workforce_participation_rate", { precision: 5, scale: 4 }).notNull().default('0.5'),
  minRecruitable: integer("min_recruitable").notNull().default(2000000),
  maxRecruitable: integer("max_recruitable").notNull().default(5000000),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkforceRecruiterConfigSchema = createInsertSchema(workforceRecruiterConfig).omit({
  id: true,
  updatedAt: true,
}).extend({
  population: z.number().int().min(1),
  workforceParticipationRate: z.coerce.number().min(0).max(1),
  minRecruitable: z.number().int().min(0),
  maxRecruitable: z.number().int().min(0),
});

export type InsertWorkforceRecruiterConfig = z.infer<typeof insertWorkforceRecruiterConfigSchema>;
export type WorkforceRecruiterConfig = typeof workforceRecruiterConfig.$inferSelect;

// Occupations
export const workforceRecruiterOccupations = pgTable("workforce_recruiter_occupations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sector: varchar("sector", { length: 100 }).notNull(),
  occupationTitle: varchar("occupation_title", { length: 200 }).notNull(),
  jobTitleId: varchar("job_title_id").references(() => skillsJobTitles.id), // Links to skills database for skill matching
  headcountTarget: integer("headcount_target").notNull(),
  skillLevel: varchar("skill_level", { length: 20 }).notNull(), // 'Foundational', 'Intermediate', 'Advanced'
  annualTrainingTarget: integer("annual_training_target").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkforceRecruiterOccupationSchema = createInsertSchema(workforceRecruiterOccupations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  sector: z.string().min(1, "Sector is required").max(100),
  occupationTitle: z.string().min(1, "Occupation title is required").max(200),
  headcountTarget: z.number().int().min(0),
  skillLevel: z.enum(["Foundational", "Intermediate", "Advanced"]),
  annualTrainingTarget: z.number().int().min(0),
  notes: z.string().optional().nullable(),
});

export type InsertWorkforceRecruiterOccupation = z.infer<typeof insertWorkforceRecruiterOccupationSchema>;
export type WorkforceRecruiterOccupation = typeof workforceRecruiterOccupations.$inferSelect;

// Workforce Recruiter Tracker Announcements
export const workforceRecruiterAnnouncements = pgTable("workforce_recruiter_announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).notNull().default('info'), // info, warning, maintenance, update, promotion
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkforceRecruiterAnnouncementSchema = createInsertSchema(workforceRecruiterAnnouncements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  expiresAt: z.coerce.date().optional().nullable(),
});

export type InsertWorkforceRecruiterAnnouncement = z.infer<typeof insertWorkforceRecruiterAnnouncementSchema>;
export type WorkforceRecruiterAnnouncement = typeof workforceRecruiterAnnouncements.$inferSelect;

