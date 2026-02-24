import { google } from 'googleapis';
import { env } from '../config/env.js';

// ce fichier permet de lancer le script pour obtenir le refresh token à mettre
// dans son fichier d'environnement .env

const oauth2Client = new google.auth.OAuth2(
  env.youtube.clientId,
  env.youtube.clientSecret,
  env.youtube.redirectUrl
);

// générer l'URL d'autorisation
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ]
});

console.log('Open this URL in your browser:');
console.log(authUrl);

// après consentement, récupérer le code dans l'URL
const code = 'COLLE_LE_CODE_ICI';

async function getTokens() {
  if (code === 'COLLE_LE_CODE_ICI') {
    console.log(' Remplace le code avant de relancer.');
    return;
  }

  const { tokens } = await oauth2Client.getToken(code);

  console.log('Tokens:', tokens);
  console.log('REFRESH TOKEN:', tokens.refresh_token);
}

getTokens();