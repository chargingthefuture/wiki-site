import { useEffect, useState, type CSSProperties } from "react";

/**
 * The blog's loading screen, matching the app's single app-wide one
 * (ctf/packages/web/components/shared/app-loading.tsx): the dim
 * "Exit Their Economy / Exit The Psyop" lines on the dark background.
 * No skeletons, no pulsing placeholders — this is the only loading
 * visual on the blog, same as in the app.
 *
 * Like the app's version it holds back its own appearance: for the first
 * `delayMs` it renders nothing, so a load that finishes quickly (the
 * common case) never flashes a loading screen on and off. The screen only
 * appears if the fetch is genuinely taking a moment.
 */
const lineStyle: CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.18em",
  color: "rgba(255, 255, 255, 0.22)",
  textTransform: "uppercase",
  fontWeight: 500,
  lineHeight: 2,
};

export function AppLoading({ delayMs = 300 }: { delayMs?: number }) {
  const [show, setShow] = useState(delayMs <= 0);

  useEffect(() => {
    if (delayMs <= 0) return;
    const id = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        display: "flex",
        minHeight: "60dvh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div style={{ padding: "0 32px" }}>
        <div style={{ ...lineStyle, marginBottom: 16 }}>Exit Their Economy</div>
        <div style={lineStyle}>Exit The Psyop</div>
      </div>
    </div>
  );
}
