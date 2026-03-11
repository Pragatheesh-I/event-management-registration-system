# ---------- 1️⃣ Dependencies ----------
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package*.json ./
RUN npm ci

# ---------- 2️⃣ Builder ----------
FROM node:22-alpine AS builder
WORKDIR /app
ENV JWT_SECRET=build-placeholder
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate 
RUN npm run build

# ---------- 3️⃣ Production ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat openssl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/lib/loadSecrets.js ./src/lib/loadSecrets.js
COPY --from=builder /app/bootstrap.js ./


EXPOSE 3000
CMD ["node", "bootstrap.js"]


