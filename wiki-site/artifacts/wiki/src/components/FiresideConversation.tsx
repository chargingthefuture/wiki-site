import { useEffect, useState } from "react";
import { exportedCommentsFor, type ExportedComment } from "@/lib/fireside-exports";

// The conversation under a post. Reading it needs no account and no sign-in — the blog is public,
// so the talk under it is public too, which is the inversion of a platform that gates reading as
// well as writing.
//
// What renders first is what shipped inside this build: the comments whose authors asked for them
// to be published here and whose admin agreed, copied in by `pnpm fireside:sync`. That is what a
// web archive captures, and it is what a reader with no JavaScript, a blocked app domain, or a slow
// connection sees. The live read below then replaces it with the whole conversation, which is
// wider — every publicly visible comment, not only the ones cleared for publication.
//
// Writing happens in the app. The app's write routes are same-origin and keep their CSRF and origin
// checks, and a signed-in session lives on the app's own domain, so a form here would be refused —
// and would break silently for anybody whose browser blocks third-party cookies. So the button
// carries the post's identity across, the app opens that exact conversation on arrival, and a
// first-time visitor who has to sign in first is returned to it rather than to a home page full of
// tiles they did not ask for.
//
// This must never break the page it sits under. The app being unreachable, slow, or mid-deploy ends
// with a quiet line and the post still reads normally.

const APP_URL = "https://app.chargingthefuture.com";

type Comment = {
  id: string;
  parentCommentId: string | null;
  authorName: string;
  body: string;
  createdAt: string;
  /**
   * When the author last rewrote it, or null if they never did.
   *
   * An author can fix their own words in place, and the comment keeps its id so the replies under
   * it and the reactions on it survive. Without a mark, a reader here has no way to tell that what
   * they are reading is not what somebody else answered. The app has shown this since the edit
   * shipped; the blog did not, so the same comment read as original here and as edited there.
   */
  editedAt: string | null;
};

// The build's copy carries a couple of fields this section does not render (which post it belongs
// under, which it already knows) and names the id differently, so it is narrowed to the shape the
// live read returns and the two are interchangeable from here on.
//
// It carries no edit time: what was cleared for publication is a fixed copy of the words as an
// admin approved them, and rewriting a comment sends that approval back to the queue — so a
// published copy is never a rewritten one, and there is nothing to mark.
function fromBuild(comment: ExportedComment): Comment {
  return {
    id: comment.commentId,
    parentCommentId: comment.parentCommentId,
    authorName: comment.authorName,
    body: comment.body,
    createdAt: comment.createdAt,
    editedAt: null,
  };
}

function joinUrl(repo: string, slug: string, title: string): string {
  const query = new URLSearchParams({ repo, slug });
  if (title) query.set("title", title);
  return `${APP_URL}/apps/fireside?${query.toString()}`;
}

function CommentBody({
  comment,
  isReply,
  orphaned = false,
}: {
  comment: Comment;
  isReply: boolean;
  /** True when the comment this one answers is no longer in the conversation. */
  orphaned?: boolean;
}) {
  return (
    <div
      className={
        isReply
          ? "ml-6 mt-3 border-l-4 border-gray-700 pl-4"
          : "border-4 border-black comic-shadow-sm bg-card p-4 md:p-5"
      }
    >
      <div className="font-mono text-xs text-primary uppercase tracking-wider">{comment.authorName}</div>
      {orphaned && (
        <div className="mt-1 font-mono text-xs text-gray-500">
          Answering a comment that is no longer shown here.
        </div>
      )}
      <div className="mt-2 whitespace-pre-wrap text-gray-200 leading-relaxed">{comment.body}</div>
      {comment.editedAt && <div className="mt-2 font-mono text-xs text-gray-500">Edited</div>}
    </div>
  );
}

export function FiresideConversation({
  repo,
  slug,
  title,
}: {
  repo: string;
  slug: string;
  title: string;
}) {
  // Starts from the build rather than from nothing, so the section is never empty on first paint
  // when this post has published comments.
  const published = exportedCommentsFor(repo, slug).map(fromBuild);
  const [comments, setComments] = useState<Comment[] | null>(published.length > 0 ? published : null);
  const [unreachable, setUnreachable] = useState(false);

  useEffect(() => {
    if (!repo || !slug) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `${APP_URL}/api/fireside/threads?repo=${encodeURIComponent(repo)}&slug=${encodeURIComponent(slug)}`,
        );
        if (!res.ok) throw new Error(`threads route answered ${res.status}`);
        const data = (await res.json()) as { comments?: Comment[] };
        if (!cancelled) setComments(data.comments ?? []);
      } catch {
        // Deliberately quiet. A reader came for the post, and an error box about a comment service
        // helps nobody; the invitation to join still works, because it is only a link.
        if (!cancelled) setUnreachable(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [repo, slug]);

  // A reply whose parent is not in the list still gets read.
  //
  // The comment it answers can be gone two ways: its author took it down, which drops it from the
  // conversation entirely, or an admin removed it, which leaves it visible to its own author and to
  // nobody else. Either way the reply itself is untouched and the route still returns it — so
  // filing it only under a parent that is not here rendered it nowhere, and one comment being taken
  // out quietly took every answer to it out as well.
  const shown = comments ?? [];
  const present = new Set(shown.map((comment) => comment.id));
  const isOrphan = (comment: Comment) =>
    comment.parentCommentId != null && !present.has(comment.parentCommentId);
  const top = shown.filter((comment) => comment.parentCommentId == null || isOrphan(comment));

  return (
    <section className="mt-16 border-t-4 border-dashed border-gray-800 pt-8">
      <h2 className="font-heading text-2xl font-bold uppercase text-white">Fireside</h2>
      <p className="mt-2 font-mono text-sm leading-relaxed text-gray-400">
        Conversation about this post. Anyone can read it, with no account and nothing to sign up
        for. Writing needs an account, and what you write becomes public once you are approved.
      </p>

      {comments === null && !unreachable && (
        <p className="mt-6 font-mono text-sm text-gray-500">Loading the conversation…</p>
      )}

      {top.length > 0 && (
        <div className="mt-6 space-y-5">
          {top.map((comment) => (
            <div key={comment.id}>
              <CommentBody comment={comment} isReply={false} orphaned={isOrphan(comment)} />
              {shown
                .filter((reply) => reply.parentCommentId === comment.id)
                .map((reply) => (
                  <CommentBody key={reply.id} comment={reply} isReply />
                ))}
            </div>
          ))}
        </div>
      )}

      {comments !== null && top.length === 0 && (
        <p className="mt-6 font-mono text-sm text-gray-500">Nothing here yet. Say the first thing.</p>
      )}

      <a
        href={joinUrl(repo, slug, title)}
        className="comic-shadow mt-8 inline-block border-4 border-black bg-primary px-6 py-3 font-heading font-bold uppercase tracking-wide text-black transition-transform hover:-translate-y-0.5"
      >
        {top.length > 0 ? "Join this conversation" : "Start this conversation"}
      </a>

      <p className="mt-3 font-mono text-xs leading-relaxed text-gray-500">
        The link opens this same conversation in the app. Signing in first returns you here to it,
        not to somewhere else.
      </p>
    </section>
  );
}
