#!/usr/bin/env node
/* eslint-env node */
/**
 * report-live-schema-drift.mjs
 *
 * Compares canonical schema in ctf/schema.sql with a live Postgres database
 * and reports all missing tables/columns in one run.
 *
 * Usage:
 *   node ctf/scripts/report-live-schema-drift.mjs [DATABASE_URL]
 *   DATABASE_URL=... node ctf/scripts/report-live-schema-drift.mjs
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { console, process } = globalThis;

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SCHEMA_PATH = join(ROOT, 'schema.sql');

function normalizeIdentifier(name) {
  const cleaned = name.replace(/"/g, '').toLowerCase();
  const parts = cleaned.split('.');
  return parts[parts.length - 1];
}

function parseSchema(sql) {
  /** @type {Map<string, Set<string>>} */
  const tables = new Map();

  const createRe = /CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(\S+)\s*\(([\s\S]*?)\);/gi;
  let match;

  while ((match = createRe.exec(sql)) !== null) {
    const tableName = normalizeIdentifier(match[1]);
    const body = match[2];

    if (!tables.has(tableName)) {
      tables.set(tableName, new Set());
    }

    const cols = tables.get(tableName);
    for (const line of body.split('\n')) {
      const trimmed = line.trim();
      if (
        trimmed === '' ||
        /^(PRIMARY|UNIQUE|CHECK|FOREIGN|CONSTRAINT|CREATE\s|--)/i.test(trimmed)
      ) {
        continue;
      }

      const colMatch = trimmed.match(/^"?([a-z_][a-z0-9_]*)"?\s+/i);
      if (colMatch) {
        cols.add(colMatch[1].toLowerCase());
      }
    }
  }

  const alterBlockRe =
    /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(\S+)\s+((?:ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+[\s\S]*?)(?:;|\n\n))/gi;
  while ((match = alterBlockRe.exec(sql)) !== null) {
    const tableName = normalizeIdentifier(match[1]);
    if (!tables.has(tableName)) {
      tables.set(tableName, new Set());
    }

    const cols = tables.get(tableName);
    const colRe = /ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+"?([a-z_][a-z0-9_]*)"?/gi;
    let colMatch;
    while ((colMatch = colRe.exec(match[2])) !== null) {
      cols.add(colMatch[1].toLowerCase());
    }
  }

  const alterSingleRe =
    /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(\S+)\s+ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+"?([a-z_][a-z0-9_]*)"?/gi;
  while ((match = alterSingleRe.exec(sql)) !== null) {
    const tableName = normalizeIdentifier(match[1]);
    const colName = match[2].toLowerCase();

    if (!tables.has(tableName)) {
      tables.set(tableName, new Set());
    }
    tables.get(tableName).add(colName);
  }

  return tables;
}

async function getLiveSchema(databaseUrl) {
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const tablesResult = await client.query(
      `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
      `,
    );

    const columnsResult = await client.query(
      `
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
      `,
    );

    /** @type {Map<string, Set<string>>} */
    const live = new Map();
    for (const row of tablesResult.rows) {
      live.set(row.table_name.toLowerCase(), new Set());
    }

    for (const row of columnsResult.rows) {
      const table = row.table_name.toLowerCase();
      const column = row.column_name.toLowerCase();
      if (!live.has(table)) {
        live.set(table, new Set());
      }
      live.get(table).add(column);
    }

    return live;
  } finally {
    await client.end();
  }
}

function compareSchemas(expected, live) {
  const missingTables = [];
  const missingColumns = [];

  for (const [table, expectedColumns] of expected) {
    if (!live.has(table)) {
      missingTables.push(table);
      continue;
    }

    const liveColumns = live.get(table);
    for (const col of expectedColumns) {
      if (!liveColumns.has(col)) {
        missingColumns.push({ table, column: col });
      }
    }
  }

  missingTables.sort();
  missingColumns.sort((a, b) => {
    if (a.table === b.table) {
      return a.column.localeCompare(b.column);
    }
    return a.table.localeCompare(b.table);
  });

  return { missingTables, missingColumns };
}

async function main() {
  const databaseUrl = process.argv[2] || process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Usage: node ctf/scripts/report-live-schema-drift.mjs [DATABASE_URL]');
    console.error('Or set DATABASE_URL in your environment.');
    process.exit(2);
  }

  const schemaSql = readFileSync(SCHEMA_PATH, 'utf8');
  const expected = parseSchema(schemaSql);
  const live = await getLiveSchema(databaseUrl);

  const { missingTables, missingColumns } = compareSchemas(expected, live);

  console.log('=== Live DB Schema Drift Report ===\n');
  console.log(`Expected tables (ctf/schema.sql): ${expected.size}`);
  console.log(`Live public tables:               ${live.size}`);
  console.log('');

  console.log('Missing tables in live DB:\n');
  if (missingTables.length === 0) {
    console.log('  none\n');
  } else {
    for (const table of missingTables) {
      console.log(`  - ${table}`);
    }
    console.log('');
  }

  console.log('Missing columns in live DB:\n');
  if (missingColumns.length === 0) {
    console.log('  none\n');
  } else {
    for (const item of missingColumns) {
      console.log(`  - ${item.table}.${item.column}`);
    }
    console.log('');
  }

  const totalIssues = missingTables.length + missingColumns.length;
  console.log('Summary:');
  console.log(`  missing tables:  ${missingTables.length}`);
  console.log(`  missing columns: ${missingColumns.length}`);
  console.log(`  total issues:    ${totalIssues}`);

  process.exit(totalIssues === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('Failed to run schema drift report.');
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
