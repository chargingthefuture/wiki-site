export type FeedRenderMode = 'card_only' | 'card_toast';

export type FeedPagination = {
  page: number;
  pageSize: number;
  total: number;
};

export type FeedTimelineItem = {
  id: string;
  itemType: 'announcement' | 'activity';
  sourceAnnouncementId: string | null;
  title: string;
  body: string;
  priority: number;
  mandatory: boolean;
  publishedAtIso: string;
  expiresAtIso: string | null;
  isRead: boolean;
  isDismissed: boolean;
};

export type FeedConfig = {
  renderMode: FeedRenderMode;
  killSwitchEnabled: boolean;
  maxTimelinePageSize: number;
  updatedByUserId: string;
  updatedAtIso: string;
};

export type FeedConfigInput = {
  renderMode: FeedRenderMode;
  killSwitchEnabled: boolean;
  maxTimelinePageSize: number;
};

export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export type AnnouncementTargeting = {
  roles?: string[];
  plugins?: string[];
  regions?: string[];
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  status: AnnouncementStatus;
  priority: number;
  mandatory: boolean;
  scheduleAtIso: string | null;
  publishedAtIso: string | null;
  expiresAtIso: string | null;
  targeting: AnnouncementTargeting;
  createdByUserId: string;
  updatedByUserId: string;
  createdAtIso: string;
  updatedAtIso: string;
};

export type AnnouncementDraftInput = {
  title: string;
  body: string;
  priority?: number;
  mandatory?: boolean;
  scheduleAtIso?: string | null;
  expiresAtIso?: string | null;
  targeting?: AnnouncementTargeting;
};

export type MembershipEventType = 'join' | 'leave';
