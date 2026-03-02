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
  requireVar('MOBILE_CLERK_PUBLISHABLE_KEY_PRODUCTION');
  requireVar('EXPO_OWNER');
} else {
  requireVar('MOBILE_CLERK_PUBLISHABLE_KEY_STAGING');
}

if (process.exitCode && process.exitCode !== 0) {
  console.error(`Mobile env validation failed for profile: ${profile}`);
  process.exit(process.exitCode);
}

console.log(`Mobile env validation passed for profile: ${profile}`);
