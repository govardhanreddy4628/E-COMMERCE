FROM node:20-alpine3.20 AS base
WORKDIR /app

# Builder stage
FROM base AS builder
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
RUN npm install
COPY . .
Run npm run build


# production stage
FROM base AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/tsconfig.json ./
RUN npm install --omit=dev

EXPOSE 5000
ENV PORT=8080

CMD ["node", "dist/index.js"]

