#!/bin/bash
# Deployment verification script

echo "Verifying ODIADEV TTS API Website deployment..."

# Check if URL is provided
if [ -z "$1" ]; then
  echo "Usage: ./verify-deployment.sh <deployment-url>"
  echo "Example: ./verify-deployment.sh https://your-app.vercel.app"
  exit 1
fi

DEPLOYMENT_URL=$1

echo "Checking homepage..."
curl -s -o /dev/null -w "Homepage response code: %{http_code}\n" $DEPLOYMENT_URL

echo "Checking admin page..."
curl -s -o /dev/null -w "Admin page response code: %{http_code}\n" $DEPLOYMENT_URL/admin

echo "Checking health API..."
curl -s -o /dev/null -w "Health API response code: %{http_code}\n" $DEPLOYMENT_URL/api/health

echo "Checking TTS API (should return 401 without key)..."
curl -s -o /dev/null -w "TTS API response code: %{http_code}\n" -X POST $DEPLOYMENT_URL/api/tts

echo "Checking key issue API (should return 401 without token)..."
curl -s -o /dev/null -w "Key issue API response code: %{http_code}\n" -X POST $DEPLOYMENT_URL/api/admin/keys/issue

echo "Checking key list API (should return 401 without token)..."
curl -s -o /dev/null -w "Key list API response code: %{http_code}\n" -X GET $DEPLOYMENT_URL/api/admin/keys/list

echo "Checking key revoke API (should return 401 without token)..."
curl -s -o /dev/null -w "Key revoke API response code: %{http_code}\n" -X POST $DEPLOYMENT_URL/api/admin/keys/revoke

echo "Deployment verification completed!"