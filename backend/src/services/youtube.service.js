import fs from 'fs';
import { env } from '../config/env.js';
import { google } from 'googleapis';


// fonction pour obtenir le client oAuth
const getOAuthClient = () => {
  const client = new google.auth.OAuth2(
    env.youtube.clientId,
    env.youtube.clientSecret,
    env.youtube.redirectUrl
  );

  //mettre les credentials pour l'authentification OAuth
  client.setCredentials({
    refresh_token: env.youtube.refreshToken
  });

  //retourner le client oAuth
  return client;
};

// fonction pour obtenir le client YouTube
const getYoutubeClient = () => {
  //obtenir le client oAuth
  const auth = getOAuthClient();
  //retourner le client YouTube
  return google.youtube({ version: 'v3', auth });
};

// fonction pour uploader un video sur YouTube
export const uploadVideoToYoutube = async (filePath, metadata = {}) => {
  const youtube = getYoutubeClient();

  //obtenir les metadata de la video
  const {
    title = 'Untitled',
    description = '',
    tags = [],
    categoryId = '22', 
    privacyStatus = 'unlisted' 
  } = metadata;

  //upload la video sur YouTube
  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title,
        description,
        tags,
        categoryId
      },
      status: {
        privacyStatus
      }
    },
    media: {
      body: fs.createReadStream(filePath)
    }
  });

  //retourner l'id et l'url de la video
  return {
    youtubeId: response.data.id,
    youtubeUrl: `https://youtu.be/${response.data.id}`
  };
};