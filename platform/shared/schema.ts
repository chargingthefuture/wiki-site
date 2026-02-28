import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  numeric,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ========================================
// Common validation schemas for API endpoints
// ========================================

/**
 * UUID validation schema for route parameters
 * Validates that an ID is a non-empty string (UUID format)
 */
export const uuidParamSchema = z.string().min(1, "ID is required").uuid("ID must be a valid UUID");

/**
 * Generic ID parameter schema (for non-UUID IDs)
 */
export const idParamSchema = z.string().min(1, "ID is required").max(255, "ID is too long");

/**
 * Schema for user verification request body
 */
export const verifyUserSchema = z.object({
  isVerified: z.boolean({
    required_error: "isVerified is required",
    invalid_type_error: "isVerified must be a boolean",
  }),
});

/**
 * Schema for user approval request body
 */
export const approveUserSchema = z.object({
  isApproved: z.boolean({
    required_error: "isApproved is required",
    invalid_type_error: "isApproved must be a boolean",
  }),
});

// ========================================
// CORE SCHEMAS - Re-exported from modules
// ========================================

// Re-export from core modules
export {
  sessions,
  users,
  loginEvents,
  otpCodes,
  authTokens,
  usersRelations,
  type UpsertUser,
  type User,
  type OTPCode,
  type InsertOTPCode,
  type AuthToken,
  type InsertAuthToken,
} from "./schema/core/users";

export {
  pricingTiers,
  payments,
  paymentsRelations,
  insertPricingTierSchema,
  insertPaymentSchema,
  type InsertPricingTier,
  type PricingTier,
  type InsertPayment,
  type Payment,
} from "./schema/core/payments";

export {
  adminActionLogs,
  adminActionLogsRelations,
  insertAdminActionLogSchema,
  type InsertAdminActionLog,
  type AdminActionLog,
} from "./schema/core/admin";


// ========================================
// SUPPORTMATCH APP TABLES - Re-exported from module
// ========================================

export {
  supportMatchProfiles,
  supportMatchProfilesRelations,
  partnerships,
  partnershipsRelations,
  messages,
  messagesRelations,
  exclusions,
  exclusionsRelations,
  reports,
  reportsRelations,
  announcements,
  supportmatchAnnouncements,
  insertSupportMatchProfileSchema,
  insertPartnershipSchema,
  insertMessageSchema,
  insertExclusionSchema,
  insertReportSchema,
  insertAnnouncementSchema,
  insertSupportmatchAnnouncementSchema,
  type InsertSupportMatchProfile,
  type SupportMatchProfile,
  type InsertPartnership,
  type Partnership,
  type InsertMessage,
  type Message,
  type InsertExclusion,
  type Exclusion,
  type InsertReport,
  type Report,
  type InsertAnnouncement,
  type Announcement,
  type InsertSupportmatchAnnouncement,
  type SupportmatchAnnouncement,
} from "./schema/supportmatch";

// ========================================
// CHAT MESSAGES TABLES
// ========================================
export {
  chatMessages,
  insertChatMessageSchema,
  formatChatName,
  type InsertChatMessage,
  type ChatMessage,
} from "./schema/chat";

// ========================================
// LIGHTHOUSE APP TABLES - Re-exported from module
// ========================================

export {
  lighthouseProfiles,
  lighthouseProfilesRelations,
  lighthouseProperties,
  lighthousePropertiesRelations,
  lighthouseMatches,
  lighthouseMatchesRelations,
  lighthouseAnnouncements,
  lighthouseBlocks,
  lighthouseBlocksRelations,
  insertLighthouseProfileSchema,
  insertLighthousePropertySchema,
  insertLighthouseMatchSchema,
  insertLighthouseAnnouncementSchema,
  insertLighthouseBlockSchema,
  type InsertLighthouseProfile,
  type LighthouseProfile,
  type InsertLighthouseProperty,
  type LighthouseProperty,
  type InsertLighthouseMatch,
  type LighthouseMatch,
  type InsertLighthouseAnnouncement,
  type LighthouseAnnouncement,
  type InsertLighthouseBlock,
  type LighthouseBlock,
} from "./schema/lighthouse";

// ========================================
// SOCKETRELAY APP TABLES - Re-exported from module
// ========================================

export {
  socketrelayRequests,
  socketrelayRequestsRelations,
  socketrelayFulfillments,
  socketrelayFulfillmentsRelations,
  socketrelayMessages,
  socketrelayMessagesRelations,
  socketrelayProfiles,
  socketrelayProfilesRelations,
  socketrelayAnnouncements,
  insertSocketrelayRequestSchema,
  insertSocketrelayFulfillmentSchema,
  insertSocketrelayMessageSchema,
  insertSocketrelayProfileSchema,
  insertSocketrelayAnnouncementSchema,
  type InsertSocketrelayRequest,
  type SocketrelayRequest,
  type InsertSocketrelayFulfillment,
  type SocketrelayFulfillment,
  type InsertSocketrelayMessage,
  type SocketrelayMessage,
  type InsertSocketrelayProfile,
  type SocketrelayProfile,
  type InsertSocketrelayAnnouncement,
  type SocketrelayAnnouncement,
} from "./schema/socketrelay";

// ========================================
// DIRECTORY APP TABLES - Re-exported from module
// ========================================

export {
  directoryProfiles,
  directoryProfilesRelations,
  directoryAnnouncements,
  directorySkills,
  insertDirectoryProfileSchema,
  insertDirectoryAnnouncementSchema,
  insertDirectorySkillSchema,
  type InsertDirectoryProfile,
  type DirectoryProfile,
  type InsertDirectoryAnnouncement,
  type DirectoryAnnouncement,
  type InsertDirectorySkill,
  type DirectorySkill,
} from "./schema/directory";

