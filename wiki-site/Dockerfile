# Image for the counter service (artifacts/api-server), deployed to Railway.
#
# Railway builds this with wiki-site/ as the service's root directory. Node 24
# is pinned because storage is node:sqlite, which ships inside Node itself —
# there is no native module to compile and nothing to download at deploy time.

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
