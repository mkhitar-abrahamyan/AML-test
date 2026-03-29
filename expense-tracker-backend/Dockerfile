FROM node:20-alpine AS base

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false

# --- Build ---
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Dummy URL for Prisma during build
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy"

RUN npx prisma generate
RUN npm run build

# --- Production ---
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}

# Copy files from build
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]