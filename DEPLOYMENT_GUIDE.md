# Deployment Guide

This guide explains how to deploy the ODIADEV TTS API Website to Render with Supabase for the database.

## Prerequisites

1. A GitHub account
2. A Render account
3. A Supabase account

## Step 1: Set up Supabase Database

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Once the project is created, navigate to the "Settings" > "Database" section
3. Copy the "Connection string" - it should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
4. Save this connection string for later use

## Step 2: Prepare the Code for Deployment

1. Update the Prisma schema to use PostgreSQL:
   In `prisma/schema.prisma`, change the datasource to:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Commit and push your changes to GitHub

## Step 3: Set up Render

1. Go to [Render](https://render.com/) and sign up or log in
2. Click "New" > "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `odia-tts-api`
   - Region: Choose the closest region to your users
   - Branch: `main` (or your default branch)
   - Root Directory: Leave empty if the app is in the root, or specify the path
   - Environment: `Node`
   - Build Command: 
     ```
     npm install && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - Start Command: 
     ```
     npm start
     ```

## Step 4: Configure Environment Variables

In the Render dashboard, add the following environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `ADMIN_TOKEN` | [Your strong random string] | Used for admin authentication |
| `KEY_PEPPER` | [Your strong random string] | Used for hashing API keys |
| `ODIA_UPSTREAM_KEY` | [Your upstream TTS service key] | API key for the upstream service |
| `DATABASE_URL` | [Your Supabase connection string] | PostgreSQL connection URL |
| `NODE_ENV` | `production` | Environment indicator |

Note: For `ADMIN_TOKEN` and `KEY_PEPPER`, generate strong random strings. You can use a password generator or run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically start building and deploying your application
3. The build process will:
   - Install dependencies
   - Generate Prisma client
   - Run database migrations
   - Build the Next.js application
4. Once complete, your application will be available at the provided URL

## Step 6: Post-Deployment Verification

1. Visit your deployed application's URL
2. Navigate to `/admin` and test the admin functionality with your ADMIN_TOKEN
3. Issue a test API key
4. Test the TTS endpoint with the issued key

## Troubleshooting

### Database Connection Issues
- Verify the DATABASE_URL is correct
- Ensure the Supabase project is not paused
- Check that you've added Render's IP addresses to Supabase's whitelist if needed

### Environment Variables
- Ensure all required environment variables are set
- Check that sensitive values are correctly entered (no extra spaces)

### Build Failures
- Check the build logs in Render for specific error messages
- Ensure all dependencies are correctly specified in package.json

## Scaling and Monitoring

- Render automatically scales your service based on traffic
- You can upgrade to a paid plan for more resources
- Set up alerts in Render for downtime or performance issues
- Consider adding logging and monitoring solutions for production use

## Updating the Application

To update your deployed application:

1. Push changes to your GitHub repository
2. Render will automatically detect the changes and start a new deployment
3. You can also manually trigger a deployment from the Render dashboard