FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json turbo.json ./
COPY apps/api/package.json apps/api/
COPY apps/api/tsconfig.json apps/api/nest-cli.json apps/api/
COPY packages/domain/package.json packages/domain/
COPY packages/domain/tsconfig.json packages/domain/
COPY packages/contracts/package.json packages/contracts/
COPY packages/contracts/tsconfig.json packages/contracts/
COPY packages/config/package.json packages/config/
COPY packages/config/tsconfig.json packages/config/
COPY packages/persistence/package.json packages/persistence/
COPY packages/persistence/tsconfig.json packages/persistence/
RUN pnpm install --frozen-lockfile --prod=false
COPY . .
RUN pnpm build --filter @rei-os/api
EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
