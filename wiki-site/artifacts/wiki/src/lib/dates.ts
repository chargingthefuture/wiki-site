/**
 * Format an article's publish date for display.
 *
 * Article dates are bare `YYYY-MM-DD` strings authored in US Eastern (the
 * publishing pipeline stamps them in `America/New_York`). We anchor the
 * instant at noon UTC — not local midnight or a hardcoded `-05:00`/`-04:00`
 * offset — so the rendered calendar day is correct year-round regardless of
 * daylight saving (EST/EDT) and the viewer's own timezone. The result is
 * formatted in `America/New_York` and labeled `ET`.
 */
export function formatArticleDate(date: string, opts: Intl.DateTimeFormatOptions): string {
  const d = new Date(`${date}T12:00:00Z`);
  return `${d.toLocaleDateString('en-US', { ...opts, timeZone: 'America/New_York' })} ET`;
}
