function inferRailwayRuntime() {
  return Boolean(
    process.env.RAILWAY_ENVIRONMENT_NAME
    || process.env.RAILWAY_ENVIRONMENT
    || process.env.RAILWAY_DEPLOYMENT_ENVIRONMENT,
  );
}

function isTruthy(value) {
  if (!value) {
    return false;
  }

  const normalized = String(value).trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

const runningOnRailway = inferRailwayRuntime();
const requireFormance = isTruthy(process.env.SERVICE_CREDITS_REQUIRE_FORMANCE)
  || process.env.NODE_ENV === 'production'
  || runningOnRailway;

const requiredKeys = ['FORMANCE_API_URL', 'FORMANCE_LEDGER', 'FORMANCE_API_TOKEN'];

if (!requireFormance) {
  console.log('Formance env check skipped (not required in current runtime).');
  process.exit(0);
}

const missing = requiredKeys.filter((key) => !process.env[key] || String(process.env[key]).trim().length === 0);
if (missing.length > 0) {
  console.error('Formance env validation failed. Missing required keys:');
  for (const key of missing) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

try {
  const parsed = new URL(String(process.env.FORMANCE_API_URL));
  if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
    console.error(`FORMANCE_API_URL must use https or localhost for local dev. Received: ${process.env.FORMANCE_API_URL}`);
    process.exit(1);
  }
} catch {
  console.error(`Invalid FORMANCE_API_URL format: ${process.env.FORMANCE_API_URL}`);
  process.exit(1);
}

console.log('Formance environment validation passed.');
