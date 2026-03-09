# ---- Dev image ----
FROM node:22-alpine

# Recommended for Prisma (OpenSSL + glibc compatibility)
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the project
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Generate Prisma client and ensure DB schema is pushed on container start
# - prisma generate needs DATABASE_URL at runtime (Compose supplies it)
# - db push creates tables for dev (no migrations required)
CMD ["sh", "-c", "npx prisma generate && npx prisma db push && npm run dev"]