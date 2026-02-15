import { db } from '../../db';
import { moderationReports } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import type { InsertModerationReport, ModerationReport } from '@shared/schema';

export class ModerationStorage {
  async createModerationReport(reportData: InsertModerationReport): Promise<ModerationReport> {
    const [report] = await db.insert(moderationReports).values(reportData).returning();
    return report;
  }

  async getAllModerationReports(): Promise<ModerationReport[]> {
    return await db.select().from(moderationReports).orderBy(desc(moderationReports.createdAt));
  }

  async updateModerationReportStatus(id: string, status: string, resolution?: string): Promise<ModerationReport> {
    const [report] = await db.update(moderationReports).set({ status, resolution, updatedAt: new Date() }).where(eq(moderationReports.id, id)).returning();
    return report;
  }

  async getModerationPendingCount(): Promise<number> {
    const rows = await db.select().from(moderationReports).where(eq(moderationReports.status, 'pending'));
    return rows.length;
  }
}

export default ModerationStorage;
