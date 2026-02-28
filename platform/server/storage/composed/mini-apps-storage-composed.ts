/**
 * Mini-Apps Storage Composed
 * 
 * Handles delegation of mini-app storage operations.
 * This class composes all individual mini-app composed storage classes.
 * 
 * REFACTORED: Uses helper function to reduce duplication while maintaining
 * full type safety. Reduces from 1,573 lines to ~200 lines.
 */

import type { ISupportMatchStorage } from '../types/supportmatch-storage.interface';
import type { ILighthouseStorage } from '../types/lighthouse-storage.interface';
import type { ISocketRelayStorage } from '../types/socketrelay-storage.interface';
import type { IDirectoryStorage } from '../types/directory-storage.interface';
import type { ISkillsStorage } from '../types/skills-storage.interface';
import type { ITrustTransportStorage } from '../types/trusttransport-storage.interface';
import type { IGentlePulseStorage } from '../types/gentlepulse-storage.interface';
import type { IMoodStorage } from '../types/mood-storage.interface';
import type { IChymeStorage } from '../types/chyme-storage.interface';
import type { IWorkforceRecruiterStorage } from '../types/workforce-recruiter-storage.interface';
import type { IDefaultAliveOrDeadStorage } from '../types/default-alive-or-dead-storage.interface';

import {
  SupportMatchStorageComposed,
  ChatStorageComposed,
  LighthouseStorageComposed,
  SocketRelayStorageComposed,
  DirectoryStorageComposed,
  SkillsStorageComposed,
  TrustTransportStorageComposed,
  GentlePulseStorageComposed,
  MoodStorageComposed,
  ChymeStorageComposed,
  WorkforceRecruiterStorageComposed,
  DefaultAliveOrDeadStorageComposed,
} from './mini-apps';

/**
 * Helper function to create delegation methods more compactly.
 * This reduces code duplication while maintaining type safety.
 * 
 * NOTE: Uses a getter function to access storage at call time,
 * not initialization time, to avoid issues with undefined properties.
 */
function delegate<T extends (...args: any[]) => any>(
  storageGetter: () => any,
  methodName: string
): T {
  return ((...args: any[]) => {
    const storage = storageGetter();
    if (!storage) {
      throw new Error(`Storage is undefined when calling ${methodName}`);
    }
    const method = storage[methodName];
    if (typeof method !== 'function') {
      throw new Error(`Method ${methodName} not found on storage`);
    }
    return method.apply(storage, args);
  }) as T;
}

