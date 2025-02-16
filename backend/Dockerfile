# syntax=docker/dockerfile:1.4

# 1. Base image
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    netcat-openbsd

# Create app directory
WORKDIR /app

# 2. Development dependencies
FROM base AS development
COPY package*.json ./
COPY admin/package*.json admin/

# Install dependencies (including devDependencies)
RUN npm ci --legacy-peer-deps
WORKDIR /app/admin
RUN npm ci --legacy-peer-deps
WORKDIR /app

# Copy application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

# Copy and set permissions for entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["docker-entrypoint.sh"]

# 3. Production dependencies
FROM base AS production-deps
COPY package*.json ./
COPY admin/package*.json admin/

# Install production dependencies only
RUN npm ci --only=production --legacy-peer-deps
WORKDIR /app/admin
RUN npm ci --only=production --legacy-peer-deps
WORKDIR /app

# 4. Build stage
FROM base AS builder
COPY --from=development /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN cd admin && npm run build

# 5. Production image
FROM base AS production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=production-deps /app/admin/node_modules ./admin/node_modules
COPY --from=builder /app/admin/.next ./admin/.next
COPY --from=builder /app/admin/public ./admin/public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/admin/package*.json ./admin/
COPY docker-entrypoint.sh /usr/local/bin/

# Set permissions
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["docker-entrypoint.sh"] 