import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import { videoModel } from '../../models/video.model.js';
import { sendCustomEmail } from '../../services/email.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PlayerVideoController = {

  /**
   * Recuperer les videos depuis la BDD pour le player
   * GET /api/player/videos?userId=X
   */
  async getVideos(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'Parametre userId requis'
        });
      }

      console.log('[PLAYER] getVideos pour userId:', userId);

      const videos = await videoModel.findForPlayer(parseInt(userId));

      // Filtrer les vidéos dont les fichiers existent réellement
      const validVideos = [];
      for (const video of videos) {
        if (video.video_file_name) {
          const videoPath = path.join(__dirname, '../../../uploads/videos', video.video_file_name);
          try {
            await fs.access(videoPath);
            validVideos.push(video);
          } catch (err) {
            console.log('[PLAYER] Fichier video introuvable:', video.video_file_name);
          }
        }
      }

      const videosWithUrl = validVideos.map(video => ({
        ...video,
        video_url: video.video_file_name ? `/uploads/videos/${video.video_file_name}` : null,
        author: [video.realisator_name, video.realisator_lastname].filter(Boolean).join(' '),
        description: video.synopsis || '',
      }));

      console.log('[PLAYER] Videos trouvees:', videosWithUrl.length, '/', videos.length);

      res.json({
        success: true,
        data: videosWithUrl,
        total: videosWithUrl.length
      });

    } catch (error) {
      console.error('[PLAYER ERROR] getVideos:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la recuperation des videos',
          error: error.message
        });
      }
    }
  },

  /**
   * Recuperer une video specifique par son ID depuis la BDD
   * GET /api/player/videos/:id
   */
  async getVideoById(req, res) {
    try {
      const { id } = req.params;

      const video = await videoModel.findById(parseInt(id));

      if (!video) {
        return res.status(404).json({
          success: false,
          message: 'Video introuvable'
        });
      }

      const videoWithUrl = {
        ...video,
        video_url: video.video_file_name ? `/uploads/videos/${video.video_file_name}` : null,
        author: [video.realisator_name, video.realisator_lastname].filter(Boolean).join(' '),
        description: video.synopsis || '',
      };

      res.json({
        success: true,
        data: videoWithUrl
      });

    } catch (error) {
      console.error('[PLAYER ERROR] getVideoById:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recuperation de la video',
        error: error.message
      });
    }
  },

  /**
   * Stream de video avec support du range (lecture progressive)
   * GET /api/player/stream/:filename
   */
  async streamVideo(req, res) {
    try {
      const { filename } = req.params;
      const videoPath = path.join(__dirname, '../../../uploads/videos', filename);

      try {
        await fs.access(videoPath);
      } catch {
        return res.status(404).json({
          success: false,
          message: 'Fichier video introuvable'
        });
      }

      const stat = await fs.stat(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;

        const readStream = createReadStream(videoPath, { start, end });

        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        readStream.pipe(res);

      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };

        res.writeHead(200, head);
        createReadStream(videoPath).pipe(res);
      }

    } catch (error) {
      console.error('[PLAYER ERROR] streamVideo:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du streaming de la video',
        error: error.message
      });
    }
  },

  /**
   * Envoyer un email au createur de la video
   * POST /api/player/send-email
   * Body: { video_id, user_id, message }
   */
  async sendEmailToCreator(req, res) {
    try {
      const { video_id, user_id, message } = req.body;

      if (!video_id || !user_id || !message) {
        return res.status(400).json({
          success: false,
          message: 'Parametres manquants (video_id, user_id, message requis)'
        });
      }

      // Recuperer la video pour avoir l'email du realisateur
      const video = await videoModel.findById(parseInt(video_id));

      if (!video) {
        return res.status(404).json({
          success: false,
          message: 'Video introuvable'
        });
      }

      if (!video.email) {
        return res.status(400).json({
          success: false,
          message: 'Aucun email associe a cette video'
        });
      }

      console.log('[EMAIL] Envoi email au realisateur:', video.email, 'pour video:', video_id);

      const subject = `MarsAI - Message d'un selecteur a propos de "${video.title}"`;
      const result = await sendCustomEmail(video.email, subject, message);

      if (!result.success) {
        console.error('[EMAIL ERROR] Echec envoi:', result.error);
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'envoi de l\'email'
        });
      }

      console.log('[EMAIL] Email envoye avec succes a:', video.email);

      res.json({
        success: true,
        message: 'Email envoye avec succes',
        data: {
          video_id,
          user_id,
          sent_at: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('[PLAYER ERROR] sendEmailToCreator:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error.message
      });
    }
  },

  /**
   * Ajouter/Retirer une video de la playlist
   * POST /api/player/playlist
   * Body: { video_id, user_id, playlist: true/false }
   */
  async togglePlaylist(req, res) {
    try {
      const { video_id, user_id, playlist } = req.body;

      if (!video_id || !user_id || playlist === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Parametres manquants (video_id, user_id, playlist requis)'
        });
      }

      console.log('[PLAYER] Playlist update - Video:', video_id, 'User:', user_id, 'Playlist:', playlist);

      res.json({
        success: true,
        message: playlist ? 'Video ajoutee a la playlist' : 'Video retiree de la playlist',
        data: {
          video_id,
          user_id,
          playlist,
          updated_at: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('[PLAYER ERROR] togglePlaylist:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise a jour de la playlist',
        error: error.message
      });
    }
  }
};

export default PlayerVideoController;
