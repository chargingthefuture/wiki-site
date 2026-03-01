const ENV_TARGET = process.env.CLERK_ENV_TARGET;

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
    'Missing or invalid CLERK_ENV_TARGET. Use one of: railway-staging, vercel-staging, railway-production.',
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

console.log(`Clerk environment validation passed for target: ${ENV_TARGET}`);
