export type DirectoryProfile = {
  id: string;
  claimedByUserId: string | null;
  displayName: string;
  headline: string | null;
  bio: string | null;
  profileUrl: string | null;
  isPublic: boolean;
  sectorId: string | null;
  sectorName: string | null;
  jobTitleId: string | null;
  jobTitleName: string | null;
  skills: Array<{ id: string; name: string; displayOrder: number }>;
  isActive: boolean;
  createdAtIso: string;
  updatedAtIso: string;
};

export type DirectoryAnnouncement = {
  id: string;
  title: string;
  body: string;
  isActive: boolean;
  publishedAtIso: string;
  expiresAtIso: string | null;
  createdByUserId: string;
  updatedByUserId: string;
  createdAtIso: string;
  updatedAtIso: string;
};

export type DirectoryPagination = {
  page: number;
  pageSize: number;
  total: number;
};

export type DirectoryProfileInput = {
  displayName: string;
  headline?: string | null;
  bio?: string | null;
  profileUrl?: string | null;
  isPublic: boolean;
  sectorId?: string | null;
  jobTitleId?: string | null;
  skillIds?: string[];
};

export type DirectoryAnnouncementInput = {
  title: string;
  body: string;
  isActive?: boolean;
  publishedAtIso?: string | null;
  expiresAtIso?: string | null;
};
