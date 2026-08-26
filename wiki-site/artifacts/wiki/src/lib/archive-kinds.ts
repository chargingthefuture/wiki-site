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
  "space-post": "Post in someone else's space",
  "space-submission": "Submitted to a space",
  "forum-topic": "Forum topic",
};
