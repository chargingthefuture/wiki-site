  // check-clerk-env.mjs
  // Validates that all environment variables listed in .env.local.example are set in the current environment
  import fs from 'fs';
  import path from 'path';

  const envExamplePath = path.resolve(process.cwd(), '.env.local.example');
  const envExample = fs.readFileSync(envExamplePath, 'utf-8');

  // Parse .env.local.example for variable names (ignore comments and blank lines)
  const requiredVars = envExample
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('=')[0].trim())
    .filter(Boolean);

  const missingVars = requiredVars.filter(
    (key) => !(key in process.env) || process.env[key] === ''
  );

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:');
    missingVars.forEach((key) => console.error(`  - ${key}`));
    process.exit(1);
  }

  console.log('All required environment variables are set.');

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
let parsedAppUrl, parsedSignInUrl;
if (appUrl) parsedAppUrl = new URL(appUrl);
if (signInUrl) parsedSignInUrl = new URL(signInUrl);
  if (parsedAppUrl && parsedSignInUrl && parsedSignInUrl.host !== parsedAppUrl.host) {
    console.error(
      `Sign-in URL host mismatch. signIn=${parsedSignInUrl.host} app=${parsedAppUrl.host}.`,
    );
    process.exit(1);
  }

const ENV_TARGET = process.env.CLERK_ENV_TARGET || (() => {
  // Railway explicit prefixed vars
  if (
    process.env.RAILWAY_PROD_CLERK_PUBLISHABLE_KEY ||
    process.env.RAILWAY_PROD_CLERK_SIGN_IN_URL ||
    process.env.RAILWAY_PROD_CLERK_SECRET_KEY
  ) return 'railway-production';
  if (
    process.env.RAILWAY_STAGING_CLERK_PUBLISHABLE_KEY ||
    process.env.RAILWAY_STAGING_CLERK_SIGN_IN_URL ||
    process.env.RAILWAY_STAGING_CLERK_SECRET_KEY
  ) return 'railway-staging';

  // Try to infer from NEXT_PUBLIC_APP_URL
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl) {
      const host = new URL(appUrl).host;
      if (host.includes('staging')) return 'railway-staging';
      if (host.includes('railway')) return 'railway-production';
    }
  } catch (e) {
    // ignore
  }

  return undefined;
})();

if (!ENV_TARGET) {
  console.error('Could not determine CLERK_ENV_TARGET. Please set CLERK_ENV_TARGET to one of: railway-staging, railway-production, vercel-staging.');
  process.exit(1);
}

console.log(`Clerk environment validation passed for target: ${ENV_TARGET}`);
