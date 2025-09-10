FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# Copy service-entry.sh and make executable
COPY service-entry.sh /app/service-entry.sh
RUN chmod +x /app/service-entry.sh

# Set env vars
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Run the app
ENTRYPOINT ["sh", "/app/service-entry.sh"]
