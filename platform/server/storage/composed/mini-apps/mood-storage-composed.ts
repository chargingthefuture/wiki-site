/**
 * Mood Storage Composed
 * 
 * Handles delegation of Mood storage operations.
 */

import type { IMoodStorage } from '../../types/mood-storage.interface';
import { MoodStorage } from '../../mini-apps';

export class MoodStorageComposed implements IMoodStorage {
  private moodStorage: MoodStorage;

  constructor() {
    this.moodStorage = new MoodStorage();
  }

  // Mood check operations
  async createMoodCheck(moodCheck: any) {
    return this.moodStorage.createMoodCheck(moodCheck);
  }

  async getMoodChecksByClientId(clientId: string, days?: number) {
    return this.moodStorage.getMoodChecksByClientId(clientId, days);
  }

  async getMoodChecksByDateRange(startDate: Date, endDate: Date) {
    return this.moodStorage.getMoodChecksByDateRange(startDate, endDate);
  }

  // Announcement operations
  async createMoodAnnouncement(announcement: any) {
    return this.moodStorage.createMoodAnnouncement(announcement);
  }

  async getActiveMoodAnnouncements() {
    return this.moodStorage.getActiveMoodAnnouncements();
  }

  async getAllMoodAnnouncements() {
    return this.moodStorage.getAllMoodAnnouncements();
  }

  async updateMoodAnnouncement(id: string, announcement: any) {
    return this.moodStorage.updateMoodAnnouncement(id, announcement);
  }

  async deactivateMoodAnnouncement(id: string) {
    return this.moodStorage.deactivateMoodAnnouncement(id);
  }
}
