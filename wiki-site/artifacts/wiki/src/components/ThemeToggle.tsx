import { useEffect, useState } from "react";

// Light or dark. Starts from the phone's setting; a choice is remembered on this phone only.
// index.html applies a remembered choice before the page paints, so there is no flash.
// The same control as chargingthefuture.com and farahbrunache.com.

const THEME_KEY = "ctf-theme";
type Theme = "light" | "dark";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  function pick(next: Theme) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* not remembered on this phone */
    }
  }

  const base = "font-heading font-semibold text-sm px-3 min-h-8 rounded-full transition-colors";
  return (
    <div role="group" aria-label="Theme" className="inline-flex p-[3px] gap-0.5 rounded-full border border-border bg-card">
      {(["light", "dark"] as const).map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={theme === t}
          onClick={() => pick(t)}
          className={theme === t ? `${base} bg-white text-black` : `${base} text-gray-500 hover:text-white`}
        >
          {t === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}