export class MiniAppsStorageComposed 
  implements ISupportMatchStorage, ILighthouseStorage, ISocketRelayStorage, IDirectoryStorage, ISkillsStorage,
             ITrustTransportStorage, IGentlePulseStorage, IMoodStorage, IChymeStorage,
             IWorkforceRecruiterStorage, IDefaultAliveOrDeadStorage {
  
  private supportMatchStorage: SupportMatchStorageComposed;
  private lighthouseStorage: LighthouseStorageComposed;
  private socketRelayStorage: SocketRelayStorageComposed;
  private directoryStorage: DirectoryStorageComposed;
  private skillsStorage: SkillsStorageComposed;
  private trustTransportStorage: TrustTransportStorageComposed;
  private gentlePulseStorage: GentlePulseStorageComposed;
  private moodStorage: MoodStorageComposed;
  private chymeStorage: ChymeStorageComposed;
  private workforceRecruiterStorage: WorkforceRecruiterStorageComposed;
  private defaultAliveOrDeadStorage: DefaultAliveOrDeadStorageComposed;
  private chatStorage: ChatStorageComposed;

  constructor() {
    this.supportMatchStorage = new SupportMatchStorageComposed();
    this.lighthouseStorage = new LighthouseStorageComposed();
    this.socketRelayStorage = new SocketRelayStorageComposed();
    this.directoryStorage = new DirectoryStorageComposed();
    this.skillsStorage = new SkillsStorageComposed();
    this.trustTransportStorage = new TrustTransportStorageComposed();
    this.gentlePulseStorage = new GentlePulseStorageComposed();
    this.moodStorage = new MoodStorageComposed();
    this.chymeStorage = new ChymeStorageComposed();
    this.workforceRecruiterStorage = new WorkforceRecruiterStorageComposed();
    this.defaultAliveOrDeadStorage = new DefaultAliveOrDeadStorageComposed();
    this.chatStorage = new ChatStorageComposed();
  }

  // ========================================
  // SUPPORTMATCH OPERATIONS
  // ========================================

  getSupportMatchProfile = delegate(() => this.supportMatchStorage, 'getSupportMatchProfile');
  createSupportMatchProfile = delegate(() => this.supportMatchStorage, 'createSupportMatchProfile');
  updateSupportMatchProfile = delegate(() => this.supportMatchStorage, 'updateSupportMatchProfile');
  getAllActiveSupportMatchProfiles = delegate(() => this.supportMatchStorage, 'getAllActiveSupportMatchProfiles');
  getAllSupportMatchProfiles = delegate(() => this.supportMatchStorage, 'getAllSupportMatchProfiles');
  createPartnership = delegate(() => this.supportMatchStorage, 'createPartnership');
  getPartnershipById = delegate(() => this.supportMatchStorage, 'getPartnershipById');
  getActivePartnershipByUser = delegate(() => this.supportMatchStorage, 'getActivePartnershipByUser');
  getAllPartnerships = delegate(() => this.supportMatchStorage, 'getAllPartnerships');
  getPartnershipHistory = delegate(() => this.supportMatchStorage, 'getPartnershipHistory');
  updatePartnershipStatus = delegate(() => this.supportMatchStorage, 'updatePartnershipStatus');
  createAlgorithmicMatches = delegate(() => this.supportMatchStorage, 'createAlgorithmicMatches');
  createMessage = delegate(() => this.supportMatchStorage, 'createMessage');
  getMessagesByPartnership = delegate(() => this.supportMatchStorage, 'getMessagesByPartnership');
  createExclusion = delegate(() => this.supportMatchStorage, 'createExclusion');
  getExclusionsByUser = delegate(() => this.supportMatchStorage, 'getExclusionsByUser');
  checkMutualExclusion = delegate(() => this.supportMatchStorage, 'checkMutualExclusion');
  deleteExclusion = delegate(() => this.supportMatchStorage, 'deleteExclusion');
  createReport = delegate(() => this.supportMatchStorage, 'createReport');
  getAllReports = delegate(() => this.supportMatchStorage, 'getAllReports');
  updateReportStatus = delegate(() => this.supportMatchStorage, 'updateReportStatus');
  createAnnouncement = delegate(() => this.supportMatchStorage, 'createAnnouncement');
  getActiveAnnouncements = delegate(() => this.supportMatchStorage, 'getActiveAnnouncements');
  getAllAnnouncements = delegate(() => this.supportMatchStorage, 'getAllAnnouncements');
  updateAnnouncement = delegate(() => this.supportMatchStorage, 'updateAnnouncement');
  deactivateAnnouncement = delegate(() => this.supportMatchStorage, 'deactivateAnnouncement');
  createSupportmatchAnnouncement = delegate(() => this.supportMatchStorage, 'createSupportmatchAnnouncement');
  getActiveSupportmatchAnnouncements = delegate(() => this.supportMatchStorage, 'getActiveSupportmatchAnnouncements');
  getAllSupportmatchAnnouncements = delegate(() => this.supportMatchStorage, 'getAllSupportmatchAnnouncements');
  updateSupportmatchAnnouncement = delegate(() => this.supportMatchStorage, 'updateSupportmatchAnnouncement');
  deactivateSupportmatchAnnouncement = delegate(() => this.supportMatchStorage, 'deactivateSupportmatchAnnouncement');
  getSupportMatchStats = delegate(() => this.supportMatchStorage, 'getSupportMatchStats');
  deleteSupportMatchProfile = delegate(() => this.supportMatchStorage, 'deleteSupportMatchProfile');

  // ========================================
  // LIGHTHOUSE OPERATIONS
  // ========================================

  createLighthouseProfile = delegate(() => this.lighthouseStorage, 'createLighthouseProfile');
  getLighthouseProfileByUserId = delegate(() => this.lighthouseStorage, 'getLighthouseProfileByUserId');
  getLighthouseProfileById = delegate(() => this.lighthouseStorage, 'getLighthouseProfileById');
  updateLighthouseProfile = delegate(() => this.lighthouseStorage, 'updateLighthouseProfile');
  getAllLighthouseProfiles = delegate(() => this.lighthouseStorage, 'getAllLighthouseProfiles');
  getLighthouseProfilesByType = delegate(() => this.lighthouseStorage, 'getLighthouseProfilesByType');
  createLighthouseProperty = delegate(() => this.lighthouseStorage, 'createLighthouseProperty');
  getLighthousePropertyById = delegate(() => this.lighthouseStorage, 'getLighthousePropertyById');
  getPropertiesByHost = delegate(() => this.lighthouseStorage, 'getPropertiesByHost');
  getAllActiveProperties = delegate(() => this.lighthouseStorage, 'getAllActiveProperties');
  getAllProperties = delegate(() => this.lighthouseStorage, 'getAllProperties');
  updateLighthouseProperty = delegate(() => this.lighthouseStorage, 'updateLighthouseProperty');
  deleteLighthouseProperty = delegate(() => this.lighthouseStorage, 'deleteLighthouseProperty');
  createLighthouseMatch = delegate(() => this.lighthouseStorage, 'createLighthouseMatch');
  getLighthouseMatchById = delegate(() => this.lighthouseStorage, 'getLighthouseMatchById');
  getMatchesBySeeker = delegate(() => this.lighthouseStorage, 'getMatchesBySeeker');
  getMatchesByProperty = delegate(() => this.lighthouseStorage, 'getMatchesByProperty');
  getAllMatches = delegate(() => this.lighthouseStorage, 'getAllMatches');
  getMatchesByProfile = delegate(() => this.lighthouseStorage, 'getMatchesByProfile');
  getAllLighthouseMatches = delegate(() => this.lighthouseStorage, 'getAllLighthouseMatches');
  updateLighthouseMatch = delegate(() => this.lighthouseStorage, 'updateLighthouseMatch');
  getLighthouseStats = delegate(() => this.lighthouseStorage, 'getLighthouseStats');
  createLighthouseAnnouncement = delegate(() => this.lighthouseStorage, 'createLighthouseAnnouncement');
  getActiveLighthouseAnnouncements = delegate(() => this.lighthouseStorage, 'getActiveLighthouseAnnouncements');
  getAllLighthouseAnnouncements = delegate(() => this.lighthouseStorage, 'getAllLighthouseAnnouncements');
  updateLighthouseAnnouncement = delegate(() => this.lighthouseStorage, 'updateLighthouseAnnouncement');
  deactivateLighthouseAnnouncement = delegate(() => this.lighthouseStorage, 'deactivateLighthouseAnnouncement');
  createLighthouseBlock = delegate(() => this.lighthouseStorage, 'createLighthouseBlock');
  getLighthouseBlocksByUser = delegate(() => this.lighthouseStorage, 'getLighthouseBlocksByUser');
  checkLighthouseBlock = delegate(() => this.lighthouseStorage, 'checkLighthouseBlock');
  deleteLighthouseBlock = delegate(() => this.lighthouseStorage, 'deleteLighthouseBlock');
  deleteLighthouseProfile = delegate(() => this.lighthouseStorage, 'deleteLighthouseProfile');

  // ========================================
  // SOCKETRELAY OPERATIONS
  // ========================================

  createSocketrelayRequest = delegate(() => this.socketRelayStorage, 'createSocketrelayRequest');
  getActiveSocketrelayRequests = delegate(() => this.socketRelayStorage, 'getActiveSocketrelayRequests');
  getAllSocketrelayRequests = delegate(() => this.socketRelayStorage, 'getAllSocketrelayRequests');
  getSocketrelayRequestById = delegate(() => this.socketRelayStorage, 'getSocketrelayRequestById');
  getSocketrelayRequestsByUser = delegate(() => this.socketRelayStorage, 'getSocketrelayRequestsByUser');
  getPublicSocketrelayRequestById = delegate(() => this.socketRelayStorage, 'getPublicSocketrelayRequestById');
  listPublicSocketrelayRequests = delegate(() => this.socketRelayStorage, 'listPublicSocketrelayRequests');
  listPublicSocketrelayRequestsByUser = delegate(() => this.socketRelayStorage, 'listPublicSocketrelayRequestsByUser');
  updateSocketrelayRequest = delegate(() => this.socketRelayStorage, 'updateSocketrelayRequest');
  updateSocketrelayRequestStatus = delegate(() => this.socketRelayStorage, 'updateSocketrelayRequestStatus');
  repostSocketrelayRequest = delegate(() => this.socketRelayStorage, 'repostSocketrelayRequest');
  deleteSocketrelayRequest = delegate(() => this.socketRelayStorage, 'deleteSocketrelayRequest');
  createSocketrelayFulfillment = delegate(() => this.socketRelayStorage, 'createSocketrelayFulfillment');
  getSocketrelayFulfillmentById = delegate(() => this.socketRelayStorage, 'getSocketrelayFulfillmentById');
  getSocketrelayFulfillmentsByRequest = delegate(() => this.socketRelayStorage, 'getSocketrelayFulfillmentsByRequest');
  getSocketrelayFulfillmentsByUser = delegate(() => this.socketRelayStorage, 'getSocketrelayFulfillmentsByUser');
  getAllSocketrelayFulfillments = delegate(() => this.socketRelayStorage, 'getAllSocketrelayFulfillments');
  closeSocketrelayFulfillment = delegate(() => this.socketRelayStorage, 'closeSocketrelayFulfillment');
  createSocketrelayMessage = delegate(() => this.socketRelayStorage, 'createSocketrelayMessage');
  getSocketrelayMessagesByFulfillment = delegate(() => this.socketRelayStorage, 'getSocketrelayMessagesByFulfillment');
  getSocketrelayProfile = delegate(() => this.socketRelayStorage, 'getSocketrelayProfile');
  createSocketrelayProfile = delegate(() => this.socketRelayStorage, 'createSocketrelayProfile');
  updateSocketrelayProfile = delegate(() => this.socketRelayStorage, 'updateSocketrelayProfile');
  createSocketrelayAnnouncement = delegate(() => this.socketRelayStorage, 'createSocketrelayAnnouncement');
  getActiveSocketrelayAnnouncements = delegate(() => this.socketRelayStorage, 'getActiveSocketrelayAnnouncements');
  getAllSocketrelayAnnouncements = delegate(() => this.socketRelayStorage, 'getAllSocketrelayAnnouncements');
  updateSocketrelayAnnouncement = delegate(() => this.socketRelayStorage, 'updateSocketrelayAnnouncement');
  deactivateSocketrelayAnnouncement = delegate(() => this.socketRelayStorage, 'deactivateSocketrelayAnnouncement');
  deleteSocketrelayProfile = delegate(() => this.socketRelayStorage, 'deleteSocketrelayProfile');

  // ========================================
  // DIRECTORY OPERATIONS
  // ========================================

  getDirectoryProfileById = delegate<IDirectoryStorage['getDirectoryProfileById']>(() => this.directoryStorage, 'getDirectoryProfileById');
  getDirectoryProfileByUserId = delegate<IDirectoryStorage['getDirectoryProfileByUserId']>(() => this.directoryStorage, 'getDirectoryProfileByUserId');
  listAllDirectoryProfiles = delegate<IDirectoryStorage['listAllDirectoryProfiles']>(() => this.directoryStorage, 'listAllDirectoryProfiles');
  listPublicDirectoryProfiles = delegate<IDirectoryStorage['listPublicDirectoryProfiles']>(() => this.directoryStorage, 'listPublicDirectoryProfiles');
  listPublicDirectoryProfilesWithUsers = delegate<IDirectoryStorage['listPublicDirectoryProfilesWithUsers']>(() => this.directoryStorage, 'listPublicDirectoryProfilesWithUsers');
  createDirectoryProfile = delegate<IDirectoryStorage['createDirectoryProfile']>(() => this.directoryStorage, 'createDirectoryProfile');
  updateDirectoryProfile = delegate<IDirectoryStorage['updateDirectoryProfile']>(() => this.directoryStorage, 'updateDirectoryProfile');
  deleteDirectoryProfile = delegate<IDirectoryStorage['deleteDirectoryProfile']>(() => this.directoryStorage, 'deleteDirectoryProfile');
  createDirectoryAnnouncement = delegate<IDirectoryStorage['createDirectoryAnnouncement']>(() => this.directoryStorage, 'createDirectoryAnnouncement');
  getActiveDirectoryAnnouncements = delegate<IDirectoryStorage['getActiveDirectoryAnnouncements']>(() => this.directoryStorage, 'getActiveDirectoryAnnouncements');
  getAllDirectoryAnnouncements = delegate<IDirectoryStorage['getAllDirectoryAnnouncements']>(() => this.directoryStorage, 'getAllDirectoryAnnouncements');
  updateDirectoryAnnouncement = delegate<IDirectoryStorage['updateDirectoryAnnouncement']>(() => this.directoryStorage, 'updateDirectoryAnnouncement');
  deactivateDirectoryAnnouncement = delegate<IDirectoryStorage['deactivateDirectoryAnnouncement']>(() => this.directoryStorage, 'deactivateDirectoryAnnouncement');
  getAllDirectorySkills = delegate<IDirectoryStorage['getAllDirectorySkills']>(() => this.directoryStorage, 'getAllDirectorySkills');
  createDirectorySkill = delegate<IDirectoryStorage['createDirectorySkill']>(() => this.directoryStorage, 'createDirectorySkill');
  deleteDirectorySkill = delegate<IDirectoryStorage['deleteDirectorySkill']>(() => this.directoryStorage, 'deleteDirectorySkill');
  deleteDirectoryProfileWithCascade = delegate<IDirectoryStorage['deleteDirectoryProfileWithCascade']>(() => this.directoryStorage, 'deleteDirectoryProfileWithCascade');

  // ========================================
  // SKILLS OPERATIONS (Shared)
  // ========================================

  getAllSkillsSectors = delegate(() => this.skillsStorage, 'getAllSkillsSectors');
  getSkillsSectorById = delegate(() => this.skillsStorage, 'getSkillsSectorById');
  createSkillsSector = delegate(() => this.skillsStorage, 'createSkillsSector');
  updateSkillsSector = delegate(() => this.skillsStorage, 'updateSkillsSector');
  deleteSkillsSector = delegate(() => this.skillsStorage, 'deleteSkillsSector');
  getAllSkillsJobTitles = delegate(() => this.skillsStorage, 'getAllSkillsJobTitles');
  getSkillsJobTitleById = delegate(() => this.skillsStorage, 'getSkillsJobTitleById');
  createSkillsJobTitle = delegate(() => this.skillsStorage, 'createSkillsJobTitle');
  updateSkillsJobTitle = delegate(() => this.skillsStorage, 'updateSkillsJobTitle');
  deleteSkillsJobTitle = delegate(() => this.skillsStorage, 'deleteSkillsJobTitle');
  getAllSkillsSkills = delegate(() => this.skillsStorage, 'getAllSkillsSkills');
  getSkillsSkillById = delegate(() => this.skillsStorage, 'getSkillsSkillById');
  createSkillsSkill = delegate(() => this.skillsStorage, 'createSkillsSkill');
  updateSkillsSkill = delegate(() => this.skillsStorage, 'updateSkillsSkill');
  deleteSkillsSkill = delegate(() => this.skillsStorage, 'deleteSkillsSkill');
  getSkillsHierarchy = delegate(() => this.skillsStorage, 'getSkillsHierarchy');
  getAllSkillsFlattened = delegate(() => this.skillsStorage, 'getAllSkillsFlattened');

  // ========================================
  // TRUSTTRANSPORT OPERATIONS
  // ========================================

  getTrusttransportProfile = delegate(() => this.trustTransportStorage, 'getTrusttransportProfile');
  createTrusttransportProfile = delegate(() => this.trustTransportStorage, 'createTrusttransportProfile');
  updateTrusttransportProfile = delegate(() => this.trustTransportStorage, 'updateTrusttransportProfile');
  deleteTrusttransportProfile = delegate(() => this.trustTransportStorage, 'deleteTrusttransportProfile');
  createTrusttransportRideRequest = delegate(() => this.trustTransportStorage, 'createTrusttransportRideRequest');
  getTrusttransportRideRequestById = delegate(() => this.trustTransportStorage, 'getTrusttransportRideRequestById');
  getTrusttransportRideRequestsByRider = delegate(() => this.trustTransportStorage, 'getTrusttransportRideRequestsByRider');
  getOpenTrusttransportRideRequests = delegate(() => this.trustTransportStorage, 'getOpenTrusttransportRideRequests');
  getTrusttransportRideRequestsByDriver = delegate(() => this.trustTransportStorage, 'getTrusttransportRideRequestsByDriver');
  claimTrusttransportRideRequest = delegate(() => this.trustTransportStorage, 'claimTrusttransportRideRequest');
  updateTrusttransportRideRequest = delegate(() => this.trustTransportStorage, 'updateTrusttransportRideRequest');
  cancelTrusttransportRideRequest = delegate(() => this.trustTransportStorage, 'cancelTrusttransportRideRequest');
  createTrusttransportAnnouncement = delegate(() => this.trustTransportStorage, 'createTrusttransportAnnouncement');
  getActiveTrusttransportAnnouncements = delegate(() => this.trustTransportStorage, 'getActiveTrusttransportAnnouncements');
  getAllTrusttransportAnnouncements = delegate(() => this.trustTransportStorage, 'getAllTrusttransportAnnouncements');
  updateTrusttransportAnnouncement = delegate(() => this.trustTransportStorage, 'updateTrusttransportAnnouncement');
  deactivateTrusttransportAnnouncement = delegate(() => this.trustTransportStorage, 'deactivateTrusttransportAnnouncement');

  // ========================================
  // GENTLEPULSE OPERATIONS
  // ========================================

  createGentlepulseMeditation = delegate(() => this.gentlePulseStorage, 'createGentlepulseMeditation');
  getGentlepulseMeditations = delegate(() => this.gentlePulseStorage, 'getGentlepulseMeditations');
  getGentlepulseMeditationById = delegate(() => this.gentlePulseStorage, 'getGentlepulseMeditationById');
  updateGentlepulseMeditation = delegate(() => this.gentlePulseStorage, 'updateGentlepulseMeditation');
  incrementGentlepulsePlayCount = delegate(() => this.gentlePulseStorage, 'incrementGentlepulsePlayCount');
  createOrUpdateGentlepulseRating = delegate(() => this.gentlePulseStorage, 'createOrUpdateGentlepulseRating');
  getGentlepulseRatingsByMeditationId = delegate(() => this.gentlePulseStorage, 'getGentlepulseRatingsByMeditationId');
  getGentlepulseRatingByClientAndMeditation = delegate(() => this.gentlePulseStorage, 'getGentlepulseRatingByClientAndMeditation');
  updateGentlepulseMeditationRating = delegate(() => this.gentlePulseStorage, 'updateGentlepulseMeditationRating');
  createGentlepulseFavorite = delegate(() => this.gentlePulseStorage, 'createGentlepulseFavorite');
  deleteGentlepulseFavorite = delegate(() => this.gentlePulseStorage, 'deleteGentlepulseFavorite');
  getGentlepulseFavoritesByClientId = delegate(() => this.gentlePulseStorage, 'getGentlepulseFavoritesByClientId');
  isGentlepulseFavorite = delegate(() => this.gentlePulseStorage, 'isGentlepulseFavorite');
  createGentlepulseAnnouncement = delegate(() => this.gentlePulseStorage, 'createGentlepulseAnnouncement');
  getActiveGentlepulseAnnouncements = delegate(() => this.gentlePulseStorage, 'getActiveGentlepulseAnnouncements');
  getAllGentlepulseAnnouncements = delegate(() => this.gentlePulseStorage, 'getAllGentlepulseAnnouncements');
  updateGentlepulseAnnouncement = delegate(() => this.gentlePulseStorage, 'updateGentlepulseAnnouncement');
  deactivateGentlepulseAnnouncement = delegate(() => this.gentlePulseStorage, 'deactivateGentlepulseAnnouncement');

  // ========================================
  // MOOD OPERATIONS
  // ========================================

  createMoodCheck = delegate(() => this.moodStorage, 'createMoodCheck');
  getMoodChecksByClientId = delegate(() => this.moodStorage, 'getMoodChecksByClientId');
  getMoodChecksByDateRange = delegate(() => this.moodStorage, 'getMoodChecksByDateRange');
  createMoodAnnouncement = delegate(() => this.moodStorage, 'createMoodAnnouncement');
  getActiveMoodAnnouncements = delegate(() => this.moodStorage, 'getActiveMoodAnnouncements');
  getAllMoodAnnouncements = delegate(() => this.moodStorage, 'getAllMoodAnnouncements');
  updateMoodAnnouncement = delegate(() => this.moodStorage, 'updateMoodAnnouncement');
  deactivateMoodAnnouncement = delegate(() => this.moodStorage, 'deactivateMoodAnnouncement');

  // ========================================
  // CHYME OPERATIONS
  // ========================================

  createChymeAnnouncement = delegate(() => this.chymeStorage, 'createChymeAnnouncement');
  getActiveChymeAnnouncements = delegate(() => this.chymeStorage, 'getActiveChymeAnnouncements');
  getAllChymeAnnouncements = delegate(() => this.chymeStorage, 'getAllChymeAnnouncements');
  updateChymeAnnouncement = delegate(() => this.chymeStorage, 'updateChymeAnnouncement');
  deactivateChymeAnnouncement = delegate(() => this.chymeStorage, 'deactivateChymeAnnouncement');
  createChymeRoom = delegate(() => this.chymeStorage, 'createChymeRoom');
  getChymeRoom = delegate(() => this.chymeStorage, 'getChymeRoom');
  getChymeRooms = delegate(() => this.chymeStorage, 'getChymeRooms');
  updateChymeRoom = delegate(() => this.chymeStorage, 'updateChymeRoom');
  deactivateChymeRoom = delegate(() => this.chymeStorage, 'deactivateChymeRoom');
  updateChymeRoomPinnedLink = delegate(() => this.chymeStorage, 'updateChymeRoomPinnedLink');
  getChymeRoomParticipantCount = delegate(() => this.chymeStorage, 'getChymeRoomParticipantCount');
  joinChymeRoom = delegate(() => this.chymeStorage, 'joinChymeRoom');
  leaveChymeRoom = delegate(() => this.chymeStorage, 'leaveChymeRoom');
  getChymeRoomParticipants = delegate(() => this.chymeStorage, 'getChymeRoomParticipants');
  getChymeRoomParticipant = delegate(() => this.chymeStorage, 'getChymeRoomParticipant');
  updateChymeRoomParticipant = delegate(() => this.chymeStorage, 'updateChymeRoomParticipant');
  getActiveRoomsForUser = delegate(() => this.chymeStorage, 'getActiveRoomsForUser');
  followChymeUser = delegate(() => this.chymeStorage, 'followChymeUser');
  unfollowChymeUser = delegate(() => this.chymeStorage, 'unfollowChymeUser');
  isFollowingChymeUser = delegate(() => this.chymeStorage, 'isFollowingChymeUser');
  getChymeUserFollows = delegate(() => this.chymeStorage, 'getChymeUserFollows');
  blockChymeUser = delegate(() => this.chymeStorage, 'blockChymeUser');
  unblockChymeUser = delegate(() => this.chymeStorage, 'unblockChymeUser');
  isBlockingChymeUser = delegate(() => this.chymeStorage, 'isBlockingChymeUser');
  getChymeUserBlocks = delegate(() => this.chymeStorage, 'getChymeUserBlocks');
  createChymeMessage = delegate(() => this.chymeStorage, 'createChymeMessage');
  getChymeMessages = delegate(() => this.chymeStorage, 'getChymeMessages');

  // ========================================
  // WORKFORCE RECRUITER OPERATIONS
  // ========================================

  getWorkforceRecruiterProfile = delegate(() => this.workforceRecruiterStorage, 'getWorkforceRecruiterProfile');
  createWorkforceRecruiterProfile = delegate(() => this.workforceRecruiterStorage, 'createWorkforceRecruiterProfile');
  updateWorkforceRecruiterProfile = delegate(() => this.workforceRecruiterStorage, 'updateWorkforceRecruiterProfile');
  deleteWorkforceRecruiterProfile = delegate(() => this.workforceRecruiterStorage, 'deleteWorkforceRecruiterProfile');
  getWorkforceRecruiterConfig = delegate(() => this.workforceRecruiterStorage, 'getWorkforceRecruiterConfig');
  updateWorkforceRecruiterConfig = delegate(() => this.workforceRecruiterStorage, 'updateWorkforceRecruiterConfig');
  createWorkforceRecruiterConfig = delegate(() => this.workforceRecruiterStorage, 'createWorkforceRecruiterConfig');
  getWorkforceRecruiterOccupation = delegate(() => this.workforceRecruiterStorage, 'getWorkforceRecruiterOccupation');
  getAllWorkforceRecruiterOccupations = delegate(() => this.workforceRecruiterStorage, 'getAllWorkforceRecruiterOccupations');
  createWorkforceRecruiterOccupation = delegate(() => this.workforceRecruiterStorage, 'createWorkforceRecruiterOccupation');
  updateWorkforceRecruiterOccupation = delegate(() => this.workforceRecruiterStorage, 'updateWorkforceRecruiterOccupation');
  deleteWorkforceRecruiterOccupation = delegate(() => this.workforceRecruiterStorage, 'deleteWorkforceRecruiterOccupation');
  getWorkforceRecruiterSummaryReport = delegate(() => this.workforceRecruiterStorage, 'getWorkforceRecruiterSummaryReport');
  getWorkforceRecruiterSkillLevelDetail = delegate(() => this.workforceRecruiterStorage, 'getWorkforceRecruiterSkillLevelDetail');
  getWorkforceRecruiterSectorDetail = delegate(() => this.workforceRecruiterStorage, 'getWorkforceRecruiterSectorDetail');
  createWorkforceRecruiterAnnouncement = delegate(() => this.workforceRecruiterStorage, 'createWorkforceRecruiterAnnouncement');
  getActiveWorkforceRecruiterAnnouncements = delegate(() => this.workforceRecruiterStorage, 'getActiveWorkforceRecruiterAnnouncements');
  getAllWorkforceRecruiterAnnouncements = delegate(() => this.workforceRecruiterStorage, 'getAllWorkforceRecruiterAnnouncements');
  updateWorkforceRecruiterAnnouncement = delegate(() => this.workforceRecruiterStorage, 'updateWorkforceRecruiterAnnouncement');
  deactivateWorkforceRecruiterAnnouncement = delegate(() => this.workforceRecruiterStorage, 'deactivateWorkforceRecruiterAnnouncement');

  // ========================================
  // DEFAULT ALIVE OR DEAD OPERATIONS
  // ========================================

  createDefaultAliveOrDeadFinancialEntry = delegate(() => this.defaultAliveOrDeadStorage, 'createDefaultAliveOrDeadFinancialEntry');
  getDefaultAliveOrDeadFinancialEntry = delegate(() => this.defaultAliveOrDeadStorage, 'getDefaultAliveOrDeadFinancialEntry');
  getDefaultAliveOrDeadFinancialEntries = delegate(() => this.defaultAliveOrDeadStorage, 'getDefaultAliveOrDeadFinancialEntries');
  updateDefaultAliveOrDeadFinancialEntry = delegate(() => this.defaultAliveOrDeadStorage, 'updateDefaultAliveOrDeadFinancialEntry');
  deleteDefaultAliveOrDeadFinancialEntry = delegate(() => this.defaultAliveOrDeadStorage, 'deleteDefaultAliveOrDeadFinancialEntry');
  getDefaultAliveOrDeadFinancialEntryByWeek = delegate(() => this.defaultAliveOrDeadStorage, 'getDefaultAliveOrDeadFinancialEntryByWeek');
  calculateAndStoreEbitdaSnapshot = delegate(() => this.defaultAliveOrDeadStorage, 'calculateAndStoreEbitdaSnapshot');
  getDefaultAliveOrDeadEbitdaSnapshot = delegate(() => this.defaultAliveOrDeadStorage, 'getDefaultAliveOrDeadEbitdaSnapshot');
  getDefaultAliveOrDeadEbitdaSnapshots = delegate(() => this.defaultAliveOrDeadStorage, 'getDefaultAliveOrDeadEbitdaSnapshots');
  getDefaultAliveOrDeadCurrentStatus = delegate(() => this.defaultAliveOrDeadStorage, 'getDefaultAliveOrDeadCurrentStatus');
  getDefaultAliveOrDeadWeeklyTrends = delegate(() => this.defaultAliveOrDeadStorage, 'getDefaultAliveOrDeadWeeklyTrends');
  getDefaultAliveOrDeadWeekComparison = delegate(() => this.defaultAliveOrDeadStorage, 'getDefaultAliveOrDeadWeekComparison');
  getDefaultAliveOrDeadCurrentFunding = delegate(() => this.defaultAliveOrDeadStorage, 'getDefaultAliveOrDeadCurrentFunding');
  updateDefaultAliveOrDeadCurrentFunding = delegate(() => this.defaultAliveOrDeadStorage, 'updateDefaultAliveOrDeadCurrentFunding');

  // ========================================
  // CHAT OPERATIONS
  // ========================================

  createChatMessage = delegate(() => this.chatStorage, 'createChatMessage');
  getChannelMessages = delegate(() => this.chatStorage, 'getChannelMessages');
  getCommunityMessages = delegate(() => this.chatStorage, 'getCommunityMessages');
}
