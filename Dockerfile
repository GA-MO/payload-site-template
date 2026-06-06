# syntax=docker/dockerfile:1
# Multi-stage build for the Payload + Next.js app. Bun is the package manager,
# build tool, and runtime. The default oven/bun tag is Debian-based, so sharp
# uses its bundled libvips with no musl edge cases.

FROM oven/bun:1 AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- deps ----
FROM base AS deps
COPY package.json bun.lock* package-lock.json* ./
RUN bun install --frozen-lockfile

# ---- builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Payload config asserts a secret at build time; the real one is injected at
# runtime by the deploy platform, so a throwaway value is fine here.
ENV PAYLOAD_SECRET=build-time-placeholder
RUN bun scripts/check-migrations.ts && bunx --bun next build

# ---- runner ----
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static
COPY --from=builder --chown=bun:bun /app/public ./public

# Uploads — mount a persistent volume at /app/media so they survive redeploys.
RUN mkdir -p /app/media && chown bun:bun /app/media

USER bun
EXPOSE 3000
CMD ["bun", "server.js"]
