# ODIADEV TTS API Website

A clean landing page with API key management system for securing access to a Text-to-Speech (TTS) service.

## Features

- **Public Landing Page**: Clean, Apple-inspired design with hero section, features, and demo
- **Admin Dashboard**: Password-protected interface for issuing, managing, and revoking API keys
- **Keyed Proxy**: Secure proxy endpoint that requires API keys to access the upstream TTS service
- **Security**: HMAC-SHA256 key hashing, domain restrictions, rate limiting, and key revocation
- **Styling**: Tailwind CSS with Inter and Space Grotesk fonts

## Getting Started

First, install the dependencies:

```bash
npm install
```

Set up the database:

```bash
npx prisma migrate dev
```

Update the `.env` file with your configuration:
- Set a strong `ADMIN_TOKEN` for admin access
- Set a strong `KEY_PEPPER` for key hashing
- Verify `ODIA_UPSTREAM_KEY` is correct for your upstream TTS service

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the landing page.
Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

## API Usage

### Admin Routes
- `POST /api/admin/keys/issue` - Create new API keys
- `GET /api/admin/keys/list` - List all API keys
- `POST /api/admin/keys/revoke` - Revoke API keys

### Public Routes
- `POST /api/tts` - Text-to-Speech proxy (requires valid API key)

## Security Features

- API keys are stored as HMAC-SHA256 hashes with a server pepper
- Public keys are domain-restricted
- Rate limiting per key (per minute and daily quotas)
- Key revocation capability
- Origin checking for browser requests
- Timing-safe comparison for key verification

## Deployment

### Deploy to Vercel (Recommended for Frontend)

1. **Push to GitHub**:
   - Initialize your Git repository:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     ```
   - Create a new repository on GitHub and push your code

2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com) and sign up or log in
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Add environment variables:
     - `ADMIN_TOKEN` - A strong random string for admin access
     - `KEY_PEPPER` - A strong random string for key hashing
     - `ODIA_UPSTREAM_KEY` - Your upstream TTS service API key
   - Click "Deploy"

3. **Set up Database**:
   - For production, you'll need to set up a PostgreSQL database
   - Update your Prisma configuration to use PostgreSQL
   - Add the `DATABASE_URL` environment variable to Vercel

### Deploy to Render with Supabase

1. **Set up Supabase Database**:
   - Create a new Supabase project
   - Get your database connection URL from the Supabase dashboard
   - Update the `DATABASE_URL` in your Render environment variables

2. **Configure Environment Variables on Render**:
   - `ADMIN_TOKEN` - A strong random string for admin access
   - `KEY_PEPPER` - A strong random string for key hashing
   - `ODIA_UPSTREAM_KEY` - Your upstream TTS service API key
   - `DATABASE_URL` - Your Supabase PostgreSQL connection URL

3. **Update Prisma Configuration**:
   - Modify `prisma/schema.prisma` to use PostgreSQL:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```

4. **Set up Render**:
   - Connect your GitHub repository to Render
   - Choose "Web Service" as the service type
   - Set the build command to: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - Set the start command to: `npm start`
   - Add the environment variables mentioned above

5. **Deploy**:
   - Push to your GitHub repository
   - Render will automatically deploy your application

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - React framework
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Prisma Documentation](https://www.prisma.io/docs/) - Database toolkit
- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying) - Deployment guides