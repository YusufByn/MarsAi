// Vérification des vidéos gràace à l'outil ffmpeg
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import fs from 'fs';

// path vers les executables ffmpeg et ffprobe
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// fonction pour obtenir la durée d'une vidéo
export async function getVideoDuration(videoPath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.streams[0].duration);
        });
    });
}

// fonction pour valider la durée d'une vidéo
export async function validateVideoDuration(videoPath, options) {
    const { maxDuration } = options;

    // Vérifier que le fichier existe
    if (!fs.existsSync(videoPath)) {
        return {
            valid: false,
            duration: null,
            maxDuration,
            error: 'Video file does not exist'
        };
    }

    return new Promise((resolve) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            // Erreur lors de la lecture des métadonnées
            if (err) {
                return resolve({
                    valid: false,
                    duration: null,
                    maxDuration,
                    error: 'Cannot read video metadata'
                });
            }

            // Récupérer la durée du premier stream
            const duration = metadata.streams[0]?.duration;

            // Vérifier que la durée existe et n'est pas nulle
            if (!duration || duration === 0) {
                return resolve({
                    valid: false,
                    duration: duration || 0,
                    maxDuration,
                    error: 'Video has no duration'
                });
            }

            // Vérifier que la durée ne dépasse pas le maximum
            if (duration > maxDuration) {
                return resolve({
                    valid: false,
                    duration,
                    maxDuration,
                    error: `Video duration exceeds maximum allowed (${duration}s > ${maxDuration}s)`
                });
            }

            // Vidéo valide
            return resolve({
                valid: true,
                duration,
                maxDuration,
                error: null
            });
        });
    });
}


