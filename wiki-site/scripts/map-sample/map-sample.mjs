// Draws a worked sample: one goal, its place in the Skills Taxonomy, how many people on the
// skills map hold each skill, and the cards anyone could take. Writes a 1080x1350 PNG.
// Usage: node map-sample.mjs <case.json> <out.png>
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const here = dirname(fileURLToPath(import.meta.url));
const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('Usage: node map-sample.mjs <case.json> <out.png>');
  process.exit(1);
}
const c = JSON.parse(readFileSync(input, 'utf8'));
for (const key of ['goal', 'sector', 'jobTitle', 'skills', 'cards', 'asOf']) {
  if (!c[key] || (Array.isArray(c[key]) && !c[key].length)) throw new Error(`case.json needs "${key}"`);
}
if (c.skills.length > 4) throw new Error('At most 4 skills fit. Pick the 4 the goal needs most.');
if (c.cards.length > 3) throw new Error('At most 3 cards fit.');

const W = 1080, H = 1350;
const C = {
  bg: '#1a1a1a', ink: '#e2e0d6', soft: '#9a978c', faint: '#5f5d56',
  lit: '#f2c46d', glow: '#ffb547', hearth: '#3a3a36', thread: '#2b2b29', card: '#232320', cardLine: '#3a3934',
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(text, size, width, maxLines) {
  const per = Math.max(8, Math.floor(width / (size * 0.53)));
  const words = String(text).split(/\s+/);
  const lines = [''];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if (!cur) lines[lines.length - 1] = w;
    else if ((cur + ' ' + w).length <= per) lines[lines.length - 1] = cur + ' ' + w;
    else lines.push(w);
  }
  if (lines.length > maxLines) throw new Error(`Too long to fit in ${maxLines} line(s): "${text}"`);
  return lines;
}
function text(lines, x, y, size, { fill = C.ink, family = 'DM Sans', weight = 400, anchor = 'start', lead = 1.22, spacing = 0 } = {}) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}">${lines
    .map((l, i) => `<tspan x="${x}" dy="${i ? size * lead : 0}">${esc(l)}</tspan>`)
    .join('')}</text>`;
}

// Seeded scatter of dark hearths, so the same case always draws the same country.
let seed = [...c.goal].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

const parts = [];
parts.push(`<rect width="${W}" height="${H}" fill="${C.bg}"/>`);
parts.push(`<defs>
  <filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="soft" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="4"/></filter>
</defs>`);

// Header
parts.push(text(['WORKED SAMPLE · DETAILS REMOVED'], 72, 96, 20, { fill: C.soft, weight: 600, spacing: 3 }));
parts.push(text(['The goal'], 72, 150, 24, { fill: C.lit, weight: 600 }));
const goalLines = wrap(c.goal, 60, W - 144, 2);
parts.push(text(goalLines, 72, 214, 60, { family: 'Oswald', weight: 500, lead: 1.1 }));

// Map field
const top = goalLines.length > 1 ? 330 : 280;
const goal = { x: 540, y: top + 70 }, sector = { x: 540, y: top + 190 }, job = { x: 540, y: top + 310 };
const skillY = top + 470;
const n = c.skills.length;
const skills = c.skills.map((s, i) => ({ ...s, x: Math.round(W / (n + 1) * (i + 1)), y: skillY }));

const dim = [];
for (let i = 0; i < 70; i++) {
  const p = { x: 40 + rnd() * (W - 80), y: top + 10 + rnd() * (skillY - top + 20) };
  const near = [goal, sector, job, ...skills].some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 70);
  const onLabel = [sector, job].some((q) => p.x > q.x + 20 && p.x < q.x + 460 && Math.abs(p.y - q.y) < 45);
  if (!near && !onLabel && p.y < skillY + 40) dim.push(p);
}
for (let i = 0; i < dim.length - 1; i += 3) {
  const a = dim[i], b = dim[i + 1];
  if (Math.hypot(a.x - b.x, a.y - b.y) < 220) parts.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${C.thread}" stroke-width="1.5"/>`);
}
for (const p of dim) parts.push(`<circle cx="${p.x}" cy="${p.y}" r="${3 + rnd() * 3}" fill="${C.hearth}"/>`);

