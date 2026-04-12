/* eslint-env node */
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

function resolveSchemaPath(fileArg) {
  return path.resolve(process.cwd(), fileArg || './schema.sql');
}

async function applySchema({ schemaPath, databaseUrl }) {
  const sql = await fs.readFile(schemaPath, 'utf8');
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
  const schemaPath = resolveSchemaPath(args.file);
  const databaseUrl = requireEnv('DATABASE_URL');

  await applySchema({ schemaPath, databaseUrl });
  console.log(`Schema applied: ${schemaPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
