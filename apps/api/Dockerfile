# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN test -f prisma/schema.prisma

# Generate Prisma client in the standard location (@prisma/client)
RUN npx prisma generate

# Build Nest (your output: dist/src/main.js)
RUN npm run build
RUN test -f dist/src/main.js

RUN npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl netcat-openbsd
ENV NODE_ENV=production


COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.* ./
COPY entrypoint.sh ./entrypoint.sh


RUN chmod +x ./entrypoint.sh


EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]