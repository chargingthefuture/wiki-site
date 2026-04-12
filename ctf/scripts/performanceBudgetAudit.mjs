#!/usr/bin/env node
/* eslint-env node */
/* global console, process */

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    budgetFile: 'config/performance-budgets.json',
    mode: process.env.PERF_BUDGET_MODE || 'warn',
    output: process.env.PERF_BUDGET_OUTPUT_PATH || '',
  };

  for (const arg of argv) {
    if (arg.startsWith('--budget-file=')) {
      args.budgetFile = arg.slice('--budget-file='.length);
    } else if (arg.startsWith('--mode=')) {
      args.mode = arg.slice('--mode='.length);
    } else if (arg.startsWith('--output=')) {
      args.output = arg.slice('--output='.length);
    }
  }

  return args;
}

function listFilesRecursively(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const stack = [rootDir];
  const files = [];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function listFilesInExistingDirs(rootDirs) {
  let files = [];
  for (const dir of rootDirs) {
    if (!fs.existsSync(dir)) {
      continue;
    }
    files = files.concat(listFilesRecursively(dir));
  }
  return files;
}

function sumBytesForExtensions(files, extensions) {
  let total = 0;
  for (const file of files) {
    if (!extensions.some((ext) => file.endsWith(ext))) {
      continue;
    }
    total += fs.statSync(file).size;
  }
  return total;
}

function sumBytesForAll(files) {
  return files.reduce((total, file) => total + fs.statSync(file).size, 0);
}

function formatBytes(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function classify(value, warningMax, blockMax) {
  if (value > blockMax) {
    return 'blocked';
  }
  if (value > warningMax) {
    return 'warning';
  }
  return 'ok';
}

function addResult(results, metric, value, warningMax, blockMax) {
  const status = classify(value, warningMax, blockMax);
  results.push({
    metric,
    value,
    warningMax,
    blockMax,
    status,
  });
}

function toMarkdown(results, mode, budgetFile) {
  const lines = [];
  lines.push('## Performance Budget Audit');
  lines.push('');
  lines.push(`- Mode: **${mode}**`);
  lines.push(`- Budget file: **${budgetFile}**`);
  lines.push('');
  lines.push('| Metric | Value | Warning max | Block max | Status |');
  lines.push('|---|---:|---:|---:|---|');

  for (const result of results) {
    lines.push(
      `| ${result.metric} | ${formatBytes(result.value)} | ${formatBytes(result.warningMax)} | ${formatBytes(result.blockMax)} | ${result.status} |`,
    );
  }

  return `${lines.join('\n')}\n`;
}

function writeOutput(outputPath, payload) {
  if (!outputPath) {
    return;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf8');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const budgetPath = path.resolve(cwd, args.budgetFile);

  if (!fs.existsSync(budgetPath)) {
    console.error(`Budget file not found: ${budgetPath}`);
    process.exit(1);
  }

  const budgets = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
  const mode = args.mode === 'block' ? 'block' : 'warn';

  const webDir = path.resolve(cwd, budgets.web.nextBuildDir);
  const androidDir = path.resolve(cwd, budgets.android.exportDir);

  const results = [];
  const notes = [];

  if (!fs.existsSync(webDir)) {
    notes.push(`Web build directory missing: ${budgets.web.nextBuildDir}. Run web build first.`);
  } else {
    const webClientDir = path.join(webDir, 'static');
    const webFiles = listFilesInExistingDirs([webClientDir]);

    if (webFiles.length === 0) {
      notes.push(`Web client assets missing under: ${path.relative(cwd, webClientDir)}.`);
    }

    const webJsBytes = sumBytesForExtensions(webFiles, ['.js']);
    const webCssBytes = sumBytesForExtensions(webFiles, ['.css']);

    addResult(
      results,
      'web.jsBytes',
      webJsBytes,
      budgets.web.budgets.jsBytes.warningMax,
      budgets.web.budgets.jsBytes.blockMax,
    );

    addResult(
      results,
      'web.cssBytes',
      webCssBytes,
      budgets.web.budgets.cssBytes.warningMax,
      budgets.web.budgets.cssBytes.blockMax,
    );
  }

  if (!fs.existsSync(androidDir)) {
    notes.push(`Android export directory missing: ${budgets.android.exportDir}. Run android build first.`);
  } else {
    const androidFiles = listFilesRecursively(androidDir);
    const androidTotalBytes = sumBytesForAll(androidFiles);
    const androidJsBytes = sumBytesForExtensions(androidFiles, ['.js', '.hbc']);

    addResult(
      results,
      'android.totalBytes',
      androidTotalBytes,
      budgets.android.budgets.totalBytes.warningMax,
      budgets.android.budgets.totalBytes.blockMax,
    );

    addResult(
      results,
      'android.jsBundleBytes',
      androidJsBytes,
      budgets.android.budgets.jsBundleBytes.warningMax,
      budgets.android.budgets.jsBundleBytes.blockMax,
    );
  }

  const hasBlocked = results.some((result) => result.status === 'blocked');
  const hasWarning = results.some((result) => result.status === 'warning');
  const status = hasBlocked ? 'blocked' : hasWarning ? 'warning' : 'ok';

  const markdown = toMarkdown(results, mode, args.budgetFile);
  process.stdout.write(markdown);

  if (notes.length > 0) {
    process.stdout.write('\nNotes:\n');
    for (const note of notes) {
      process.stdout.write(`- ${note}\n`);
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    mode,
    status,
    notes,
    budgetFile: args.budgetFile,
    results,
    markdown,
  };

  writeOutput(args.output, payload);

  if (mode === 'block' && hasBlocked) {
    process.exit(2);
  }

  process.exit(0);
}

main();
