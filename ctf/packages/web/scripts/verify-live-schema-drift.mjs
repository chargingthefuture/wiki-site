#!/usr/bin/env node
/* eslint-env node */

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const { console, process } = globalThis;

function main() {
  if (!process.env.DATABASE_URL) {
    console.log('Skipping live schema drift check: DATABASE_URL is not set.');
    return;
  }

  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const reportScript = resolve(scriptDir, '../../../scripts/report-live-schema-drift.mjs');

  console.log('Running live schema drift check against DATABASE_URL...');

  const result = spawnSync(process.execPath, [reportScript], {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

main();
