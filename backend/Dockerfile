# =============================================================================
#  ameer_nasr backend — multi-stage Dockerfile
#  Stage 1: build  | Stage 2: production runtime
# =============================================================================

# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Install build dependencies for argon2 / native modules
RUN apk add --no-cache python3 make g++ openssl

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY tsconfig*.json nest-cli.json eslint.config.mjs ./
COPY src ./src

RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache openssl tini

COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund

COPY --from=build /app/dist ./dist

EXPOSE 4000

# Use tini for proper signal handling (PID 1)
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]
