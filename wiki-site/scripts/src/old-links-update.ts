/**
 * Records a Quora ban and/or a new handle on the living page old-links-new-links.md, so updating it
 * does not need anybody to hand-write the same sentences again (owner request, 2026-11-02). Run by
 * the "Old links — record a ban or a new handle" workflow, from the GitHub app on a phone; it also
 * runs locally.
 *
 *   pnpm wiki:old-links apply --banned "Oct 27, 2026 at 4:39:57 AM"
 *   pnpm wiki:old-links apply --handle https://www.quora.com/profile/Name --opened "Oct 27, 2026 at 9:34:43 AM"
 *   pnpm wiki:old-links apply --banned "..." --handle ... --opened "..."    (both: the ban first)
 *   pnpm wiki:old-links place                                             (after wiki:sync)
 *
 * Times are the owner's wall clock, Eastern, exactly as the Quora email shows them. Seconds are read
 * and dropped: the page states times to the minute, and its durations are counted from those minutes.
 *
 * apply: --banned moves the open handle to the dead list with its ban time and how long it lasted.
 * --handle/--opened makes a new handle the open one; there must be none open (record the ban first,
 * or pass both). Then the counts go up, the page's date moves to today (Eastern), every sentence that
 * names the open handle is rewritten, and an update paste is added to QUORA_PASTE_SHEET.txt. With
 * --paste-out the update paste is also written to that file, for the workflow's run summary.
 *
 * place: moves the page's entry in QUORA_PASTE_SHEET.txt to where /feed shows the page. Run it after
 * wiki:sync, which is where the new date takes effect.
 *
 * The handle is written exactly as given (CLAUDE.md: never change a handle or a URL).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { feedOrder, feedKey } from './feed-order.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(__dirname, '../..');
const PAGE = resolve(WIKI_ROOT, 'content/posts/old-links-new-links.md');
const SHEET = resolve(WIKI_ROOT, 'QUORA_PASTE_SHEET.txt');
const PAGE_KEY = 'wiki-site/old-links-new-links';
const PAGE_URL = 'https://chargingthefuture.github.io/chargingthefuture/article/wiki-site/old-links-new-links';
const FEED_URL = 'https://chargingthefuture.github.io/chargingthefuture/feed.xml';
const SPACE_URL = 'https://skillseconomy.quora.com';
const TZ = 'America/New_York';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ---- numbers as words -------------------------------------------------------------------------

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function words(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 999) throw new Error(`no words for ${n}`);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '');
  return `${ONES[Math.floor(n / 100)]} hundred` + (n % 100 ? ` ${words(n % 100)}` : '');
}

const WORD_VALUES = new Map(Array.from({ length: 1000 }, (_, n) => [words(n), n]));
function number(text: string): number {
  const n = WORD_VALUES.get(text.toLowerCase());
  if (n === undefined) throw new Error(`"${text}" is not a number this script can read`);
  return n;
}

export function ordinal(n: number): string {
  const w = words(n);
  const irregular: Record<string, string> = { one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth' };
  const m = /^(.*?)([a-z]+)$/.exec(w)!;
  const last = m[2];
  const next = irregular[last] ?? (last.endsWith('y') ? `${last.slice(0, -1)}ieth` : `${last}th`);
  return m[1] + next;
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const plural = (n: number, unit: string) => `${words(n)} ${unit}${n === 1 ? '' : 's'}`;

// ---- times ------------------------------------------------------------------------------------

/** A wall-clock moment in Eastern time, to the minute. `at` is its UTC instant, for durations. */
type Moment = { y: number; mo: number; d: number; h: number; mi: number; at: number };

function easternOffsetMinutes(utc: number): number {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date(utc)).map((p) => [p.type, p.value]));
  const wall = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return Math.round((wall - Math.floor(utc / 60000) * 60000) / 60000);
}

function moment(y: number, mo: number, d: number, h: number, mi: number): Moment {
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  let at = wall - easternOffsetMinutes(wall) * 60000;
  at = wall - easternOffsetMinutes(at) * 60000;
  return { y, mo, d, h, mi, at };
}

