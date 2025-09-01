# Deployment Verification Guide

This guide helps you verify that your ODIADEV TTS API Website has been deployed correctly on Vercel or Render.

## Post-Deployment Checklist

### 1. Frontend Verification

#### Homepage
- [ ] Navigate to your deployed URL (e.g., https://your-app.vercel.app)
- [ ] Verify the landing page loads correctly
- [ ] Check that all sections are displayed (Hero, Features, Demo, Footer)
- [ ] Verify fonts are loading (Inter and Space Grotesk)
- [ ] Check that all links are working
- [ ] Verify responsive design on mobile devices

#### Admin Panel
- [ ] Navigate to `/admin` (e.g., https://your-app.vercel.app/admin)
- [ ] Verify the admin panel loads
- [ ] Test entering the ADMIN_TOKEN
- [ ] Verify the key management interface is functional

### 2. API Endpoints Verification

#### Health Check
- [ ] Visit `/api/health` endpoint
- [ ] Verify response: `{"status":"ok","timestamp":"...","service":"ODIADEV TTS API"}`

#### TTS Proxy
- [ ] Test the TTS endpoint with a valid API key:
  ```bash
  curl -X POST https://your-app.vercel.app/api/tts \
    -H "X-ODIA-Key: YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"text":"Hello, world!","voice":"naija_female","format":"mp3_48k"}' \
    --output test.mp3
  ```
- [ ] Verify you receive audio data

#### Admin API
- [ ] Test issuing a key (requires ADMIN_TOKEN):
  ```bash
  curl -X POST https://your-app.vercel.app/api/admin/keys/issue \
    -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Key","domains":["localhost"],"ratePerMin":60,"dailyQuota":1000}'
  ```
- [ ] Test listing keys:
  ```bash
  curl -X GET https://your-app.vercel.app/api/admin/keys/list \
    -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
  ```
- [ ] Test revoking a key:
  ```bash
  curl -X POST https://your-app.vercel.app/api/admin/keys/revoke \
    -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"prefix":"KEY_PREFIX"}'
  ```

### 3. Security Verification

- [ ] Verify that API endpoints require proper authentication
- [ ] Test that invalid API keys are rejected
- [ ] Verify that revoked keys are rejected
- [ ] Test domain restrictions for API keys
- [ ] Verify rate limiting is working (if implemented)

### 4. Performance and Monitoring

- [ ] Check that the application loads within acceptable time limits
- [ ] Verify that static assets (CSS, JS, fonts) are being cached
- [ ] Test the application under load if possible
- [ ] Verify error handling and logging

### 5. Database Verification

- [ ] Verify that database connections are working
- [ ] Test that data is being stored correctly
- [ ] Verify that migrations have been applied
- [ ] Check that the database is accessible from the application

## Troubleshooting Common Issues

### Frontend Issues

#### Blank Page or 404 Errors
- Check Vercel/Render logs for build errors
- Verify that all environment variables are set correctly
- Ensure the build process completed successfully

#### Styling Issues
- Verify that Tailwind CSS is properly configured
- Check that fonts are loading correctly
- Ensure there are no CSS conflicts

#### JavaScript Errors
- Check browser console for errors
- Verify that all dependencies are installed
- Ensure there are no syntax errors in the code

### API Issues

#### 500 Internal Server Errors
- Check server logs for specific error messages
- Verify that all environment variables are set
- Ensure the database is accessible

#### 401 Unauthorized Errors
- Verify that API keys and tokens are correct
- Check that authentication logic is working
- Ensure environment variables are set correctly

#### 404 Not Found Errors
- Verify that API routes are correctly defined
- Check that the file structure is correct
- Ensure there are no typos in route paths

### Database Issues

#### Connection Errors
- Verify database connection URL
- Check that the database is running
- Ensure network access is configured correctly

#### Migration Issues
- Check that Prisma migrations are applied
- Verify that the database schema matches the Prisma schema
- Ensure the database user has proper permissions

## Monitoring and Maintenance

### Set Up Monitoring
- Configure uptime monitoring
- Set up error tracking
- Implement performance monitoring
- Configure alerts for critical issues

### Regular Maintenance
- Update dependencies regularly
- Apply security patches
- Monitor logs for unusual activity
- Review and update documentation

## Support and Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)