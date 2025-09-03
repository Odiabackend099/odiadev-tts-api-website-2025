#!/bin/bash
# Production database migration script

echo "Running Prisma migrations for production..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "Prisma migrations completed successfully"
else
  echo "Prisma migrations failed"
  exit 1
fi