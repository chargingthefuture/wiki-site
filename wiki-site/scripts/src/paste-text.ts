/**
 * Markdown → plain text for the paste sheets. Shared by paste-sheet-full.ts (Quora) and
 * paste-sheet-tts.ts (text to speech), so the two convert a post the same way. See
 * paste-sheet-full.ts for why each rule exists.
 */

export function toPasteable(markdown: string): string {
  let body = markdown;
  body = body.replace(/^---\n[\s\S]*?\n---\n/, '');
  // HTML comments are notes to whoever edits the file (the stated
  // reason for skipping a check). The blog does not show them, so the sheets
  // do not either.
  body = body.replace(/<!--[\s\S]*?-->/g, '');
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
  // A bare filename like how-to-check-me.md looks like a web address to
  // Quora (.md is a real domain ending), which turns it into a dead link.
  // Dropping the extension leaves nothing to auto-link. Only bare names —
  // a path with slashes does not match the linker's pattern.
  body = body.replace(/`([A-Za-z0-9_-]+)\.md`/g, '`$1`');
  // The sheet is plain text, no styling at all (owner directive, 2026-08-25):
  // inline code marks go the way of the emphasis marks. The words stay.
  // Matches only single-backtick spans: the lookarounds keep it off the
  // ``` fence sequences, which the fence handler below removes as complete lines.
  body = body.replace(/(?<!`)`([^`\n]+)`(?!`)/g, '$1');
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
      // A fenced block keeps its lines exactly as written — one address per
      // line — but sheds the ``` markers themselves. Quora shows the markers
      // literally and turns the URLs into preview cards regardless, so the
      // fences bought nothing and pasted as stray punctuation.
      if (block.trimStart().startsWith('```')) {
        // Caret annotations (^^^^ under a column, with a label line after)
        // are positional, and position does not survive a paste — the text
        // rewraps at the reader's screen width, so the columns break no
        // matter the font. The annotated line stays; the carets and their
        // label go, and the surrounding prose carries the explanation.
        const lines = block.split('\n').filter((line) => !/^\s*```/.test(line));
        const kept: string[] = [];
        let dropLabel = false;
        for (const line of lines) {
          if (/^[\s^]*\^[\s^]*$/.test(line)) {
            dropLabel = true;
            continue;
          }
          if (dropLabel) {
            dropLabel = false;
            continue;
          }
          kept.push(line);
        }
        return kept.join('\n');
      }

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
