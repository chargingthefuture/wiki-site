import { createRoot } from "react-dom/client";
import App from "./App";

// Self-hosted web fonts. These were previously pulled from Google Fonts at
// runtime, which sent every reader's IP address and User-Agent to Google on
// every page view — on a blog read by people with specific reasons to avoid
// that. Bundling them means the browser contacts only the host serving the
// site. Imported before index.css so its @theme font stacks can override.
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource-variable/dm-sans/wght-italic.css";
import "@fontsource-variable/oswald/wght.css";
import "@fontsource/bangers/400.css";

import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
