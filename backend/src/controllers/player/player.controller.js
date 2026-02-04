import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { createReadStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PlayerVideoController = {
  
  /**
   * Récupérer la liste des vidéos du dossier upload
   * GET /api/player/videos
   */
  async getVideos(req, res) {
    console.log(' getVideos appelé - URL:', req.url);
    console.log(' __dirname:', __dirname);
    try {
      // Chemin depuis src/controllers/player/ vers src/upload/
      // __dirname = backend/src/controllers/player/
      // ../../upload = backend/src/upload/
      let uploadDir = path.join(__dirname, '../../upload');
      console.log('📁 Chemin upload calculé:', uploadDir);
      
      // Vérifier que le dossier existe
      let dirExists = false;
      try {
        await fs.access(uploadDir);
        dirExists = true;
        console.log('Dossier upload existe:', uploadDir);
      } catch (error) {
        console.error(' Dossier upload introuvable:', uploadDir);
        console.error('   Erreur:', error.message);
        console.error('   Code:', error.code);
        
        // Essayer un chemin alternatif
        const altPath = path.join(__dirname, '../../../upload');
        console.log(' Tentative chemin alternatif:', altPath);
        try {
          await fs.access(altPath);
          uploadDir = altPath;
          dirExists = true;
          console.log(' Chemin alternatif trouvé:', uploadDir);
        } catch (altError) {
          console.error(' Chemin alternatif aussi introuvable:', altError.message);
        }
      }
      
      if (!dirExists) {
        return res.status(404).json({
          success: false,
          message: 'Dossier upload introuvable',
          attemptedPath: uploadDir,
          __dirname: __dirname
        });
      }

      // Lire tous les fichiers du dossier
      const files = await fs.readdir(uploadDir);
      console.log('📂 Fichiers trouvés:', files.length);
      
      // Filtrer uniquement les fichiers vidéo (mp4, webm, ogg, mov)
      const videoFiles = files.filter(file => 
        /\.(mp4|webm|ogg|mov)$/i.test(file)
      );

      // Trier par nom (vid1, vid2, etc.)
      videoFiles.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || 0);
        const numB = parseInt(b.match(/\d+/)?.[0] || 0);
        return numA - numB;
      });

      // Créer les objets vidéo avec des données mockées
      const videos = await Promise.all(
        videoFiles.map(async (file, index) => {
          const filePath = path.join(uploadDir, file);
          const stats = await fs.stat(filePath);
          
          return {
            id: String(index + 1),
            filename: file,
            video_url: `/upload/${file}`, // Chemin pour accéder à la vidéo via le serveur statique
            title: this.generateTitle(index + 1),
            description: this.generateDescription(index + 1),
            author: this.generateAuthor(index + 1),
            authorAvatar: null,
            tags: this.generateTags(index + 1),
            thumbnail: null,
            duration: 0, // Pourrait être calculé avec ffprobe si besoin
            likes: this.generateRandomCount(100, 10000),
            comments: this.generateRandomCount(10, 1000),
            views: this.generateRandomCount(1000, 100000),
            size: stats.size,
            createdAt: stats.birthtime
          };
        })
      );

      console.log('✅ Vidéos préparées:', videos.length);
      videos.forEach(v => console.log(`   - ${v.filename} -> ${v.video_url}`));
      res.json({
        success: true,
        data: videos,
        total: videos.length
      });
      console.log('✅ Réponse envoyée');

    } catch (error) {
      console.error('❌ Erreur getVideos:', error);
      console.error('Stack:', error.stack);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la récupération des vidéos',
          error: error.message
        });
      }
    }
  },

  /**
   * Récupérer une vidéo spécifique par son ID (index)
   * GET /api/player/videos/:id
   */
  async getVideoById(req, res) {
    try {
      const { id } = req.params;
      const uploadDir = path.join(__dirname, '../../upload');
      
      const files = await fs.readdir(uploadDir);
      const videoFiles = files
        .filter(file => /\.(mp4|webm|ogg|mov)$/i.test(file))
        .sort((a, b) => {
          const numA = parseInt(a.match(/\d+/)?.[0] || 0);
          const numB = parseInt(b.match(/\d+/)?.[0] || 0);
          return numA - numB;
        });

      const index = parseInt(id) - 1;
      
      if (index < 0 || index >= videoFiles.length) {
        return res.status(404).json({
          success: false,
          message: 'Vidéo introuvable'
        });
      }

      const file = videoFiles[index];
      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);

      const video = {
        id,
        filename: file,
        video_url: `/upload/${file}`, // Chemin pour accéder à la vidéo via le serveur statique
        title: this.generateTitle(parseInt(id)),
        description: this.generateDescription(parseInt(id)),
        author: this.generateAuthor(parseInt(id)),
        authorAvatar: null,
        tags: this.generateTags(parseInt(id)),
        thumbnail: null,
        duration: 0,
        likes: this.generateRandomCount(100, 10000),
        comments: this.generateRandomCount(10, 1000),
        views: this.generateRandomCount(1000, 100000),
        size: stats.size,
        createdAt: stats.birthtime
      };

      res.json({
        success: true,
        data: video
      });

    } catch (error) {
      console.error('Erreur getVideoById:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la vidéo',
        error: error.message
      });
    }
  },

  /**
   * Stream de vidéo avec support du range (lecture progressive)
   * GET /api/player/stream/:filename
   */
  async streamVideo(req, res) {
    try {
      const { filename } = req.params;
      const videoPath = path.join(__dirname, '../../upload', filename);
      
      // Vérifier que le fichier existe
      try {
        await fs.access(videoPath);
      } catch {
        return res.status(404).json({
          success: false,
          message: 'Fichier vidéo introuvable'
        });
      }

      const stat = await fs.stat(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        // Support du range pour la lecture progressive
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
        // Sans range, envoyer la vidéo complète
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
        
        res.writeHead(200, head);
        createReadStream(videoPath).pipe(res);
      }

    } catch (error) {
      console.error('Erreur streamVideo:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du streaming de la vidéo',
        error: error.message
      });
    }
  },

  // Méthodes utilitaires pour générer des données mockées

  generateTitle(index) {
    const titles = [
      "Voyage incroyable en Islande 🌋",
      "Tutoriel cuisine rapide 🍳",
      "Danse du moment - Tendance 💃",
      "Paysage magnifique au coucher du soleil 🌅",
      "Astuce de vie quotidienne 💡",
      "Moment drôle avec mon chat 🐱"
    ];
    return titles[index - 1] || `Vidéo ${index}`;
  },

  generateDescription(index) {
    const descriptions = [
      "Découvrez les paysages époustouflants de l'Islande !",
      "Une recette facile et rapide à réaliser chez vous",
      "La nouvelle chorégraphie qui fait le buzz",
      "Un moment magique capturé au bon moment",
      "Cette astuce va vous changer la vie",
      "Mon chat fait encore des siennes 😂"
    ];
    return descriptions[index - 1] || `Description de la vidéo ${index}`;
  },

  generateAuthor(index) {
    const authors = [
      "TravelWithMe",
      "ChefEnHerbe",
      "DanceQueen",
      "NatureLovers",
      "LifeHacks",
      "CatLover"
    ];
    return authors[index - 1] || `User${index}`;
  },

  generateTags(index) {
    const allTags = [
      ["voyage", "islande", "nature"],
      ["cuisine", "recette", "rapide"],
      ["danse", "tendance", "challenge"],
      ["paysage", "sunset", "beautiful"],
      ["astuce", "lifehack", "diy"],
      ["chat", "funny", "animals"]
    ];
    return allTags[index - 1] || ["video"];
  },

  generateRandomCount(min, max) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.formatCount(count);
  },

  formatCount(count) {
    const num = typeof count === 'string' ? parseFloat(count) : count;
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  /**
   * Envoyer un email au créateur de la vidéo
   * POST /api/player/send-email
   * Body: { video_id, user_id, message }
   */
  async sendEmailToCreator(req, res) {
    try {
      const { video_id, user_id, message } = req.body;

      if (!video_id || !user_id || !message) {
        return res.status(400).json({
          success: false,
          message: 'Paramètres manquants (video_id, user_id, message requis)'
        });
      }

      // TODO: Implémenter l'envoi d'email réel
      // Pour l'instant, on simule juste le succès
      console.log('📧 Email à envoyer:');
      console.log('   Video ID:', video_id);
      console.log('   User ID:', user_id);
      console.log('   Message:', message);

      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 500));

      res.json({
        success: true,
        message: 'Email envoyé avec succès',
        data: {
          video_id,
          user_id,
          sent_at: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Erreur sendEmailToCreator:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error.message
      });
    }
  },

  /**
   * Ajouter/Retirer une vidéo de la playlist
   * POST /api/player/playlist
   * Body: { video_id, user_id, playlist: true/false }
   */
  async togglePlaylist(req, res) {
    try {
      const { video_id, user_id, playlist } = req.body;

      if (!video_id || !user_id || playlist === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Paramètres manquants (video_id, user_id, playlist requis)'
        });
      }

      // TODO: Mettre à jour la base de données (table selector_memo)
      // UPDATE selector_memo SET playlist = ? WHERE video_id = ? AND user_id = ?
      console.log('📋 Playlist update:');
      console.log('   Video ID:', video_id);
      console.log('   User ID:', user_id);
      console.log('   Add to playlist:', playlist ? 'OUI' : 'NON');

      res.json({
        success: true,
        message: playlist ? 'Vidéo ajoutée à la playlist' : 'Vidéo retirée de la playlist',
        data: {
          video_id,
          user_id,
          playlist,
          updated_at: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Erreur togglePlaylist:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la playlist',
        error: error.message
      });
    }
  }
};

export default PlayerVideoController;
