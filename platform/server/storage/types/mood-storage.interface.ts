/**
 * Mood Storage Interface
 * 
 * Defines Mood mini-app storage operations.
 */

import type {
  MoodCheck,
  InsertMoodCheck,
  MoodAnnouncement,
  InsertMoodAnnouncement,
} from "@shared/schema";

export interface IMoodStorage {
  // Mood Check operations
  createMoodCheck(moodCheck: InsertMoodCheck): Promise<MoodCheck>;
  getMoodChecksByClientId(clientId: string, days?: number): Promise<MoodCheck[]>;
  getMoodChecksByDateRange(startDate: Date, endDate: Date): Promise<MoodCheck[]>;

  // Announcement operations
  createMoodAnnouncement(announcement: InsertMoodAnnouncement): Promise<MoodAnnouncement>;
  getActiveMoodAnnouncements(): Promise<MoodAnnouncement[]>;
  getAllMoodAnnouncements(): Promise<MoodAnnouncement[]>;
  updateMoodAnnouncement(id: string, announcement: Partial<InsertMoodAnnouncement>): Promise<MoodAnnouncement>;
  deactivateMoodAnnouncement(id: string): Promise<MoodAnnouncement>;
}
