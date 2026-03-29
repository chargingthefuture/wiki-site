// next.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the outputFileTracingRoot to the monorepo root
  outputFileTracingRoot: path.resolve(__dirname, '../../..'),
  // You can add more Next.js config here as needed
};

export default nextConfig;
