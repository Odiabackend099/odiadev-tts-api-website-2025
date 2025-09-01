# Deployment Checklist

## Pre-deployment

- [ ] Update all environment variables in `.env.example`
- [ ] Verify Prisma schema is compatible with production database
- [ ] Run tests locally to ensure everything works
- [ ] Check that all secrets are properly secured
- [ ] Review and update README.md with deployment instructions
- [ ] Ensure all dependencies are up to date
- [ ] Remove any unnecessary files or directories
- [ ] Verify .gitignore is properly configured
- [ ] Create a final backup of the current working version

## GitHub Repository

- [ ] Initialize Git repository (if not already done)
- [ ] Add and commit all files
- [ ] Create a GitHub repository
- [ ] Push code to GitHub
- [ ] Verify repository contains all necessary files
- [ ] Check that no sensitive information is committed

## Supabase Setup

- [ ] Create Supabase account
- [ ] Create new Supabase project
- [ ] Get database connection URL
- [ ] Note connection parameters for environment variables
- [ ] Set up any necessary database extensions (if required)

## Render Setup

- [ ] Create Render account
- [ ] Connect GitHub repository to Render
- [ ] Create new Web Service
- [ ] Configure build and start commands
- [ ] Set all environment variables:
  - [ ] `ADMIN_TOKEN`
  - [ ] `KEY_PEPPER`
  - [ ] `ODIA_UPSTREAM_KEY`
  - [ ] `DATABASE_URL`
  - [ ] `NODE_ENV`
- [ ] Configure custom domain (if needed)
- [ ] Set up SSL certificate (if needed)
- [ ] Configure auto-deploy settings

## Post-deployment

- [ ] Verify application is running correctly
- [ ] Test all API endpoints
- [ ] Test admin functionality with ADMIN_TOKEN
- [ ] Issue and test API key functionality
- [ ] Test TTS proxy with valid API key
- [ ] Verify database connections are working
- [ ] Check error handling and logging
- [ ] Set up monitoring and alerting
- [ ] Document deployment process and any issues encountered
- [ ] Update team members on deployment status
- [ ] Plan for rollback procedure if needed

## Security Review

- [ ] Verify all secrets are properly secured
- [ ] Check that API keys have appropriate restrictions
- [ ] Ensure HTTPS is enforced
- [ ] Review CORS policies
- [ ] Verify rate limiting is working
- [ ] Check authentication and authorization mechanisms
- [ ] Review database access permissions
- [ ] Ensure proper input validation and sanitization

## Performance and Monitoring

- [ ] Set up application performance monitoring
- [ ] Configure error tracking
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts for critical issues
- [ ] Review and optimize database queries
- [ ] Check caching strategies
- [ ] Verify scalability settings

## Documentation

- [ ] Update deployment documentation
- [ ] Document environment variables
- [ ] Record any deployment issues and solutions
- [ ] Create runbook for common operational tasks
- [ ] Document rollback procedure
- [ ] Update API documentation if needed