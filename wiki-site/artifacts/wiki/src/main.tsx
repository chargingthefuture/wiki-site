import { createRoot } from "react-dom/client";
import App from "./App";

// Self-hosted web fonts. These were previously pulled from Google Fonts at
// runtime, which sent every reader's IP address and User-Agent to Google on
// every page view — on a blog read by people with specific reasons to avoid
// that. Bundling them means the browser contacts only the host serving the
// site. Imported before index.css so its @theme font stacks can override.
// Fixed weights rather than the variable files: saving a page as a PDF or a screenshot on a phone
// dropped some letters (capital R) from the variable fonts.
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/400-italic.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/500-italic.css";

import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
