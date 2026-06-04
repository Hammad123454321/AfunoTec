# =============================================================================
#  ameer_nasr frontend (Next.js 15) — multi-stage production Dockerfile.
#  Uses Next.js standalone output for the smallest possible runtime image.
# =============================================================================

# ---- Stage 1: install deps ----
FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Stage 2: build ----
FROM node:20-alpine AS build
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public env vars must be present at build time so Next.js can inline them
# into the static bundle. Defaults are safe for a smoke build; the real
# values come from docker-compose.yml `args:`.
ARG NEXT_PUBLIC_API_URL=https://api.baodeals.com/api/v1
ARG NEXT_PUBLIC_GA_ID=
ARG NEXT_PUBLIC_FB_PIXEL_ID=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_FB_PIXEL_ID=$NEXT_PUBLIC_FB_PIXEL_ID
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ---- Stage 3: runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as an unprivileged user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# The standalone build produces a self-contained server at .next/standalone
# plus a separate .next/static for assets and public/ for static files.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static    ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public          ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
