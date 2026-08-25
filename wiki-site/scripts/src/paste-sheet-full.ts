#!/usr/bin/env node
/**
 * Generates QUORA_PASTE_SHEET_FULL.txt — the whole text of each post, converted
 * to something that survives being pasted into Quora's editor.
 *
 * The other paste sheet holds one short summary per page. This one holds the
 * posts themselves, for when the whole thing should go up rather than a teaser.
 *
 * Scope: posts dated 2026-08-16 and later. That is the day Quora banned the
 * farah-brunache account and the day the blog became the source everything else
 * copies from, so it is where the writing becomes uniform in shape and quality.
 * Earlier posts were written under a different arrangement and are not included.
 *
 * Quora's editor does not read markdown. Pasted raw, "## Heading" shows its
 * hashes and "[text](url)" shows its brackets. So:
 *
 *   headings      lose their hashes and stand as their own line
 *   links         become  text (url)  — the same form the blog uses for credits,
 *                 which stays readable after the address dies
 *   images        become their alt text, because in credited posts the alt text
 *                 carries the quoted words and dropping it would drop the credit
 *   blockquotes   lose their marker
 *   bullets       keep theirs, which reads correctly as-is
 *   bold/italic   lose their asterisks and underscores; the words stay
 *   paragraphs    are unwrapped onto one line each, because Quora treats every
 *                 newline as a paragraph break and the source is hard-wrapped
 *
 * Usage:  pnpm wiki:paste-full
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontMatter } from './frontmatter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(__dirname, '../..');
const POSTS_DIR = join(WIKI_ROOT, 'content/posts');
const OUT = join(WIKI_ROOT, 'QUORA_PASTE_SHEET_FULL.txt');
const SITE = 'https://chargingthefuture.github.io/chargingthefuture/article/wiki-site';
const FROM = '2026-08-16';

function toPasteable(markdown: string): string {
  let body = markdown;
  body = body.replace(/^---\n[\s\S]*?\n---\n/, '');
  // Images carry their alt text through. In credited posts that is the quoted
  // material, so silently dropping the image would drop somebody's words.
  body = body.replace(/!\[([^\]]*)\]\([^)]*\)/g, (_m, alt: string) =>
    alt.trim() ? `[Screenshot — ${alt.trim()}]` : '',
  );
  body = body.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
  body = body.replace(/^#{1,6}\s*/gm, '');
  // Bold and italic markers paste literally — Quora's editor does not read
  // them, so **One.** shows its asterisks. The words stay, the markers go.
  body = body.replace(/\*\*([^*\n]+)\*\*/g, '$1');
  body = body.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/gm, '$1$2');
  body = body.replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,;:!?]|$)/gm, '$1$2');
  body = body.replace(/^>\s?/gm, '');
  body = body.replace(/\n{3,}/g, '\n\n');
  return unwrapParagraphs(body).trim();
}

/**
 * The markdown files are hard-wrapped for reading in a diff. Quora's editor
 * treats every newline as a paragraph break, so a wrapped paragraph pastes as
 * one short paragraph per source line, splitting sentences mid-clause.
 *
 * So each paragraph becomes a single long line. What must stay on its own line
 * stays: a list item, a table row, and anything inside a fenced code block.
 */
function unwrapParagraphs(body: string): string {
  const isListItem = (line: string) => /^\s*(?:[-*+]\s|\d+[.)]\s)/.test(line);
  const isTableRow = (line: string) => /^\s*\|/.test(line);
  // A table's |---|---| separator is markdown punctuation and nothing else, so
  // it would paste as a row of dashes.
  const isTableRule = (line: string) => /^\s*\|[\s|:-]*\|\s*$/.test(line);

  return body
    .split(/\n{2,}/)
    .map((block) => {
      if (block.trimStart().startsWith('```')) return block;

      const out: string[] = [];
      for (const line of block.split('\n')) {
        if (isTableRule(line)) continue;
        if (out.length === 0 || isListItem(line) || isTableRow(line) || isTableRow(out[out.length - 1])) {
          out.push(line.trimEnd());
          continue;
        }
        // A continuation line: fold it back onto the line it was wrapped from.
        out[out.length - 1] = `${out[out.length - 1]} ${line.trim()}`;
      }
      return out.join('\n');
    })
    .join('\n\n');
}

function main() {
  const files = readdirSync(POSTS_DIR).filter((f) => f.toLowerCase().endsWith('.md'));

  const entries = files
    .map((file) => {
      const raw = readFileSync(join(POSTS_DIR, file), 'utf8');
      const { meta } = parseFrontMatter(raw);
      return { file, meta, raw };
    })
    .filter((e) => e.meta?.date && String(e.meta.date) >= FROM)
    .sort((a, b) => {
      const d = String(b.meta!.date).localeCompare(String(a.meta!.date));
      return d !== 0 ? d : a.file.localeCompare(b.file);
    });

  const header = [
    'QUORA PASTE SHEET — FULL POSTS',
    '',
    'The whole text of each post, newest first, converted so it survives Quora\'s',
    'editor. The other sheet holds one short summary per page; this one holds the',
    'posts themselves, for when the whole thing should go up rather than a teaser.',
    '',
    'Starts at 2026-08-16 — the day Quora banned the farah-brunache account and the',
    'day this blog became the source that platforms copy from. Everything from that',
    'day forward was written under one arrangement, which is why it starts there.',
    '',
    'Generated by `pnpm wiki:paste-full`. Do not hand-edit — edit the post and',
    'regenerate, or the two will disagree and the post is the one that is right.',
    '',
    `${entries.length} posts.`,
    '',
  ].join('\n');

  const blocks = entries.map((e) => {
    const slug = e.meta!.slug || e.file.replace(/\.md$/i, '');
    const url = `${SITE}/${encodeURIComponent(slug)}`;
    return [
      '='.repeat(78),
      `${e.meta!.date} · ${e.meta!.title}`,
      '',
      toPasteable(e.raw),
      '',
      `Full post: ${url}`,
      '',
    ].join('\n');
  });

  writeFileSync(OUT, `${header}\n${blocks.join('\n')}`, 'utf8');
  console.log(`✓ Wrote ${entries.length} full posts → ${OUT}`);
}

main();
