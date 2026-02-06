import { videoModel } from '../models/video.model.js';
import { stillModel } from '../models/still.model.js';
import { tagModel } from '../models/tag.model.js';
import emailService from '../services/email.service.js';
import { generateEditToken } from '../utils/editToken.util.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Controller pour la soumission et modification de vidéos
 */

// ========================================
// CRÉATION DE VIDÉO (POST)
// ========================================

/**
 * Créer une nouvelle soumission de vidéo
 * Route: POST /api/videos/submit
 *
 * @param {Object} req.body - Données validées par validateCreateVideo
 * @param {Object} req.files - Fichiers uploadés (video, cover, srt)
 */
export const createVideo = async (req, res, next) => {
  try {
    // Vérifier que les fichiers obligatoires sont présents
    if (!req.files || !req.files.video || req.files.video.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le fichier vidéo est obligatoire'
      });
    }

    if (!req.files.cover || req.files.cover.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'L\'image de couverture est obligatoire'
      });
    }

    // Les noms de fichiers ont déjà été attachés au body par le middleware attachFileNames
    // req.body.video_file_name
    // req.body.cover
    // req.body.srt_file_name (si présent)

    console.log('[VIDEO] Création de vidéo avec fichiers:', {
      video: req.body.video_file_name,
      cover: req.body.cover,
      srt: req.body.srt_file_name || 'non fourni',
      stills: req.files?.stills ? `${req.files.stills.length} fichiers` : 'aucun'
    });

    if (req.files?.stills) {
      console.log('[VIDEO] Stills reçus:', req.files.stills.map(f => f.filename));
    }

    // Créer la vidéo en base de données
    const newVideo = await videoModel.create(req.body);

    console.log(`[VIDEO] Vidéo créée avec succès - ID: ${newVideo.id}`);

    // Créer les stills si présents
    let stills = [];
    if (req.files && req.files.stills && req.files.stills.length > 0) {
      const stillFileNames = req.files.stills.map(file => file.filename);
      console.log(`[VIDEO] Création de ${stillFileNames.length} stills pour vidéo ${newVideo.id}`);

      try {
        stills = await stillModel.createMultiple(newVideo.id, stillFileNames);
      } catch (stillError) {
        console.error('[VIDEO ERROR] Erreur création stills:', stillError);
        // On continue même si les stills échouent, la vidéo est déjà créée
      }
    }

    // Associer les tags si présents
    let tags = [];
    console.log('[VIDEO] Vérification des tags - req.body.tags:', req.body.tags);
    console.log('[VIDEO] Type de req.body.tags:', typeof req.body.tags);

    if (req.body.tags) {
      try {
        const tagNames = JSON.parse(req.body.tags);
        console.log('[VIDEO] Tags parsés:', tagNames);
        console.log(`[VIDEO] Association de ${tagNames.length} tags pour vidéo ${newVideo.id}`);
        tags = await tagModel.attachToVideo(newVideo.id, tagNames);
      } catch (tagError) {
        console.error('[VIDEO ERROR] Erreur association tags:', tagError);
        // On continue même si les tags échouent
      }
    } else {
      console.log('[VIDEO] Aucun tag à traiter (req.body.tags est vide ou undefined)');
    }

    res.status(201).json({
      success: true,
      message: 'Vidéo soumise avec succès',
      data: {
        video_id: newVideo.id,
        title: newVideo.title,
        video_file: newVideo.video_file_name,
        cover: newVideo.cover,
        stills_count: stills.length,
        tags_count: tags.length
      }
    });

  } catch (error) {
    console.error('[VIDEO ERROR] Erreur lors de la création de vidéo:', error);

    // Supprimer les fichiers uploadés en cas d'erreur DB
    if (req.files) {
      const filesToDelete = [];

      if (req.files.video) filesToDelete.push(...req.files.video);
      if (req.files.cover) filesToDelete.push(...req.files.cover);
      if (req.files.srt) filesToDelete.push(...req.files.srt);
      if (req.files.stills) filesToDelete.push(...req.files.stills);

      filesToDelete.forEach(file => {
        try {
          fs.unlinkSync(file.path);
          console.log(`[VIDEO] Fichier supprimé: ${file.filename}`);
        } catch (unlinkError) {
          console.error(`Erreur suppression fichier ${file.filename}:`, unlinkError);
        }
      });
    }

    next(error);
  }
};

// ========================================
// MODIFICATION DE VIDÉO (PUT)
// ========================================

