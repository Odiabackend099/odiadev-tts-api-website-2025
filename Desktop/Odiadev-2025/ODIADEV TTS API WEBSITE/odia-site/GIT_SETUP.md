# Git Repository Setup Guide

This guide explains how to initialize and set up your Git repository for the ODIADEV TTS API Website.

## Prerequisites

1. Git installed on your system
2. GitHub account
3. This project code

## Initialize Local Repository

You can use the provided scripts to initialize your Git repository:

### On macOS/Linux:
```bash
chmod +x init-git.sh
./init-git.sh
```

### On Windows:
```cmd
init-git.bat
```

Or manually initialize:

```bash
git init
git add .
git commit -m "Initial commit: ODIADEV TTS API Website with Admin Panel"
```

## Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "New" button to create a new repository
3. Enter a repository name (e.g., "odia-tts-api")
4. Choose to make it public or private
5. **Do NOT initialize with a README**, .gitignore, or license
6. Click "Create repository"

## Connect Local Repository to GitHub

After creating the repository on GitHub, you'll get a URL like:
```
https://github.com/yourusername/your-repo-name.git
```

Connect your local repository:

```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
```

## Push to GitHub

Push your code to GitHub:

```bash
git push -u origin main
```

Note: If your default branch is named differently (e.g., "master"), use that instead of "main".

## Verify Repository

1. Refresh your GitHub repository page
2. Verify all files have been uploaded
3. Check that no sensitive files (like .env) have been committed
4. Ensure the .gitignore file is working properly

## Next Steps

Once your repository is set up:

1. Set up Render to deploy from your GitHub repository
2. Configure GitHub Actions for automated deployments (if desired)
3. Add collaborators if needed
4. Set up branch protection rules for main branch
5. Configure repository settings as needed

## Troubleshooting

### Error: remote origin already exists
If you get this error, you already have a remote origin set. You can either:
1. Remove the existing origin: `git remote remove origin`
2. Or use a different remote name: `git remote add github https://...`

### Error: failed to push some refs
If you get this error, try:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Forgot to set user details
If Git prompts for user details:
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```