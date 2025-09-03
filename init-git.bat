@echo off
REM Initialize Git repository and make initial commit

echo Initializing Git repository...
git init

echo Adding all files...
git add .

echo Making initial commit...
git commit -m "Initial commit: ODIADEV TTS API Website with Admin Panel"

echo Git repository initialized successfully!
echo Next steps:
echo 1. Create a new repository on GitHub
echo 2. Add the remote origin: git remote add origin ^<your-repo-url^>
echo 3. Push to GitHub: git push -u origin main