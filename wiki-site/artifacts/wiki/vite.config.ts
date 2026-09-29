import { defineConfig, type Plugin } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

// Recorded readings of posts: content/audio/<post-slug>.mp3 (or .m4a). The post page shows a
// "Listen to this post" player when a file named after its slug is here; nothing else has to change.
// The files are copied to <base>audio/<file> with their names unchanged, not hashed like images, so
// each one has a fixed address that can be pasted elsewhere (the Chyme readings loop in the app).
const AUDIO_DIR = path.resolve(import.meta.dirname, "..", "..", "content", "audio");
const AUDIO_FILE_RE = /^[a-z0-9][a-z0-9-]*\.(mp3|m4a)$/;

function listAudioFiles(): string[] {
  if (!fs.existsSync(AUDIO_DIR)) return [];
  return fs.readdirSync(AUDIO_DIR).filter((name) => AUDIO_FILE_RE.test(name)).sort();
}

function contentAudio(): Plugin {
  const files = listAudioFiles();
  return {
    name: "content-audio",
    config: () => ({ define: { __POST_AUDIO_FILES__: JSON.stringify(files) } }),
    generateBundle() {
      for (const name of files) {
        this.emitFile({ type: "asset", fileName: `audio/${name}`, source: fs.readFileSync(path.join(AUDIO_DIR, name)) });
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = /\/audio\/([^/?#]+)$/.exec((req.url ?? "").split("?")[0]);
        if (!match || !files.includes(match[1])) return next();
        res.setHeader("Content-Type", match[1].endsWith(".m4a") ? "audio/mp4" : "audio/mpeg");
        fs.createReadStream(path.join(AUDIO_DIR, match[1])).pipe(res);
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    contentAudio(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Each bundled content/*.md becomes its own lazy chunk named after
        // the file. Some article file names carry emoji, apostrophes, or
        // unicode hyphens; GitHub Pages does not reliably serve asset files
        // with those names, so the article body request 404s and the page
        // shows the not-found screen. Keep every emitted chunk name ASCII.
        sanitizeFileName: (name: string) =>
          name
            .replace(/[^\x20-\x7E]/g, "")
            .replace(/[\0?*:"<>|#%'\s]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") || "chunk",
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
