# Use Node 18 for build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN npm install
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
COPY start.sh ./start.sh
RUN chmod +x start.sh
EXPOSE 3000 3001
CMD ["sh", "./start.sh"]
