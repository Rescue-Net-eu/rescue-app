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

COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.js ./next.config.js
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
