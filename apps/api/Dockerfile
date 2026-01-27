FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json ./
RUN npm install

COPY tsconfig.json nest-cli.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm run prisma:generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run prisma:dbpush && npm run prisma:seed && npm run start"]