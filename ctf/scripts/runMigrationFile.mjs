#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { Pool } from 'pg';

function requireEnv(name) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function parseArgs(argv) {
  const args = {};
  for (const token of argv) {
    if (!token.startsWith('--')) {
      continue;
    }

    const [rawKey, ...valueParts] = token.slice(2).split('=');
    const key = rawKey.trim();
    const value = valueParts.join('=').trim();

    if (key.length > 0) {
      args[key] = value;
    }
  }

  return args;
}

function resolveMigrationPath(fileArg) {
  if (!fileArg || fileArg.length === 0) {
    throw new Error('Missing required argument: --file=<path-to-sql-migration>');
  }

  return path.resolve(process.cwd(), fileArg);
}

async function runMigration({ migrationFilePath, databaseUrl }) {
  const sql = await fs.readFile(migrationFilePath, 'utf8');
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await pool.query(sql);
  } finally {
    await pool.end();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const migrationFilePath = resolveMigrationPath(args.file);
  const databaseUrl = requireEnv('DATABASE_URL');

  await runMigration({ migrationFilePath, databaseUrl });

  console.log(`Migration applied: ${migrationFilePath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
