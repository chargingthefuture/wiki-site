/**
 * Finds the recorded readings, wherever they were uploaded.
 *
 * The home for a recording is content/audio/<post-slug>.mp3 (or .m4a). GitHub's upload page puts a
 * file in whatever folder is open at the time, and on a phone that has more than once been the top
 * of the repository or content/ instead (owner report, 2026-09-30). So a correctly named file is
 * also picked up from content/ (any depth) and from the top of the repository, and a doubled
 * extension (what-stays-up.mp3.mp3, which a save dialog produces when the name already ends in
 * .mp3) is read as one. content/audio wins when the same post has a file in two places.
 *
 * Used by the post player (artifacts/wiki/vite.config.ts), readings.json (build-readings.ts) and
 * the text-to-speech sheet (paste-sheet-tts.ts), so all three agree on which posts have audio.
 */

import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

export type AudioFile = {
  /** The post slug the file belongs to (its name without the extension). */
  slug: string;
  /** Where the file is on disk. */
  path: string;
  /** The name it is served under: <base>audio/<served>. */
  served: string;
};

const AUDIO_NAME = /^([a-z0-9][a-z0-9-]*)((?:\.(?:mp3|m4a))+)$/;
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'artifacts', 'scripts', 'lib', 'attached_assets']);

function audioIn(dir: string, recursive: boolean): string[] {
  if (!existsSync(dir)) return [];
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (recursive && !SKIP_DIRS.has(entry.name)) found.push(...audioIn(full, true));
    } else if (entry.isFile() && AUDIO_NAME.test(entry.name)) {
      found.push(full);
    }
  }
  return found;
}

/** wikiRoot is the wiki-site/ folder (the one holding content/). */
export function findAudioFiles(wikiRoot: string): Map<string, AudioFile> {
  const content = resolve(wikiRoot, 'content');
  const places = [
    ...audioIn(join(content, 'audio'), false),
    ...audioIn(content, true),
    ...audioIn(resolve(wikiRoot, '..'), false),
  ];
  const bySlug = new Map<string, AudioFile>();
  for (const path of places) {
    const name = path.split(/[\\/]/).pop() ?? '';
    const match = AUDIO_NAME.exec(name);
    if (!match || bySlug.has(match[1])) continue;
    const extension = match[2].split('.').pop();
    bySlug.set(match[1], { slug: match[1], path, served: `${match[1]}.${extension}` });
  }
  return bySlug;
}
