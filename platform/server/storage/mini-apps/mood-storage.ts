/**
 * Mood Storage Module
 * 
 * Handles all Mood mini-app operations: mood checks and announcements.
 */

import {
  moodChecks,
  moodAnnouncements,
  type MoodCheck,
  type InsertMoodCheck,
  type MoodAnnouncement,
  type InsertMoodAnnouncement,
} from "@shared/schema";
import { db } from "../../db";
import { eq, and, desc, gte, lte, sql, or } from "drizzle-orm";

export class MoodStorage {
  // ========================================
  // MOOD CHECK OPERATIONS
  // ========================================

  async createMoodCheck(moodCheckData: InsertMoodCheck): Promise<MoodCheck> {
    // Convert Date to ISO date string for database
    const dataToInsert = {
      ...moodCheckData,
      date: moodCheckData.date instanceof Date 
        ? moodCheckData.date.toISOString().split('T')[0] 
        : moodCheckData.date,
    };
    const [moodCheck] = await db
      .insert(moodChecks)
      .values(dataToInsert as any)
      .returning();
    return moodCheck;
  }

  async getMoodChecksByClientId(clientId: string, days: number = 7): Promise<MoodCheck[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return await db
      .select()
      .from(moodChecks)
      .where(
        and(
          eq(moodChecks.clientId, clientId),
          gte(moodChecks.date, startDate.toISOString().split('T')[0])
        )
      )
      .orderBy(desc(moodChecks.createdAt));
  }

  async getMoodChecksByDateRange(startDate: Date, endDate: Date): Promise<MoodCheck[]> {
    return await db
      .select()
      .from(moodChecks)
      .where(
        and(
          gte(moodChecks.date, startDate.toISOString().split('T')[0]),
          lte(moodChecks.date, endDate.toISOString().split('T')[0])
        )
      );
  }

  // ========================================
  // MOOD ANNOUNCEMENT OPERATIONS
  // ========================================

  async createMoodAnnouncement(announcementData: InsertMoodAnnouncement): Promise<MoodAnnouncement> {
    const [announcement] = await db
      .insert(moodAnnouncements)
      .values(announcementData)
      .returning();
    return announcement;
  }

  async getActiveMoodAnnouncements(): Promise<MoodAnnouncement[]> {
    const now = new Date();
    return await db
      .select()
      .from(moodAnnouncements)
      .where(
        and(
          eq(moodAnnouncements.isActive, true),
          or(
            sql`${moodAnnouncements.expiresAt} IS NULL`,
            gte(moodAnnouncements.expiresAt, now)
          )
        )
      )
      .orderBy(desc(moodAnnouncements.createdAt));
  }

  async getAllMoodAnnouncements(): Promise<MoodAnnouncement[]> {
    return await db
      .select()
      .from(moodAnnouncements)
      .orderBy(desc(moodAnnouncements.createdAt));
  }

  async updateMoodAnnouncement(id: string, announcementData: Partial<InsertMoodAnnouncement>): Promise<MoodAnnouncement> {
    const [announcement] = await db
      .update(moodAnnouncements)
      .set({
        ...announcementData,
        updatedAt: new Date(),
      })
      .where(eq(moodAnnouncements.id, id))
      .returning();
    return announcement;
  }

  async deactivateMoodAnnouncement(id: string): Promise<MoodAnnouncement> {
    const [announcement] = await db
      .update(moodAnnouncements)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(moodAnnouncements.id, id))
      .returning();
    return announcement;
  }
}
