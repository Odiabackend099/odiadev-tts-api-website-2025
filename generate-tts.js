#!/usr/bin/env node

/**
 * Script to generate an API key and use it to generate TTS audio
 * This script assumes the Next.js server is running locally on port 3000
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'your-super-secret-admin-token-here';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const TTS_TEXT = "Hello, this is a 30-second test of the text to speech service. This audio is generated from the ODIADEV TTS API website. You can customize this text to generate any speech you want.";

async function issueApiKey() {
  console.log('Issuing new API key...');
  
  const issueUrl = `${SERVER_URL}/api/admin/keys/issue`;
  
  const issueData = JSON.stringify({
    name: "Terminal TTS Key",
    type: "pk",
    scopes: ["tts:read"],
    ratePerMin: 60,
    dailyQuota: 2000,
    domains: []
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_TOKEN}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(issueUrl, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            console.log('API key issued successfully');
            resolve(response.apiKey);
          } catch (error) {
            reject(new Error(`Failed to parse API key response: ${error.message}`));
          }
        } else {
          reject(new Error(`Failed to issue API key. Status: ${res.statusCode}, Response: ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request error: ${error.message}`));
    });
    
    req.write(issueData);
    req.end();
  });
}

async function generateTTS(apiKey) {
  console.log('Generating TTS audio...');
  
  const ttsUrl = `${SERVER_URL}/api/tts`;
  
  const ttsData = JSON.stringify({
    text: TTS_TEXT,
    voice: "naija_female",
    format: "mp3_48k"
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-odia-key': apiKey
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(ttsUrl, options, (res) => {
      if (res.statusCode === 200) {
        const fileName = `tts-output-${Date.now()}.mp3`;
        const filePath = path.join(process.cwd(), fileName);
        const fileStream = fs.createWriteStream(filePath);
        
        res.pipe(fileStream);
        
        fileStream.on('finish', () => {
          console.log(`TTS audio saved to ${filePath}`);
          resolve(filePath);
        });
        
        fileStream.on('error', (error) => {
          reject(new Error(`Failed to save audio file: ${error.message}`));
        });
      } else {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          reject(new Error(`Failed to generate TTS. Status: ${res.statusCode}, Response: ${data}`));
        });
      }
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request error: ${error.message}`));
    });
    
    req.write(ttsData);
    req.end();
  });
}

async function playAudio(filePath) {
  console.log(`Playing audio from ${filePath}`);
  // On Windows, we can use the 'start' command to play the file
  // This will use the default media player
  console.log('Opening audio file with default media player...');
  console.log('Note: Please ensure your system has a default media player set for .mp3 files');
  
  // For Windows
  if (process.platform === 'win32') {
    require('child_process').exec(`start "" "${filePath}"`, (error) => {
      if (error) {
        console.log(`Could not automatically play the file: ${error.message}`);
        console.log(`Please manually open ${filePath} to listen to the audio`);
      }
    });
  } else {
    console.log(`Please manually open ${filePath} to listen to the audio`);
  }
}

async function main() {
  try {
    console.log('Starting TTS generation process...');
    
    // Check if required environment variables are set
    if (!process.env.ADMIN_TOKEN) {
      console.warn('Warning: ADMIN_TOKEN environment variable not set. Using default value.');
      console.warn('Please set ADMIN_TOKEN to your actual admin token for security.');
    }
    
    // Step 1: Issue API key
    const apiKey = await issueApiKey();
    
    // Step 2: Generate TTS with the API key
    const audioFilePath = await generateTTS(apiKey);
    
    // Step 3: Play the audio
    await playAudio(audioFilePath);
    
    console.log('TTS generation and playback completed successfully!');
  } catch (error) {
    console.error('Error in TTS generation process:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { issueApiKey, generateTTS, playAudio };