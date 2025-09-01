# File Structure Organization

This document describes the organized file structure for the ODIADEV TTS API Website, optimized for GitHub deployment and Vercel frontend pickup.

## Root Directory

```
.
├── .env                      # Environment variables (not committed)
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore rules
├── .github/                 # GitHub configurations
│   └── workflows/          # GitHub Actions workflows
├── DEPLOYMENT_VERIFICATION.md # Post-deployment verification guide
├── Dockerfile               # Docker container configuration
├── docker-compose.yml       # Local development with PostgreSQL
├── init-git.sh              # Git initialization script (Unix)
├── init-git.bat             # Git initialization script (Windows)
├── next.config.ts           # Next.js configuration
├── package.json             # Project dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── README.md                # Project documentation
├── render.yaml              # Render deployment configuration
├── src/                     # Source code
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel deployment configuration
├── verify-deployment.sh     # Deployment verification script (Unix)
└── verify-deployment.bat    # Deployment verification script (Windows)
```

## Public Directory

```
public/
├── favicon.ico              # Website favicon
├── manifest.json            # PWA manifest
├── robots.txt               # SEO robots file
├── sitemap.xml              # SEO sitemap
└── sw.js                    # Service worker
```

## Source Directory

```
src/
├── app/                     # Next.js App Router
│   ├── admin/              # Admin dashboard
│   │   └── page.tsx        # Admin page component
│   ├── api/                # API routes
│   │   ├── admin/          # Admin API routes
│   │   │   └── keys/       # Key management APIs
│   │   │       ├── issue/  # Issue key API
│   │   │       │   └── route.ts
│   │   │       ├── list/   # List keys API
│   │   │       │   └── route.ts
│   │   │       └── revoke/ # Revoke key API
│   │   │           └── route.ts
│   │   ├── health/         # Health check API
│   │   │   └── route.ts
│   │   └── tts/            # TTS proxy API
│   │       └── route.ts
│   ├── favicon.ico         # Favicon
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
└── lib/                    # Utility libraries
    ├── adminAuth.ts        # Admin authentication
    └── keys.ts             # Key management utilities
```

## Prisma Directory

```
prisma/
├── schema.prisma           # Database schema (SQLite for development)
├── schema-postgres.prisma  # Database schema (PostgreSQL for production)
├── migrations/             # Database migrations
├── migrate-production.sh   # Production migration script (Unix)
└── migrate-production.bat  # Production migration script (Windows)
```

## Key Features for Deployment

### 1. Vercel Compatibility
- Proper `vercel.json` configuration
- Standard Next.js file structure
- Correct `package.json` scripts
- TypeScript configuration

### 2. GitHub Ready
- `.gitignore` properly configured
- `.github/workflows/` for CI/CD
- Git initialization scripts
- Comprehensive documentation

### 3. Environment Management
- `.env.example` for documentation
- Secure handling of secrets
- Environment-specific configurations

### 4. SEO and PWA
- `robots.txt` for search engines
- `sitemap.xml` for indexing
- `manifest.json` for PWA
- Service worker for caching

### 5. Monitoring and Verification
- Health check API endpoint
- Deployment verification scripts
- Comprehensive documentation

## Deployment Ready Structure

The file structure is organized to ensure:

1. **Frontend Detection**: Vercel will automatically detect the Next.js application
2. **Build Process**: Standard Next.js build process will work without modifications
3. **API Routes**: All API endpoints are properly structured for Next.js
4. **Static Assets**: Public directory assets will be served correctly
5. **Environment Variables**: Proper handling of configuration through environment variables
6. **Database Migrations**: Scripts and configurations for both development and production databases

This organization ensures seamless deployment to Vercel while maintaining compatibility with other deployment platforms like Render.