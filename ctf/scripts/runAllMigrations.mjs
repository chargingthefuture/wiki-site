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

async function findMigrations(migrationsDir) {
  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => path.join(migrationsDir, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

async function runMigrations({ migrationPaths, databaseUrl }) {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    for (const migrationPath of migrationPaths) {
      const sql = await fs.readFile(migrationPath, 'utf8');
      await client.query(sql);
      console.log(`Migration applied: ${migrationPath}`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const migrationsDir = path.resolve(process.cwd(), args.dir || './migrations');
  const databaseUrl = requireEnv('DATABASE_URL');

  const migrationPaths = await findMigrations(migrationsDir);
  if (migrationPaths.length === 0) {
    throw new Error(`No SQL migration files found in: ${migrationsDir}`);
  }

  await runMigrations({ migrationPaths, databaseUrl });
  console.log(`Applied ${migrationPaths.length} migration(s) from ${migrationsDir}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
