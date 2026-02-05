import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { createReadStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PlayerVideoController = {
  
  /**
   * Récupérer la liste des vidéos dans le dossier upload
   * via la route GET /api/player/videos
   */
  async getVideos(req, res) {
    console.log(' getVideos appelé - URL:', req.url);
    console.log(' __dirname:', __dirname);
    try {
      // Chemin depuis src/controllers/player/ vers src/upload/
      // __dirname = backend/src/controllers/player/
      // ../../upload = backend/src/upload/
      let uploadDir = path.join(__dirname, '../../upload');
      console.log('Chemin upload calculé:', uploadDir);
      
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

      // on recup tout les fichiers du dossier upload
      const files = await fs.readdir(uploadDir);
      console.log('📂 Fichiers trouvés:', files.length);
      
      // filtre pour les fichiers video
      const videoFiles = files.filter(file => 
        /\.(mp4|webm|ogg|mov)$/i.test(file)
      );

      // parseInt pour recup le nom des fichiers video
      videoFiles.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || 0);
        const numB = parseInt(b.match(/\d+/)?.[0] || 0);
        return numA - numB;
      });

      // test de creation d'object video pour le rechargement de la page
      const videos = await Promise.all(
        videoFiles.map(async (file, index) => {
          const filePath = path.join(uploadDir, file);
          const stats = await fs.stat(filePath);
          
          return {
            // this. permet de faire appel a la fonction de creation des données mockées
            // les données mockées sont des données fictives pour le test
            id: String(index + 1), // on met l'id de la video
            filename: file,
            video_url: `/upload/${file}`, // on met le chemin de la video pour le rechargement de la page
            title: this.generateTitle(index + 1), // on met le titre de la video
            description: this.generateDescription(index + 1), // on met la description de la video
            author: this.generateAuthor(index + 1), // on met l'auteur de la video
            authorAvatar: null, // on met l'avatar de l'auteur de la video
            tags: this.generateTags(index + 1), // on met les tags de la video
            thumbnail: null, // on met l'image de la video
            duration: 0, // Pourrait être calculé avec ffprobe si besoin
            likes: this.generateRandomCount(100, 10000), // on met le nombre de likes de la video
            comments: this.generateRandomCount(10, 1000), // on met le nombre de comments de la video
            views: this.generateRandomCount(1000, 100000), // on met le nombre de views de la video
            size: stats.size, // on met la taille de la video
            createdAt: stats.birthtime // on met la date de creation de la video
          };
        })
      );
      // code jetable en attendant la logique d'upload de video
      console.log('Vidéos préparées:', videos.length);
      videos.forEach(v => console.log(`   - ${v.filename} -> ${v.video_url}`));
      res.json({
        success: true,
        data: videos,
        total: videos.length
      });
      console.log('Réponse envoyée');

    } catch (error) {
      console.error('Erreur getVideos:', error);
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

  // code pour preparer la page video detail
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

  // code pour streamer la video
  // test pour la lecture du de la video
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
  // code jetable avec info de video en dur pour le test

  generateTitle(index) {
    const titles = [
      "Mdrr yusuf is a fat pig",
      "orteil a victor",
      "Ariel nous casse les burnes",
      "l'alchimiste me fais taffer a perte",
      "faut que je pense a appeler ma grand mere",
      "j'ai trop la flemme d'aller courir"
    ];
    return titles[index - 1] || `Vidéo ${index}`;
  },

  generateDescription(index) {
    const descriptions = [
      "ce gros con la",
      "c'est quoi cette horreur frr",
      "Apresje capte 3,2k jme serait vanter aussi",
      "apres azy le cortado c'ets le haut niveau",
      "Nanie je t'aime",
      "av mon gros corp jvais avoir si mal frr"
    ];
    return descriptions[index - 1] || `Description de la vidéo ${index}`;
  },

  generateAuthor(index) {
    const authors = [
      "yusuf",
      "victor",
      "alchimiste",
      "grand mere",
      "j'ai trop la flemme",
      "Course de merde"
    ];
    return authors[index - 1] || `User${index}`;
  },

  generateTags(index) {
    const allTags = [
      ["Claude", "Perplexity", "chatgpt"],
      ["Sonnet", "Gemini 3", "Deepseek"],
      ["Opus", "codex", "Claude"],
      ["Opus", "codex", "Claude"],
      ["Claude", "Perplexity", "chatgpt"],
      ["Claude", "Perplexity", "chatgpt"],
      ["Claude", "Perplexity", "chatgpt"],
    ];
    return allTags[index - 1] || ["video"];
  },
  // code jetable avec info de video en dur pour le test
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

  // mise en place de l'envoi d'email au créateur de la video
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
      console.log('Email à envoyer:');
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
      console.error(' Erreur sendEmailToCreator:', error);
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

      //ici c'est tout les trucs a prevoir et a faire

      // TODO: Mettre à jour la base de données (table selector_memo)
      // UPDATE selector_memo SET playlist = ? WHERE video_id = ? AND user_id = ?
      console.log(' Playlist update:');
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
      console.error(' Erreur togglePlaylist:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la playlist',
        error: error.message
      });
    }
  }
};

export default PlayerVideoController;
