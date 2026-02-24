import { SkillsHuntApiError } from "./errors";

const DISPLAY_NAME_PATTERN = /^[A-Za-z0-9 ]{2,100}$/;
const HTML_TAG_PATTERN = /<[^>]+>/i;

const uniqueNormalized = (values: string[]): string[] => {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      out.push(value);
    }
  }

  return out;
};

const splitStringCollection = (value: string): string[] => {
  return value
    .split(/[,\n]/g)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const normalizeCollection = (value: string[] | string, fieldName: string): string[] => {
  const rawValues = Array.isArray(value)
    ? value.map((entry) => String(entry).trim())
    : splitStringCollection(value);

  const normalized = uniqueNormalized(
    rawValues
      .map((entry) => entry.replace(/\s+/g, " ").trim())
      .filter((entry) => entry.length > 0),
  );

  for (const item of normalized) {
    if (item.length < 1 || item.length > 140) {
      throw new SkillsHuntApiError({
        code: "VALIDATION_ERROR",
        message: `${fieldName} entries must be between 1 and 140 characters`,
        status: 400,
      });
    }
  }

  return normalized;
};

export const validateDisplayName = (value: string): string => {
  const displayName = value.trim().replace(/\s+/g, " ");
  if (!DISPLAY_NAME_PATTERN.test(displayName)) {
    throw new SkillsHuntApiError({
      code: "VALIDATION_ERROR",
      message: "displayName must be 2-100 characters and contain only letters, numbers, and spaces",
      status: 400,
    });
  }

  return displayName;
};

export const validateBio = (value: string): string => {
  const bio = value.trim();

  if (bio.length > 280) {
    throw new SkillsHuntApiError({
      code: "VALIDATION_ERROR",
      message: "bio must be 280 characters or less",
      status: 400,
    });
  }

  if (HTML_TAG_PATTERN.test(bio)) {
    throw new SkillsHuntApiError({
      code: "VALIDATION_ERROR",
      message: "bio must not contain HTML or script content",
      status: 400,
    });
  }

  return bio;
};

export const normalizeQuoraProfileUrl = (value: string): string => {
  const input = value.trim();

  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    throw new SkillsHuntApiError({
      code: "VALIDATION_ERROR",
      message: "quoraProfileUrl must be a valid URL",
      status: 400,
    });
  }

  const isQuoraHost = parsed.hostname === "quora.com" || parsed.hostname === "www.quora.com";
  if (!isQuoraHost) {
    throw new SkillsHuntApiError({
      code: "VALIDATION_ERROR",
      message: "quoraProfileUrl must use quora.com",
      status: 400,
    });
  }

  const pathMatch = parsed.pathname.match(/^\/profile\/([A-Za-z0-9_-]+)\/?$/);
  if (!pathMatch) {
    throw new SkillsHuntApiError({
      code: "VALIDATION_ERROR",
      message: "quoraProfileUrl must match quora.com/profile/{username}",
      status: 400,
    });
  }

  return `https://www.quora.com/profile/${pathMatch[1]}`;
};

export const normalizeSkills = (value: string[] | string): string[] => {
  const skills = normalizeCollection(value, "skills");

  if (skills.length === 0) {
    throw new SkillsHuntApiError({
      code: "VALIDATION_ERROR",
      message: "At least one skill is required",
      status: 400,
    });
  }

  return skills;
};

export const normalizeClaimedProfessions = (value: string[] | string | undefined): string[] => {
  if (!value) {
    return [];
  }

  return normalizeCollection(value, "claimedProfessions");
};

export const buildSkillsSignature = (skills: string[]): string => {
  return [...skills]
    .map((skill) => skill.toLowerCase())
    .sort((a, b) => a.localeCompare(b))
    .join("|");
};
