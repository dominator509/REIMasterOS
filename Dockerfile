ARG NODE_IMAGE=node:22.23.1-alpine3.23@sha256:8516dce0483394d5708d4b2ee6cacb79fb1d617ea4e2787c2120bcca92ce372e

FROM ${NODE_IMAGE} AS api-build
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /workspace
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter @rei-os/api
RUN pnpm --filter @rei-os/api deploy --prod /opt/rei-os-api

FROM ${NODE_IMAGE} AS api-runtime
ENV NODE_ENV=production
ENV API_PORT=3001
WORKDIR /app
COPY --from=api-build --chown=node:node /opt/rei-os-api ./
# The pinned base image may lag the Alpine security repository. Refresh runtime
# packages at build time, and remove npm from the production image because the
# API only executes Node and does not need the package manager.
RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
USER node
EXPOSE 3001
CMD ["node", "dist/main.js"]
