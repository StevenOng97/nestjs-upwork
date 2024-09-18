# Build stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
EXPOSE 8080
CMD ["npm", "run", "start:prod"]