# =========================
# 1. Install Dependencies
# =========================
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# =========================
# 2. Build Next.js App
# =========================
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# =========================
# 3. Production Runner
# =========================
FROM node:18-alpine AS runner
WORKDIR /app

EXPOSE 3000

# Copy only necessary files
COPY --from=builder /app ./

# Add entry script
COPY service-entry.sh /usr/bin/service-entry.sh
RUN chmod +x /usr/bin/service-entry.sh

ENTRYPOINT ["/usr/bin/service-entry.sh"]
