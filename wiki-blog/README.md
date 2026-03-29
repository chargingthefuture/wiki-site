# Charging The Future Wiki Blog

[![Deploy Blog to GitHub Pages](https://github.com/chargingthefuture/chargingthefuture/actions/workflows/deploy-blog-gh-pages.yml/badge.svg?branch=v3)](https://github.com/chargingthefuture/chargingthefuture/actions/workflows/deploy-blog-gh-pages.yml)

Static frontend for the Charging The Future wiki content.

Live site:

- https://chargingthefuture.github.io/chargingthefuture/

Working directory:

- `/workspaces/chargingthefuture/wiki-blog`

Common commands:

```bash
pnpm blog:validate
pnpm blog:sync
pnpm blog:preview
pnpm blog:build
pnpm blog:build:pages
```

GitHub Pages:

- Deploys from the `v3` branch for now.
- When the new app is ready to become primary, switch the Pages deploy workflow branch from `v3` to `main` in [.github/workflows/deploy-blog-gh-pages.yml](../.github/workflows/deploy-blog-gh-pages.yml).
