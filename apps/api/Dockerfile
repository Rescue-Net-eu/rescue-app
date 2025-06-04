# ------------------------------
# Stage 1: Build
# ------------------------------
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ------------------------------
# Stage 2: Production image
# ------------------------------
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
