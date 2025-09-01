@echo off
REM Deployment verification script

echo Verifying ODIADEV TTS API Website deployment...

REM Check if URL is provided
if "%1"=="" (
  echo Usage: verify-deployment.bat ^<deployment-url^>
  echo Example: verify-deployment.bat https://your-app.vercel.app
  exit /b 1
)

set DEPLOYMENT_URL=%1

echo Checking homepage...
curl -s -o nul -w "Homepage response code: %%{http_code}\n" %DEPLOYMENT_URL%

echo Checking admin page...
curl -s -o nul -w "Admin page response code: %%{http_code}\n" %DEPLOYMENT_URL%/admin

echo Checking health API...
curl -s -o nul -w "Health API response code: %%{http_code}\n" %DEPLOYMENT_URL%/api/health

echo Checking TTS API (should return 401 without key)...
curl -s -o nul -w "TTS API response code: %%{http_code}\n" -X POST %DEPLOYMENT_URL%/api/tts

echo Checking key issue API (should return 401 without token)...
curl -s -o nul -w "Key issue API response code: %%{http_code}\n" -X POST %DEPLOYMENT_URL%/api/admin/keys/issue

echo Checking key list API (should return 401 without token)...
curl -s -o nul -w "Key list API response code: %%{http_code}\n" -X GET %DEPLOYMENT_URL%/api/admin/keys/list

echo Checking key revoke API (should return 401 without token)...
curl -s -o nul -w "Key revoke API response code: %%{http_code}\n" -X POST %DEPLOYMENT_URL%/api/admin/keys/revoke

echo Deployment verification completed!