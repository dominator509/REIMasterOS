FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json turbo.json ./
COPY apps/web/package.json apps/web/
COPY apps/web/tsconfig.json apps/web/next.config.ts apps/web/
COPY packages/domain/package.json packages/domain/
COPY packages/contracts/package.json packages/contracts/
COPY packages/config/package.json packages/config/
RUN pnpm install --frozen-lockfile --prod=false
COPY . .
RUN pnpm build --filter @rei-os/web
EXPOSE 3000
CMD ["node", "apps/web/.next/standalone/server.js"]
