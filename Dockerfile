# ---------------------
# Stage 1: Builder
# ---------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install all deps (including dev)
RUN npm install

# Copy rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# ---------------------
# Stage 2: Runner
# ---------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Copy service-entry.sh
COPY service-entry.sh /app/service-entry.sh
RUN chmod +x /app/service-entry.sh

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Entrypoint
ENTRYPOINT ["/app/service-entry.sh"]
