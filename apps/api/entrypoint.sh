#!/bin/sh
set -e

echo "⏳ Waiting for database..."
until nc -z db 5432; do
  sleep 1
done

echo "✅ Database is up"

echo "📦 Running prisma db push..."
npx prisma db push --config=./prisma.config.ts

echo "🚀 Starting API..."
exec node dist/src/main.js