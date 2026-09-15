// AUTO-GENERATED — do not edit by hand.
// Regenerate with:
//   pnpm fireside:sync
//
// Fireside comments the app has cleared for publication: the author asked for each one, and an
// admin agreed. Both are required and neither is enough alone, and the app decides it — this file
// is a copy of what its export feed returned, never a judgment made here.
//
// Bundled into the build on purpose. A comment fetched into the page after it loads is not in the
// published build and so is not in what a web archive captures, and being captured is exactly what
// the author was asked to agree to. Anything in this file is permanent once it deploys.

export interface ExportedComment {
  commentId: string;
  parentCommentId: string | null;
  authorName: string;
  body: string;
  createdAt: string;
  postRepo: string;
  postSlug: string;
  postTitle: string;
}

/** Keyed by `${repo}/${slug}` — the same pair the article route carries. */
export const FIRESIDE_EXPORTS: Record<string, ExportedComment[]> = {};

export function exportedCommentsFor(repo: string, slug: string): ExportedComment[] {
  return FIRESIDE_EXPORTS[`${repo}/${slug}`] ?? [];
}

// 0 comments across 0 posts.