/**
 * Mettre à jour une vidéo existante
 * Route: PUT /api/videos/:id/update
 *
 * @param {string} req.params.id - ID de la vidéo
 * @param {Object} req.body - Données validées par validateUpdateVideo
 * @param {Object} req.files - Fichiers uploadés (optionnels)
 */
export const updateVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;

    // Vérifier que la vidéo existe
    const existingVideo = await videoModel.findById(videoId);

    if (!existingVideo) {
      // Supprimer les fichiers uploadés si la vidéo n'existe pas
      if (req.files) {
        const filesToDelete = [];
        if (req.files.video) filesToDelete.push(...req.files.video);
        if (req.files.cover) filesToDelete.push(...req.files.cover);
        if (req.files.srt) filesToDelete.push(...req.files.srt);
        if (req.files.stills) filesToDelete.push(...req.files.stills);

        filesToDelete.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Erreur suppression fichier:', unlinkError);
          }
        });
      }

      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    console.log(`[VIDEO] Mise à jour de la vidéo ID: ${videoId}`);

    // Si de nouveaux fichiers sont uploadés, supprimer les anciens
    const oldFilesToDelete = [];

    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        // Supprimer l'ancien fichier vidéo
        if (existingVideo.video_file_name) {
          const oldVideoPath = path.join(__dirname, '../uploads/videos', existingVideo.video_file_name);
          oldFilesToDelete.push(oldVideoPath);
        }
      }

      if (req.files.cover && req.files.cover[0]) {
        // Supprimer l'ancienne cover
        if (existingVideo.cover) {
          const oldCoverPath = path.join(__dirname, '../uploads/covers', existingVideo.cover);
          oldFilesToDelete.push(oldCoverPath);
        }
      }

      if (req.files.srt && req.files.srt[0]) {
        // Supprimer l'ancien fichier SRT
        if (existingVideo.srt_file_name) {
          const oldSrtPath = path.join(__dirname, '../uploads/srt', existingVideo.srt_file_name);
          oldFilesToDelete.push(oldSrtPath);
        }
      }

      if (req.files.stills && req.files.stills.length > 0) {
        // Récupérer les anciens stills pour suppression
        try {
          const oldStills = await stillModel.findByVideoId(videoId);
          oldStills.forEach(still => {
            const oldStillPath = path.join(__dirname, '../uploads/stills', still.file_name);
            oldFilesToDelete.push(oldStillPath);
          });
        } catch (error) {
          console.error('[VIDEO ERROR] Erreur récupération anciens stills:', error);
        }
      }
    }

    // Mettre à jour en base de données
    const updatedVideo = await videoModel.update(videoId, req.body);

    // Gérer les nouveaux stills si présents
    let newStills = [];
    if (req.files && req.files.stills && req.files.stills.length > 0) {
      try {
        // Supprimer les anciens stills de la DB
        await stillModel.deleteByVideoId(videoId);
        console.log(`[VIDEO] Anciens stills supprimés de la DB pour vidéo ${videoId}`);

        // Créer les nouveaux stills
        const stillFileNames = req.files.stills.map(file => file.filename);
        newStills = await stillModel.createMultiple(videoId, stillFileNames);
        console.log(`[VIDEO] ${newStills.length} nouveaux stills créés pour vidéo ${videoId}`);
      } catch (stillError) {
        console.error('[VIDEO ERROR] Erreur gestion stills:', stillError);
      }
    }

    // Gérer les tags si présents
    let newTags = [];
    console.log('[VIDEO] Vérification des tags - req.body.tags:', req.body.tags);
    console.log('[VIDEO] Type de req.body.tags:', typeof req.body.tags);

    if (req.body.tags) {
      try {
        const tagNames = JSON.parse(req.body.tags);
        console.log('[VIDEO] Tags parsés:', tagNames);

        // Supprimer les anciennes associations
        await tagModel.detachFromVideo(videoId);
        console.log(`[VIDEO] Anciens tags détachés pour vidéo ${videoId}`);

        // Créer les nouvelles associations
        newTags = await tagModel.attachToVideo(videoId, tagNames);
        console.log(`[VIDEO] ${newTags.length} nouveaux tags associés pour vidéo ${videoId}`);
      } catch (tagError) {
        console.error('[VIDEO ERROR] Erreur gestion tags:', tagError);
      }
    } else {
      console.log('[VIDEO] Aucun tag à traiter pour la mise à jour (req.body.tags est vide ou undefined)');
    }

    // Supprimer les anciens fichiers après succès DB
    oldFilesToDelete.forEach(filePath => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`[VIDEO] Ancien fichier supprimé: ${path.basename(filePath)}`);
        }
      } catch (unlinkError) {
        console.error('Erreur suppression ancien fichier:', unlinkError);
      }
    });

    console.log(`[VIDEO] Vidéo ${videoId} mise à jour avec succès`);

    res.status(200).json({
      success: true,
      message: 'Vidéo mise à jour avec succès',
      data: {
        video_id: updatedVideo.id,
        title: updatedVideo.title,
        updated_at: updatedVideo.updated_at,
        stills_count: newStills.length,
        tags_count: newTags.length
      }
    });

  } catch (error) {
    console.error('[VIDEO ERROR] Erreur lors de la mise à jour:', error);

    // Supprimer les nouveaux fichiers uploadés en cas d'erreur
    if (req.files) {
      const filesToDelete = [];
      if (req.files.video) filesToDelete.push(...req.files.video);
      if (req.files.cover) filesToDelete.push(...req.files.cover);
      if (req.files.srt) filesToDelete.push(...req.files.srt);
      if (req.files.stills) filesToDelete.push(...req.files.stills);

      filesToDelete.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Erreur suppression fichier:', unlinkError);
        }
      });
    }

    next(error);
  }
};

