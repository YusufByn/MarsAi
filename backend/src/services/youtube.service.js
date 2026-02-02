import fs from 'fs';
import { env } from '../config/env.js';
import { google } from 'googleapis';


const getOAuthClient = () => {
  const client = new google.auth.OAuth2(
    env.youtube.clientId,
    env.youtube.clientSecret,
    env.youtube.redirectUrl
  );

  client.setCredentials({
    refresh_token: env.youtube.refreshToken
  });

  return client;
};

const getYoutubeClient = () => {
  const auth = getOAuthClient();
  return google.youtube({ version: 'v3', auth });
};

export const uploadVideoToYoutube = async (filePath, metadata = {}) => {
  const youtube = getYoutubeClient();

  const {
    title = 'Untitled',
    description = '',
    tags = [],
    categoryId = '22', // People & Blogs (default)
    privacyStatus = 'unlisted' // public | unlisted | private
  } = metadata;

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

  return {
    youtubeId: response.data.id,
    youtubeUrl: `https://youtu.be/${response.data.id}`
  };
};