// ========================================
// SKILLS MANAGEMENT TABLES - Re-exported from module
// ========================================

export {
  skillsSectors,
  skillsJobTitles,
  skillsSkills,
  insertSkillsSectorSchema,
  insertSkillsJobTitleSchema,
  insertSkillsSkillSchema,
  type InsertSkillsSector,
  type SkillsSector,
  type InsertSkillsJobTitle,
  type SkillsJobTitle,
  type InsertSkillsSkill,
  type SkillsSkill,
} from "./schema/skills";

// ========================================
// TRUSTTRANSPORT APP TABLES - Re-exported from module
// ========================================

export {
  trusttransportProfiles,
  trusttransportProfilesRelations,
  trusttransportRideRequests,
  trusttransportRideRequestsRelations,
  trusttransportAnnouncements,
  trusttransportBlocks,
  trusttransportBlocksRelations,
  insertTrusttransportProfileSchema,
  insertTrusttransportRideRequestSchema,
  insertTrusttransportAnnouncementSchema,
  insertTrusttransportBlockSchema,
  type InsertTrusttransportProfile,
  type TrusttransportProfile,
  type InsertTrusttransportRideRequest,
  type TrusttransportRideRequest,
  type InsertTrusttransportAnnouncement,
  type TrusttransportAnnouncement,
  type InsertTrusttransportBlock,
  type TrusttransportBlock,
} from "./schema/trusttransport";

// ========================================
// PROFILE DELETION LOG TABLE - Re-exported from module
// ========================================

export {
  profileDeletionLogs,
  profileDeletionLogsRelations,
  insertProfileDeletionLogSchema,
  type InsertProfileDeletionLog,
  type ProfileDeletionLog,
} from "./schema/core/profile-deletion";

// ========================================
// GENTLEPULSE APP TABLES - Re-exported from module
// ========================================

export {
  gentlepulseMeditations,
  gentlepulseRatings,
  gentlepulseFavorites,
  gentlepulseAnnouncements,
  insertGentlepulseMeditationSchema,
  insertGentlepulseRatingSchema,
  insertGentlepulseFavoriteSchema,
  insertGentlepulseAnnouncementSchema,
  type InsertGentlepulseMeditation,
  type GentlepulseMeditation,
  type InsertGentlepulseRating,
  type GentlepulseRating,
  type InsertGentlepulseFavorite,
  type GentlepulseFavorite,
  type InsertGentlepulseAnnouncement,
  type GentlepulseAnnouncement,
} from "./schema/gentlepulse";

// ========================================
// MOOD APP TABLES - Re-exported from module
// ========================================

export {
  moodChecks,
  moodAnnouncements,
  insertMoodCheckSchema,
  insertMoodAnnouncementSchema,
  type InsertMoodCheck,
  type MoodCheck,
  type InsertMoodAnnouncement,
  type MoodAnnouncement,
} from "./schema/mood";

// ========================================
// CHYME APP TABLES - Re-exported from module
// ========================================

export {
  chymeAnnouncements,
  chymeRooms,
  chymeRoomParticipants,
  chymeMessages,
  chymeUserFollows,
  chymeUserBlocks,
  insertChymeAnnouncementSchema,
  insertChymeRoomSchema,
  insertChymeRoomParticipantSchema,
  insertChymeMessageSchema,
  insertChymeUserFollowSchema,
  insertChymeUserBlockSchema,
  type InsertChymeAnnouncement,
  type ChymeAnnouncement,
  type InsertChymeRoom,
  type ChymeRoom,
  type InsertChymeRoomParticipant,
  type ChymeRoomParticipant,
  type InsertChymeMessage,
  type ChymeMessage,
  type InsertChymeUserFollow,
  type ChymeUserFollow,
  type InsertChymeUserBlock,
  type ChymeUserBlock,
} from "./schema/chyme";


// ========================================
// ========================================
// WORKFORCE RECRUITER TRACKER APP TABLES - Re-exported from module
// ========================================

export {
  workforceRecruiterProfiles,
  workforceRecruiterProfilesRelations,
  workforceRecruiterConfig,
  workforceRecruiterOccupations,
  workforceRecruiterAnnouncements,
  insertWorkforceRecruiterProfileSchema,
  insertWorkforceRecruiterConfigSchema,
  insertWorkforceRecruiterOccupationSchema,
  insertWorkforceRecruiterAnnouncementSchema,
  type InsertWorkforceRecruiterProfile,
  type WorkforceRecruiterProfile,
  type InsertWorkforceRecruiterConfig,
  type WorkforceRecruiterConfig,
  type InsertWorkforceRecruiterOccupation,
  type WorkforceRecruiterOccupation,
  type InsertWorkforceRecruiterAnnouncement,
  type WorkforceRecruiterAnnouncement,
} from "./schema/workforcerecruitertracker";


// ========================================
// ========================================
// DEFAULT ALIVE OR DEAD APP TABLES - Re-exported from module
// ========================================

export {
  defaultAliveOrDeadFinancialEntries,
  defaultAliveOrDeadFinancialEntriesRelations,
  defaultAliveOrDeadEbitdaSnapshots,
  insertDefaultAliveOrDeadFinancialEntrySchema,
  insertDefaultAliveOrDeadEbitdaSnapshotSchema,
  type InsertDefaultAliveOrDeadFinancialEntry,
  type DefaultAliveOrDeadFinancialEntry,
  type InsertDefaultAliveOrDeadEbitdaSnapshot,
  type DefaultAliveOrDeadEbitdaSnapshot,
} from "./schema/defaultaliveordead";
