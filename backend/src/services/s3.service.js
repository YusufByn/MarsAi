import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';

const s3Client = new S3Client({
  endpoint: process.env.SCALEWAY_ENDPOINT,
  region: process.env.SCALEWAY_REGION,
  credentials: {
    accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
    secretAccessKey: process.env.SCALEWAY_SECRET_KEY,
  },
  forcePathStyle: false,
});

/**
 * Construit la clé S3 pour un fichier.
 * Ex: buildS3Key('videos', '1234567.mp4') => 'grp1/videos/1234567.mp4'
 */
export const buildS3Key = (subfolder, filename) => {
  return `${process.env.SCALEWAY_FOLDER}/${subfolder}/${filename}`;
};

/**
 * Construit l'URL publique virtual-hosted d'un objet S3.
 * Ex: 'https://brdx.s3.fr-par.scw.cloud/grp1/videos/1234567.mp4'
 */
export const buildS3Url = (s3Key) => {
  return `https://${process.env.SCALEWAY_BUCKET_NAME}.s3.${process.env.SCALEWAY_REGION}.scw.cloud/${s3Key}`;
};

/**
 * Upload un fichier local vers S3.
 * @param {string} localPath - Chemin absolu local du fichier
 * @param {string} s3Key     - Clé S3 de destination (ex: 'grp1/videos/fichier.mp4')
 * @param {string} mimeType  - Content-Type du fichier
 * @returns {Promise<string>} URL publique du fichier sur S3
 */
export const uploadFileToS3 = async (localPath, s3Key, mimeType) => {
  const fileStream = createReadStream(localPath);

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.SCALEWAY_BUCKET_NAME,
    Key: s3Key,
    Body: fileStream,
    ContentType: mimeType,
    ACL: 'public-read',
  }));

  return buildS3Url(s3Key);
};

/**
 * Supprime un objet S3 par sa clé.
 * @param {string} s3Key - Clé S3 de l'objet à supprimer
 */
export const deleteFileFromS3 = async (s3Key) => {
  await s3Client.send(new DeleteObjectCommand({
    Bucket: process.env.SCALEWAY_BUCKET_NAME,
    Key: s3Key,
  }));
};
