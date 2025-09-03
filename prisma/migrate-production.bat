@echo off
REM Production database migration script

echo Running Prisma migrations for production...
npx prisma migrate deploy

if %errorlevel% == 0 (
  echo Prisma migrations completed successfully
) else (
  echo Prisma migrations failed
  exit /b 1
)