// ========================================
// RÉCUPÉRATION DE VIDÉO
// ========================================

/**
 * Récupérer une vidéo par son ID
 * Route: GET /api/videos/:id
 */
export const getVideoById = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const video = await videoModel.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    // Récupérer les stills associés
    const stills = await stillModel.findByVideoId(videoId);

    // Récupérer les tags associés
    const tags = await tagModel.findByVideoId(videoId);

    res.status(200).json({
      success: true,
      data: {
        ...video,
        stills: stills,
        tags: tags
      }
    });
  } catch (error) {
    console.error('Erreur récupération vidéo:', error);
    next(error);
  }
};

/**
 * Récupérer toutes les vidéos
 * Route: GET /api/videos
 */
export const getAllVideos = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const videos = await videoModel.findAll({ limit });

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    console.error('Erreur récupération vidéos:', error);
    next(error);
  }
};

// ========================================
// DEMANDE DE MODIFICATION (ADMIN)
// ========================================

/**
 * Demander à un réalisateur de modifier sa vidéo
 * Route: POST /api/upload/:id/request-edit (admin only)
 *
 * Génère un token JWT valide 24h et envoie un email au réalisateur
 *
 * @param {string} req.params.id - ID de la vidéo
 * @param {string} req.body.reason - Raison de la modification (optionnel)
 */
export const requestEdit = async (req, res, next) => {
  try {
    const videoId = req.params.id;

    // Récupérer la vidéo
    const video = await videoModel.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    // Vérifier que la vidéo a un email de réalisateur
    if (!video.email) {
      return res.status(400).json({
        success: false,
        message: 'Cette vidéo n\'a pas d\'email de réalisateur associé'
      });
    }

    console.log(`[ADMIN] Demande de modification pour vidéo ${videoId} par admin ${req.user?.id}`);

    // Générer le token d'édition (valide 24h)
    const editToken = generateEditToken({
      id: video.id,
      updated_at: video.updated_at || new Date()
    });

    // Envoyer l'email au réalisateur
    try {
      const emailResult = await emailService.sendVideoEditRequestEmail(video, editToken);

      if (!emailResult.success) {
        throw new Error(emailResult.error || 'Échec de l\'envoi de l\'email');
      }

      console.log(`[ADMIN] Email de modification envoyé à ${video.email} - Message ID: ${emailResult.messageId}`);

      res.status(200).json({
        success: true,
        message: `Email de modification envoyé à ${video.email}`,
        data: {
          video_id: video.id,
          video_title: video.title,
          recipient: video.email,
          token_validity: '24 heures',
          email_sent: true
        }
      });

    } catch (emailError) {
      console.error('[ADMIN ERROR] Erreur envoi email:', emailError);

      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: emailError.message,
        hint: 'Le token a été généré mais l\'email n\'a pas pu être envoyé. Vérifiez la configuration SMTP.'
      });
    }

  } catch (error) {
    console.error('[ADMIN ERROR] Erreur lors de la demande de modification:', error);
    next(error);
  }
};

// ========================================
// EXPORTS
// ========================================

export default {
  createVideo,
  updateVideo,
  getVideoById,
  getAllVideos,
  requestEdit
};