/** "Oct 27, 2026 at 4:39:57 AM" (as the email shows it) or "2026-10-27 04:39" / "2026-10-27 4:39 AM". */
export function parseInput(text: string): Moment {
  const t = text.replace(/[  \s]+/g, ' ').trim();
  let m = /^([A-Za-z]{3,9})\.? (\d{1,2}),? (\d{4})(?:,? at)?,? (\d{1,2}):(\d{2})(?::\d{2})? ?([AaPp])\.?[Mm]\.?$/.exec(t);
  if (m) {
    const mo = MONTHS.findIndex((name) => name.toLowerCase().startsWith(m![1].toLowerCase().slice(0, 3))) + 1;
    if (mo === 0) throw new Error(`unknown month in "${text}"`);
    return moment(+m[3], mo, +m[2], to24(+m[4], m[6].toLowerCase() === 'p'), +m[5]);
  }
  m = /^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})(?::\d{2})?(?: ?([AaPp])\.?[Mm]\.?)?$/.exec(t);
  if (m) return moment(+m[1], +m[2], +m[3], m[6] ? to24(+m[4], m[6].toLowerCase() === 'p') : +m[4], +m[5]);
  throw new Error(`cannot read the time "${text}". Paste it as the email shows it, e.g. "Oct 27, 2026 at 4:39:57 AM".`);
}

function to24(h: number, pm: boolean): number {
  if (h < 1 || h > 12) throw new Error(`hour ${h} is not on a 12-hour clock`);
  return (h % 12) + (pm ? 12 : 0);
}

type Period = 'morning' | 'afternoon' | 'evening' | 'night';
function period(h: number): Period {
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}
const clock = (m: Moment) => `${m.h % 12 === 0 ? 12 : m.h % 12}:${String(m.mi).padStart(2, '0')}`;
/** "4:30 in the morning", "10:55 at night". */
const timeOfDay = (m: Moment) => `${clock(m)} ${period(m.h) === 'night' ? 'at night' : `in the ${period(m.h)}`}`;
const dayMonth = (m: Moment) => `${MONTHS[m.mo - 1]} ${m.d}`;
const fullDate = (m: Moment) => `${dayMonth(m)}, ${m.y}`;
const sameDay = (a: Moment, b: Moment) => a.y === b.y && a.mo === b.mo && a.d === b.d;
function nextDay(a: Moment, b: Moment): boolean {
  const t = new Date(Date.UTC(a.y, a.mo - 1, a.d + 1));
  return t.getUTCFullYear() === b.y && t.getUTCMonth() + 1 === b.mo && t.getUTCDate() === b.d;
}

/** Reads a time back out of the page: "4:30 in the morning" and "October 25, 2026". */
function parsePage(time: string, date: string): Moment {
  const t = /^(\d{1,2}):(\d{2}) (?:in the (morning|afternoon|evening)|at (night))$/.exec(time);
  const d = /^([A-Z][a-z]+) (\d{1,2}), (\d{4})$/.exec(date);
  if (!t || !d) throw new Error(`cannot read "${time} on ${date}" on the page`);
  const p = t[3] ?? t[4];
  const h12 = +t[1];
  const h = p === 'morning' ? h12 % 12 : p === 'night' && h12 === 12 ? 0 : (h12 % 12) + 12;
  return moment(+d[3], MONTHS.indexOf(d[1]) + 1, +d[2], h, +t[2]);
}

const minutesBetween = (a: Moment, b: Moment) => Math.round((b.at - a.at) / 60000);

/** How long a handle lasted, as the page has always said it: "twenty-six minutes", "just over forty hours". */
export function duration(m: number): string {
  if (m < 0) throw new Error('the ban is earlier than the opening');
  if (m === 0) return 'under a minute';
  if (m < 60) return plural(m, 'minute');
  if (m < 600) {
    const h = Math.floor(m / 60);
    return m % 60 ? `${plural(h, 'hour')} and ${plural(m % 60, 'minute')}` : plural(h, 'hour');
  }
  if (m < 72 * 60) {
    const h = Math.floor(m / 60);
    const r = m % 60;
    if (r === 0) return `${words(h)} hours`;
    if (r <= 20) return `just over ${words(h)} hours`;
    if (r < 40) return `${words(h)} and a half hours`;
    return `just under ${words(h + 1)} hours`;
  }
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  if (h === 0) return `${words(d)} days`;
  if (h <= 2) return `just over ${words(d)} days`;
  if (h >= 22) return `just under ${words(d + 1)} days`;
  return `${words(d)} days and ${plural(h, 'hour')}`;
}

/** A rounded gap for the summary lines: "fourteen minutes", "three hours", "an hour". */
function roughly(m: number): string {
  if (m < 60) return m === 0 ? 'under a minute' : plural(m, 'minute');
  if (m < 48 * 60) {
    const h = Math.round(m / 60);
    return h === 1 ? 'an hour' : `${words(h)} hours`;
  }
  return `${words(Math.round(m / 1440))} days`;
}