const road = (a, b) => {
  const my = (a.y + b.y) / 2;
  const d = `M${a.x},${a.y} C${a.x},${my} ${b.x},${my} ${b.x},${b.y}`;
  return `<path d="${d}" fill="none" stroke="${C.glow}" stroke-width="10" opacity="0.25" filter="url(#soft)"/><path d="${d}" fill="none" stroke="${C.lit}" stroke-width="3"/>`;
};
parts.push(road(goal, sector), road(sector, job));
for (const s of skills) parts.push(road(job, s));

const hearth = (p, r, bright = 1) =>
  `<circle cx="${p.x}" cy="${p.y}" r="${r * 2.2}" fill="${C.glow}" opacity="${0.35 * bright}" filter="url(#glow)"/><circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${C.lit}"/>`;

// People on the skills map with the skill: one small lit point each, up to 24, around the skill.
for (const s of skills) {
  const shown = Math.min(Number(s.listed) || 0, 24);
  for (let k = 0; k < shown; k++) {
    const ang = (k / Math.max(shown, 1)) * Math.PI * 2 + rnd() * 0.4;
    const rad = 34 + (k % 3) * 11 + rnd() * 6;
    const p = { x: s.x + Math.cos(ang) * rad, y: s.y + Math.sin(ang) * rad * 0.75 };
    parts.push(`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.4" fill="${C.lit}" opacity="0.85"/>`);
  }
}
parts.push(hearth(goal, 20), hearth(sector, 13, 0.7), hearth(job, 13, 0.7));
for (const s of skills) parts.push(hearth(s, 11, 0.8));

const side = (p, label, value) =>
  text([label.toUpperCase()], p.x + 34, p.y - 8, 16, { fill: C.soft, weight: 600, spacing: 2 }) +
  text(wrap(value, 26, 420, 1), p.x + 34, p.y + 22, 26, { weight: 500 });
parts.push(text(['GOAL'], goal.x + 40, goal.y + 8, 18, { fill: C.lit, weight: 700, spacing: 3 }));
parts.push(side(sector, 'Sector', c.sector), side(job, 'Job title', c.jobTitle));

const colW = Math.min(230, W / (n + 1) + 40);
for (const s of skills) {
  const name = wrap(s.name, 22, colW, 2);
  parts.push(text(name, s.x, s.y + 84, 22, { anchor: 'middle', weight: 500 }));
  const count = s.listed == null ? 'not counted' : `${s.listed} on the skills map`;
  parts.push(text([count], s.x, s.y + 84 + name.length * 27 + 4, 18, { anchor: 'middle', fill: C.lit }));
}

// Cards
let y = skillY + 190;
parts.push(text(['Cards anyone can take, from a phone, in under half an hour'], 72, y, 22, { fill: C.soft, weight: 500 }));
y += 22;
for (const card of c.cards) {
  const lines = wrap(card, 24, W - 144 - 48, 2);
  const h = 30 + lines.length * 30;
  parts.push(`<rect x="72" y="${y}" width="${W - 144}" height="${h}" rx="14" fill="${C.card}" stroke="${C.cardLine}"/>`);
  parts.push(`<rect x="72" y="${y}" width="6" height="${h}" rx="3" fill="${C.lit}"/>`);
  parts.push(text(lines, 102, y + 40, 24, { lead: 1.25 }));
  y += h + 14;
}
if (y > H - 70) throw new Error('Cards run past the bottom. Shorten them.');

// Footer
const src = c.source || `Counts: people on the skills map who hold that skill, ${c.asOf}. Nobody is named.`;
parts.push(text(wrap(src, 18, W - 144, 2), 72, H - 56, 18, { fill: C.faint }));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join('')}</svg>`;
const png = new Resvg(svg, {
  fitTo: { mode: 'width', value: W },
  font: { fontFiles: [join(here, 'fonts/DMSans.ttf'), join(here, 'fonts/Oswald.ttf')], loadSystemFonts: false, defaultFontFamily: 'DM Sans' },
}).render().asPng();
writeFileSync(output, png);
console.log(`Wrote ${output}`);
