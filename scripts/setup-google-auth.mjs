/**
 * One-time OAuth 2.0 setup script for Google Drive.
 * 
 * Usage:
 *   node scripts/setup-google-auth.mjs
 * 
 * This script will:
 * 1. Generate an authorization URL
 * 2. Wait for you to paste back the authorization code
 * 3. Exchange the code for tokens
 * 4. Print the refresh_token to add to your .env.local
 */

import { google } from 'googleapis';
import { createInterface } from 'readline';
import * as fs from 'fs';
import * as path from 'path';

// Try to load env variables from .env.local manually
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  // Ignore env loading errors
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n❌ Error: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not found in .env.local or environment variables.');
  console.error('   Please make sure they are configured in .env.local first.\n');
  process.exit(1);
}

const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/drive'],
});

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║        Google Drive OAuth 2.0 Setup                     ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');
console.log('Step 1: Open this URL in your browser:\n');
console.log(`  ${authUrl}\n`);
console.log('Step 2: Sign in with your Google account and grant access.');
console.log('Step 3: Copy the authorization code and paste it below.\n');

const rl = createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter the authorization code: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());

    console.log('\n✅ Success! Here are your tokens:\n');

    if (tokens.refresh_token) {
      console.log('─────────────────────────────────────────────');
      console.log('GOOGLE_REFRESH_TOKEN=' + JSON.stringify(tokens.refresh_token));
      console.log('─────────────────────────────────────────────\n');
      console.log('Add the line above to your .env.local file.');
      console.log('This refresh token does not expire unless you revoke access.\n');
    } else {
      console.log('⚠️  No refresh_token received. This usually means you\'ve');
      console.log('   already authorized this app. To force a new refresh token:');
      console.log('   1. Go to https://myaccount.google.com/permissions');
      console.log('   2. Remove access for this app');
      console.log('   3. Run this script again\n');

      if (tokens.access_token) {
        console.log('Access token (temporary, expires soon):');
        console.log(tokens.access_token.substring(0, 40) + '...\n');
      }
    }
  } catch (err) {
    console.error('\n❌ Error exchanging code for tokens:', err.message);
    console.error('   Make sure you copied the full authorization code.');
  } finally {
    rl.close();
  }
});
