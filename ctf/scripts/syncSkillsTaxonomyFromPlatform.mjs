#!/usr/bin/env node

import { Pool } from 'pg';
import { syncSkillsTaxonomyFromLegacy } from './lib/syncSkillsTaxonomyFromLegacy.mjs';

function requireEnv(name) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function getArg(flagName) {
  const prefix = `${flagName}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

const mode = getArg('--mode') ?? 'sync';
const legacyFilePath = getArg('--source');

const pool = new Pool({
  connectionString: requireEnv('DATABASE_URL'),
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const summary = await syncSkillsTaxonomyFromLegacy({
    pool,
    mode,
    legacyFilePath,
  });

  console.log(
    [
      'Skills taxonomy legacy sync complete.',
      `mode=${summary.mode}`,
      `sectors=${summary.sectors}`,
      `jobTitles=${summary.jobTitles}`,
      `skills=${summary.skills}`,
      `source=${summary.sourceFile}`,
    ].join(' '),
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
