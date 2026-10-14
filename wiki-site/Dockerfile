# Image for the counter service (artifacts/api-server), deployed to Railway.
#
# Railway builds this with wiki-site/ as the service's root directory. Node 24
# is pinned because storage is node:sqlite, which ships inside Node itself —
# there is no native module to compile and nothing to download at deploy time.
#
# Railway rebuilds only when these change, set under the service's Settings,
# Watch Paths (patterns start at the repository root, not the root directory):
#   /wiki-site/artifacts/api-server/**
#   /wiki-site/lib/**
#   /wiki-site/Dockerfile
#   /wiki-site/package.json
#   /wiki-site/pnpm-lock.yaml
#   /wiki-site/pnpm-workspace.yaml
# Without them every post rebuilds the counter. Add a path here and there when
# the counter starts reading another part of the workspace.

FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/api-server run build

# The build bundles every dependency, so the running image carries the compiled
# output and nothing else — no node_modules, no content/, no source.
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/artifacts/api-server/dist ./dist
USER node
CMD ["node", "--enable-source-maps", "dist/index.mjs"]