/** When the ban landed, said relative to the opening as the dead list says it. */
function banAt(opened: Moment, banned: Moment): string {
  if (sameDay(opened, banned)) return `${clock(banned)} that ${period(banned.h)}`;
  if (nextDay(opened, banned)) return `${clock(banned)} the next ${period(banned.h)}`;
  return `${timeOfDay(banned)} on ${fullDate(banned)}`;
}

function todayEastern(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

// ---- the page ---------------------------------------------------------------------------------

const PROFILE = 'https://www.quora.com/profile/';
const NUM = '[A-Za-z]+(?:[- ][a-z]+)*';

function replaceOnce(text: string, pattern: RegExp, replacement: string | ((...m: string[]) => string), what: string): string {
  const all = text.match(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'));
  if (!all || all.length !== 1) throw new Error(`the page has ${all?.length ?? 0} matches for ${what}; expected one. Has its wording changed?`);
  return text.replace(pattern, replacement as string);
}

type Open = { kind: 'open'; url: string; name: string; opened: Moment; gap: string };
type None = { kind: 'none'; name: string; banned: Moment };

function readState(page: string): Open | None {
  const open = new RegExp(`^The handle: (${PROFILE.replace(/[./]/g, '\\$&')}(\\S+)) — opened at (.+?) on ([A-Z][a-z]+ \\d{1,2}, \\d{4}), (.+?)\\.$`, 'm').exec(page);
  if (open) return { kind: 'open', url: open[1], name: open[2], opened: parsePage(open[3], open[4]), gap: open[5] };
  const none = /^The handle: none open right now\. (\S+) was banned at (.+?) on ([A-Z][a-z]+ \d{1,2}, \d{4}), and the next handle goes here when it opens\.$/m.exec(page);
  if (none) return { kind: 'none', name: none[1], banned: parsePage(none[2], none[3]) };
  throw new Error('cannot find the "The handle:" line on the page');
}

function count(page: string, pattern: RegExp, what: string): number {
  const m = pattern.exec(page);
  if (!m) throw new Error(`cannot find ${what} on the page`);
  return number(m[1]);
}

type Result = { page: string; paste: string; title: string };

export function apply(page: string, opts: { banned?: Moment; url?: string; opened?: Moment; today: string; seed?: number }): Result {
  let state = readState(page);
  const paragraphs: string[] = [];
  let bannedName: string | undefined;
  let latestBan: Moment | undefined;
  let total = count(page, new RegExp(`^Quora has erased my accounts (${NUM}) times\\. Each`, 'm'), 'the opening count');
  let since = count(page, new RegExp(`(${NUM}) of those came after October 1\\.`), 'the count since October 1');
  let more = count(page, new RegExp(`^Then (${NUM}) more, in the order`, 'm'), 'the "Then N more" count');
  let sincePage = count(page, new RegExp(`that has happened (${NUM}) times\\.`), 'the closing count');

  if (opts.banned) {
    if (state.kind !== 'open') throw new Error(`no handle is open on the page (${state.name} was already recorded as banned), so there is nothing to ban`);
    const lasted = minutesBetween(state.opened, opts.banned);
    const entry = `${state.url} — opened at ${timeOfDay(state.opened)} on ${fullDate(state.opened)}, ${state.gap}, and banned by Quora Moderation at ${banAt(state.opened, opts.banned)}. ${cap(duration(lasted))}.`;
    page = replaceOnce(page, /\n\n## Different every time, same label\n/, `\n\n${entry}\n\n## Different every time, same label\n`, 'the heading after the dead list');
    total += 1; since += 1; more += 1; sincePage += 1;
    paragraphs.push(`${state.name} is gone, the ${ordinal(total)} account Quora has erased and the ${ordinal(since)} since October 1. It opened at ${timeOfDay(state.opened)} on ${dayMonth(state.opened)}, and Quora Moderation banned it at ${timeOfDay(opts.banned)} on ${dayMonth(opts.banned)}, ${duration(lasted)} later.`);
    bannedName = state.name;
    latestBan = opts.banned;
    state = { kind: 'none', name: state.name, banned: opts.banned };
  }

  if (opts.url || opts.opened) {
    if (!opts.url || !opts.opened) throw new Error('a new handle needs both its address and the time it was opened');
    if (state.kind !== 'none') throw new Error(`${state.name} is still open on the page. Record its ban first, or pass the ban and the new handle together.`);
    if (!opts.url.startsWith(PROFILE)) throw new Error(`the handle should be a Quora profile address (${PROFILE}...), got "${opts.url}"`);
    const gap = minutesBetween(state.banned, opts.opened);
    if (gap < 0) throw new Error('the new handle was opened before the last ban');
    const name = opts.url.slice(PROFILE.length).replace(/\/+$/, '');
    latestBan ??= state.banned;
    const opened: Open = { kind: 'open', url: opts.url, name, opened: opts.opened, gap: `${duration(gap)} after ${state.name} was banned` };
    paragraphs.push(bannedName
      ? `The handle open now is ${opts.url}, opened at ${timeOfDay(opts.opened)} on ${dayMonth(opts.opened)}. It is my only account on Quora. If another profile carries my name and is not on the standing record, it is not me.`
      : `The handle open now is ${opts.url}, opened at ${timeOfDay(opts.opened)} on ${dayMonth(opts.opened)}, ${duration(gap)} after ${state.name} was banned. It is my only account on Quora. If another profile carries my name and is not on the standing record, it is not me.`);
    state = opened;
  } else if (!opts.banned) {
    throw new Error('nothing to record: pass --banned, or --handle with --opened, or both');
  } else {
    paragraphs.push('No handle of mine is open on Quora right now. When the next one opens, the standing record names it. If a profile carries my name and is not on that record, it is not me.');
  }

  // Every sentence that names the open handle or the counts, rewritten from the new state.
  const ban = latestBan!;
  const isOpen = state.kind === 'open';
  const gapRough = isOpen ? roughly(minutesBetween(ban, (state as Open).opened)) : '';
  page = replaceOnce(page, /^date: "\d{4}-\d{2}-\d{2}"$/m, `date: "${opts.today}"`, 'the date');
  page = replaceOnce(page, /^excerpt: ".+? What is live/m,
    `excerpt: "${cap(words(total))} accounts erased, ${words(since)} of them since October 1, ${isOpen ? `and ${state.name} is the handle open now.` : `the latest at ${timeOfDay(ban)} on ${dayMonth(ban)}.`} What is live`, 'the excerpt');
  page = replaceOnce(page, new RegExp(`Quora has erased my accounts ${NUM} times, and every link`), `Quora has erased my accounts ${words(total)} times, and every link`, 'the teaser count');
  page = replaceOnce(page, new RegExp(`${NUM} of those came after October 1\\. The latest ban landed at .+?, and (?:the handle now open was opened .+? later|no handle is open yet)\\.`),
    `${cap(words(since))} of those came after October 1. The latest ban landed at ${timeOfDay(ban)} on ${dayMonth(ban)}, and ${isOpen ? `the handle now open was opened ${gapRough} later` : 'no handle is open yet'}.`, 'the teaser');
  page = replaceOnce(page, new RegExp(`^Quora has erased my accounts ${NUM} times\\. Each`, 'm'), `Quora has erased my accounts ${words(total)} times. Each`, 'the opening count');
  if (isOpen) {
    const s = state as Open;
    const when = period(s.opened.h) === 'night' ? `late on the night of ${fullDate(s.opened)}` : `in the ${period(s.opened.h)} of ${fullDate(s.opened)}`;
    page = replaceOnce(page, /^There is (?:one handle of mine on Quora|no handle of mine open on Quora right now)[^\n]*$/m,
      `There is one handle of mine on Quora, opened ${when}, ${gapRough} after the ban before it. Everything before it is dead.`, 'the line under the opening');
    page = replaceOnce(page, /^The handle: .+$/m, `The handle: ${s.url} — opened at ${timeOfDay(s.opened)} on ${fullDate(s.opened)}, ${s.gap}.`, 'the handle line');
  } else {
    page = replaceOnce(page, /^There is (?:one handle of mine on Quora|no handle of mine open on Quora right now)[^\n]*$/m,
      `There is no handle of mine open on Quora right now. The last one was banned at ${timeOfDay(ban)} on ${fullDate(ban)}, and everything before it is dead.`, 'the line under the opening');
    page = replaceOnce(page, /^The handle: .+$/m, `The handle: none open right now. ${state.name} was banned at ${timeOfDay(ban)} on ${fullDate(ban)}, and the next handle goes here when it opens.`, 'the handle line');
  }
  page = replaceOnce(page, new RegExp(`^Then ${NUM} more, in the order`, 'm'), `Then ${words(more)} more, in the order`, 'the "Then N more" count');
  page = replaceOnce(page, new RegExp(`that has happened ${NUM} times\\. The list above is current, and .+? is the entry waiting to move onto it\\.`),
    `that has happened ${words(sincePage)} times. The list above is current, and ${isOpen ? state.name : 'the next handle, once it opens,'} is the entry waiting to move onto it.`, 'the closing line');

  // The update paste. Its last line rotates with the number of update pastes already in the sheet
  // (seed), so two pastes in a row never end the same way.
  const closers = [
    `Quora only ever gets a short version and a link back, so a ban takes no post with it. All of them are in the blog's feed: ${FEED_URL}`,
    `Nothing Quora removes is the only copy. Every post is on the blog first, and its feed carries all of them: ${FEED_URL}`,
    `Every post is still on the blog, because Quora only ever gets a short version and a link back. The feed carries all of it with no handle to chase: ${FEED_URL}`,
  ];
  const title = isOpen ? `the handle open now is ${state.name}` : `${bannedName} erased`;
  const paste = [`UPDATE · ${opts.today} · Old links, new links — ${title}`, ...paragraphs, `The space is where it was: ${SPACE_URL}`, closers[(opts.seed ?? total) % closers.length], `Full post: ${PAGE_URL}`].join('\n\n');
  return { page, paste, title };
}

// ---- the paste sheet --------------------------------------------------------------------------

function addUpdatePaste(sheet: string, paste: string): string {
  const header = /^UPDATE PASTES\n(=+)\n\n/m.exec(sheet);
  if (!header) throw new Error('QUORA_PASTE_SHEET.txt has no UPDATE PASTES section');
  const rule = '-'.repeat(header[1].length);
  const at = header.index + header[0].length;
  return `${sheet.slice(0, at)}${paste}\n\n${rule}\n\n${sheet.slice(at)}`;
}

/** Moves a page's entry in the hand-written sheet to where /feed shows the page. */
export function place(sheet: string, key: string, order: string[]): string {
  const lines = sheet.split('\n');
  const end = lines.indexOf('UPDATE PASTES');
  const isRule = (l: string) => /^=+$/.test(l);
  const fullPost = (k: string) => `Full post: https://chargingthefuture.github.io/chargingthefuture/article/${k}`;
  const blockOf = (k: string): [number, number] | undefined => {
    const at = lines.findIndex((l, i) => (end === -1 || i < end) && l === fullPost(k));
    if (at === -1) return undefined;
    let start = at;
    while (start > 0 && !isRule(lines[start])) start--;
    let stop = at + 1;
    while (stop < lines.length && !isRule(lines[stop])) stop++;
    return [start, stop];
  };
  const own = blockOf(key);
  if (!own) throw new Error(`QUORA_PASTE_SHEET.txt has no entry for ${key}`);
  const block = lines.splice(own[0], own[1] - own[0]);
  const below = order.slice(order.indexOf(key) + 1).map(blockOf).find(Boolean);
  if (!below) throw new Error(`no page below ${key} on /feed has a sheet entry`);
  lines.splice(below[0], 0, ...block);
  return lines.join('\n');
}

// ---- command line -----------------------------------------------------------------------------

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  const v = i === -1 ? undefined : process.argv[i + 1]?.trim();
  // An empty workflow input can arrive as nothing at all, leaving the next flag in its place.
  return v && !v.startsWith('--') ? v : undefined;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const command = process.argv.slice(2).find((a) => a !== '--');
  try {
    if (command === 'apply') {
      const banned = arg('banned');
      const opened = arg('opened');
      const sheet = readFileSync(SHEET, 'utf8');
      const result = apply(readFileSync(PAGE, 'utf8'), {
        seed: (sheet.match(/^UPDATE · \S+ · Old links, new links/gm) ?? []).length,
        banned: banned ? parseInput(banned) : undefined,
        url: arg('handle'),
        opened: opened ? parseInput(opened) : undefined,
        today: arg('date') ?? todayEastern(),
      });
      writeFileSync(PAGE, result.page);
      writeFileSync(SHEET, addUpdatePaste(sheet, result.paste));
      const out = arg('paste-out');
      if (out) writeFileSync(out, `${result.paste}\n`);
      const titleOut = arg('title-out');
      if (titleOut) writeFileSync(titleOut, `${result.title}\n`);
      console.log(`✓ old-links-new-links.md: ${result.title}\n\n${result.paste}`);
    } else if (command === 'place') {
      const order = feedOrder(WIKI_ROOT).map(feedKey);
      writeFileSync(SHEET, place(readFileSync(SHEET, 'utf8'), arg('key') ?? PAGE_KEY, order));
      console.log('✓ QUORA_PASTE_SHEET.txt: entry placed where /feed shows it');
    } else {
      throw new Error('usage: old-links-update.ts apply [--banned TIME] [--handle URL --opened TIME] [--date YYYY-MM-DD] | place [--key repo/slug]');
    }
  } catch (e) {
    console.error(`✗ ${(e as Error).message}`);
    process.exit(1);
  }
}
