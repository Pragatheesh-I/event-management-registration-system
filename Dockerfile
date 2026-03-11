# Dockerfile for Next.js application with Prisma
FROM node:22-alpine

# Install necessary packages for Prisma and Next.js
RUN apk add --no-cache openssl libc6-compat

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Run Prisma migrations and start the Next.js development server
CMD ["sh", "-c", "npx prisma generate && npx prisma db push && npm run dev"]
