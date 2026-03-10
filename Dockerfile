# ---------- Stage 1: Dependencies ----------
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm ci


# ---------- Stage 2: Builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client FIRST
RUN npx prisma generate

# Then build Next.js
RUN npm run build


# ---------- Stage 3: Runtime ----------
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node bootstrap.js"]
