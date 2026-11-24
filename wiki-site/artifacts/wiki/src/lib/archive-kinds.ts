/**
 * Plain-language label for what an archive entry was on the platform it was
 * written on. One list, read by The Record's cards and filters and by the
 * article page's provenance block — a reader who arrives at an entry from the
 * Record, or from anywhere else, sees the same words for what it was.
 */
export const KIND_LABELS: Record<string, string> = {
  answer: "Answer",
  "answer-comment": "Comment on an answer",
  "answer-draft": "Unpublished draft",
  credential: "Profile credential",
  "post-comment": "Comment on a post",
  question: "Question asked",
  "question-comment": "Comment on a question",
  "space-post": "Post in a space",
  "space-submission": "Submitted to a space",
  "forum-topic": "Forum topic",
};

/** Quora address of the project's own space. */
const OWN_SPACE_HOST = "skillseconomy.quora.com";

/**
 * The label for one entry. A space post in the project's own space reads as
 * that space; a post anywhere else reads as someone else's space. The filter
 * chips use KIND_LABELS directly, since one chip covers both.
 */
export function archiveKindLabel(kind: string, originalUrl?: string): string {
  if (kind === "space-post") {
    let host = "";
    try {
      host = originalUrl ? new URL(originalUrl).host : "";
    } catch {
      host = "";
    }
    return host === OWN_SPACE_HOST
      ? "Post in the Skills Economy space"
      : "Post in someone else's space";
  }
  return KIND_LABELS[kind] ?? kind;
}
