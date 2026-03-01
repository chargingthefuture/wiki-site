function inferRailwayTarget() {
  const railwayEnvironment = (
    process.env.RAILWAY_ENVIRONMENT_NAME ||
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.RAILWAY_DEPLOYMENT_ENVIRONMENT ||
    ''
  ).toLowerCase();

  if (!railwayEnvironment) {
    return null;
  }

  if (railwayEnvironment.includes('prod')) {
    return 'railway-production';
  }

  return 'railway-staging';
}

function inferVercelTarget() {
  const isVercel =
    process.env.VERCEL === '1'
    || typeof process.env.VERCEL_ENV === 'string'
    || typeof process.env.VERCEL_URL === 'string';

  if (!isVercel) {
    return null;
  }

  return 'vercel-staging';
}

const ENV_TARGET = process.env.CLERK_ENV_TARGET || inferRailwayTarget() || inferVercelTarget();

const targetDefinitions = {
  'railway-staging': [
    [
      'RAILWAY_STAGING_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    ],
    ['RAILWAY_STAGING_CLERK_SECRET_KEY', 'CLERK_SECRET_KEY'],
    ['RAILWAY_STAGING_CLERK_SIGN_IN_URL', 'CLERK_SIGN_IN_URL'],
    ['RAILWAY_NEXT_PUBLIC_APP_URL'],
  ],
  'vercel-staging': [
    [
      'VERCEL_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    ],
    ['VERCEL_CLERK_SECRET_KEY', 'CLERK_SECRET_KEY'],
    ['VERCEL_CLERK_SIGN_IN_URL', 'CLERK_SIGN_IN_URL'],
    ['VERCEL_NEXT_PUBLIC_APP_URL'],
  ],
  'railway-production': [
    [
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'RAILWAY_PROD_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    ],
    ['CLERK_SECRET_KEY', 'RAILWAY_PROD_CLERK_SECRET_KEY'],
    ['CLERK_SIGN_IN_URL', 'RAILWAY_PROD_CLERK_SIGN_IN_URL'],
    ['RAILWAY_NEXT_PUBLIC_APP_URL'],
  ],
};

if (!ENV_TARGET || !(ENV_TARGET in targetDefinitions)) {
  console.error(
    'Missing or invalid CLERK_ENV_TARGET. Use one of: railway-staging, vercel-staging, railway-production. On Railway, this is auto-inferred from RAILWAY_ENVIRONMENT_NAME when available. On Vercel, this defaults to vercel-staging.',
  );
  process.exit(1);
}

const requiredKeys = targetDefinitions[ENV_TARGET];
const missingGroups = requiredKeys.filter((group) => {
  return !group.some((key) => Boolean(process.env[key]));
});

if (missingGroups.length > 0) {
  console.error(
    'Clerk environment validation failed. Missing one key from each required group:',
  );
  for (const group of missingGroups) {
    console.error(`- one of: ${group.join(' | ')}`);
  }
  process.exit(1);
}

function pickEnv(...keys) {
  for (const key of keys) {
    if (process.env[key]) {
      return process.env[key];
    }
  }

  return undefined;
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

const appUrl = pickEnv(
  'NEXT_PUBLIC_APP_URL',
  'RAILWAY_NEXT_PUBLIC_APP_URL',
  'VERCEL_NEXT_PUBLIC_APP_URL',
);
const signInUrl = pickEnv(
  'CLERK_SIGN_IN_URL',
  'RAILWAY_STAGING_CLERK_SIGN_IN_URL',
  'VERCEL_CLERK_SIGN_IN_URL',
  'RAILWAY_PROD_CLERK_SIGN_IN_URL',
);

const parsedAppUrl = parseUrl(appUrl);

if (appUrl && !parsedAppUrl) {
  console.error(`Invalid app URL format: ${appUrl}`);
  process.exit(1);
}

if (signInUrl && !signInUrl.startsWith('/')) {
  const parsedSignInUrl = parseUrl(signInUrl);

  if (!parsedSignInUrl) {
    console.error(`Invalid sign-in URL format: ${signInUrl}`);
    process.exit(1);
  }

  if (parsedAppUrl && parsedSignInUrl.host !== parsedAppUrl.host) {
    console.error(
      `Sign-in URL host mismatch. signIn=${parsedSignInUrl.host} app=${parsedAppUrl.host}.`,
    );
    process.exit(1);
  }
}

console.log(`Clerk environment validation passed for target: ${ENV_TARGET}`);
