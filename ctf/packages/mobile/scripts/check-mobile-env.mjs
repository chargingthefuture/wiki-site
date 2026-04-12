
import 'dotenv/config';
const profile = process.env.MOBILE_ENV_TARGET || process.env.EAS_BUILD_PROFILE || 'preview';

function pick(...keys) {
  for (const key of keys) {
    if (process.env[key]) {
      return process.env[key];
    }
  }

  return undefined;
}

function requireOneOf(groupLabel, keys) {
  const value = pick(...keys);
  if (!value) {
    console.error(`Missing required env group: ${groupLabel} (one of: ${keys.join(' | ')})`);
    process.exitCode = 1;
  }
}

function requireVar(key) {
  if (!process.env[key]) {
    console.error(`Missing required env: ${key}`);
    process.exitCode = 1;
  }
}

function requireAuthPublishableKey(target) {
  requireOneOf(`mobile auth publishable key (${target})`, [
    `MOBILE_AUTH_PUBLISHABLE_KEY_${target}`,
    `MOBILE_CLERK_PUBLISHABLE_KEY_${target}`,
  ]);
}

function parseUrl(value) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

requireOneOf('mobile project id', ['EXPO_MOBILE_PROJECT_ID', 'MOBILE_PROJECT_ID']);
requireOneOf('mobile updates url', ['EXPO_MOBILE_UPDATES_URL', 'MOBILE_UPDATES_URL']);
requireVar('MOBILE_APP_URL');
requireVar('MOBILE_CTF_USER_ID');
requireVar('MOBILE_CTF_USERNAME');

const mobileAppUrl = process.env.MOBILE_APP_URL;
const parsedMobileAppUrl = parseUrl(mobileAppUrl);

if (!parsedMobileAppUrl) {
  console.error(`Invalid MOBILE_APP_URL format: ${mobileAppUrl}`);
  process.exitCode = 1;
} else {
  if (parsedMobileAppUrl.protocol !== 'https:') {
    console.error(`MOBILE_APP_URL must use https. Received: ${mobileAppUrl}`);
    process.exitCode = 1;
  }

  const appHost = parsedMobileAppUrl.hostname.toLowerCase();
  if (appHost === 'localhost' || appHost === '127.0.0.1') {
    console.error(`MOBILE_APP_URL cannot use localhost for cloud mobile builds. Received host: ${parsedMobileAppUrl.hostname}`);
    process.exitCode = 1;
  }
}

if (profile === 'production') {
  requireAuthPublishableKey('PRODUCTION');
  requireVar('EXPO_OWNER');
} else {
  requireAuthPublishableKey('STAGING');
}

const normalizedRole = String(process.env.MOBILE_CTF_USER_ROLE || 'member').toLowerCase();
if (!['member', 'admin'].includes(normalizedRole)) {
  console.error(`MOBILE_CTF_USER_ROLE must be member or admin. Received: ${process.env.MOBILE_CTF_USER_ROLE}`);
  process.exitCode = 1;
}

const normalizedApproved = String(process.env.MOBILE_CTF_USER_APPROVED || 'approved').toLowerCase();
if (!['1', 'true', 'yes', 'approved', '0', 'false', 'no', 'denied'].includes(normalizedApproved)) {
  console.error(`MOBILE_CTF_USER_APPROVED must be a boolean-like value. Received: ${process.env.MOBILE_CTF_USER_APPROVED}`);
  process.exitCode = 1;
}

if (process.exitCode && process.exitCode !== 0) {
  console.error(`Mobile env validation failed for profile: ${profile}`);
  process.exit(process.exitCode);
}

console.log(`Mobile env validation passed for profile: ${profile}`);
