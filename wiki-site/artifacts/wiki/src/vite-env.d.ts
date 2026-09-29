/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base address of the owner's counter service, e.g.
   * "https://counter.chargingthefuture.com/api". Unset in local development and
   * in forks, which makes the counter inert — see src/lib/counter.ts.
   */
  readonly VITE_COUNTER_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** File names in content/audio, listed at build time by the content-audio plugin in vite.config.ts. */
declare const __POST_AUDIO_FILES__: string[];
