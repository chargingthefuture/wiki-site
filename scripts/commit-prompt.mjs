#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import process from 'node:process';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
];

function exitOnCtrlC() {
  process.stdout.write('\nCommit canceled.\n');
  process.exit(130);
}

process.on('SIGINT', exitOnCtrlC);

const rl = readline.createInterface({ input: stdin, output: stdout });

async function askType() {
  console.log('Available types:');
  for (const [index, type] of TYPES.entries()) {
    console.log(`${index + 1}) ${type}`);
  }

  while (true) {
    const value = (await rl.question('Type (number or name): ')).trim();
    const normalized = value.toLowerCase();
    const numericChoice = Number.parseInt(value, 10);

    if (Number.isInteger(numericChoice) && numericChoice >= 1 && numericChoice <= TYPES.length) {
      return TYPES[numericChoice - 1];
    }

    const typeMatch = TYPES.find((type) => type.toLowerCase() === normalized);
    if (typeMatch) {
      return typeMatch;
    }

    console.log(`Invalid type. Use 1-${TYPES.length} or one of: ${TYPES.join(', ')}`);
  }
}

async function askRequiredSummary() {
  while (true) {
    const summary = (await rl.question('Summary (required): ')).trim();

    if (summary.length > 0) {
      return summary;
    }

    console.log('Summary is required.');
  }
}

function ensureStagedChanges() {
  const result = spawnSync('git', ['diff', '--cached', '--quiet'], {
    stdio: 'inherit',
  });

  if (result.status === 0) {
    console.error('No staged changes found. Stage files first with git add, then run pnpm commit.');
    process.exit(1);
  }

  if (result.status !== 1) {
    process.exit(result.status ?? 1);
  }
}

function confirmYes(value) {
  const normalized = value.trim().toLowerCase();
  return normalized === '' || normalized === 'y' || normalized === 'yes';
}

async function main() {
  try {
    ensureStagedChanges();

    const type = await askType();
    const summary = await askRequiredSummary();

    const header = `${type}: ${summary}`;

    console.log('\nPreview:');
    console.log(header);

    const confirm = await rl.question('\nCreate commit? (Y/n): ');

    if (!confirmYes(confirm)) {
      console.log('Commit canceled.');
      process.exit(0);
    }

    const args = ['commit', '-m', header];

    const result = spawnSync('git', args, {
      stdio: 'inherit',
    });

    process.exit(result.status ?? 1);
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
