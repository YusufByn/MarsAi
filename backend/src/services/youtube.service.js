import fs from 'fs';
import { env } from '../config/env.js';
import { google } from 'googleapis';


// fonction pour obtenir le client oAuth
const getOAuthClient = () => {
    // const client = nouvel objet oAuth2 dans google auth
  const client = new google.auth.OAuth2(
    // charge mes identitifiants oAuth dans mon env
    env.youtube.clientId,
    env.youtube.clientSecret,
    env.youtube.redirectUrl
  );

  //dans la nouvelle instance de client, on set les identifiants oAuth
  client.setCredentials({
    refresh_token: env.youtube.refreshToken
  });

  //retourner le client oAuth
  return client;
};

// fonction pour obtenir le client YouTube
const getYoutubeClient = () => {
  //const auth égal a notre fonction du haut la
  const auth = getOAuthClient();
  //on retourne le client youtube, avec la version v3 et l'auth
  return google.youtube({ version: 'v3', auth });
};

// fonction pour uploader un video sur YouTube async avec les meta data et chemin du fichier
export const uploadVideoToYoutube = async (filePath, metadata = {}) => {
  
  // const youtube égal a notre fonction du haut la
  const youtube = getYoutubeClient();

  //obtenir les metadata de la video, dans le body de la request (dans le controller)
  const {
    title = 'Untitled',
    description = '',
    tags = [],
    thumbnailPath = '',
    srt_file_name = 'sous-titre',
    srtLanguage = 'fr',
    srtPath = '',
    categoryId = '22', 
    privacyStatus = 'unlisted' 
  } = metadata;

  //const reponse egal a dans youtube on insert les metadatas et le status (privée, non répértoriée), media représente le fichier
  const response = await youtube.videos.insert({
    // la requete est divisé en 2 parties, snippet et status, le status pour le status de la vidéo
    // public ou pv, et le snippet qui est pour les meta data donc titre etc
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

  const videoId = response?.data?.id;

  if(!videoId) {
    throw new Error('Failed to upload video to YouTube');
  }

  console.log('thumbnailPath', thumbnailPath);

  if (thumbnailPath) {
    await youtube.thumbnails.set({
      videoId,
      media: {
        body: fs.createReadStream(thumbnailPath)
      }
    });
  }


  
  // si le chemin du fichier srt existe, on upload le sous-titre
  if (srtPath) {
    // on upload le sous-titre
    await youtube.captions.insert({
      part: ['snippet'],
      requestBody: {
        snippet: {
          videoId,
          language: srtLanguage,
          name: srt_file_name,
          isDraft: false
        }
      },
      media: {
        body: fs.createReadStream(srtPath)
      }
    });
  }

  console.log('videoId', videoId);
  console.log('upload status:', response?.data?.status);
  console.log('video', response.data);

  //retourner l'id et l'url de la video
  return {
    // l'id de la vidéo, quand on fait un console log de la response, on voit l'id
    youtubeId: videoId,
    // l'url de la vidéo, concaténé avec le https://youtu.be/ et l'id de la vidéo
    youtubeUrl: `https://youtu.be/${videoId}`
  };
};