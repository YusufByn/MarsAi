import youtubeUtil from "../utils/youtube.util.js";
import {
  createVideo,
  addContributors,
  addTags,
  addStills,
  addSocialMedia,
  createAdminStatus,
  getUserVideos,
  getVideoByIdWithDetails
} from "../models/video.model.js";
import { getVideoDuration } from "../utils/video.util.js";
import fs from 'fs';

export async function validateYoutubeUrl(req, res) {    

    const { youtube_url } = req.body;
    // condition pour verifier qu'une url youtube est valide
    if (!youtubeUtil.validateYoutubeVideo(youtube_url)) {
      return res.status(400).json({ 
        success: false,
        message: "Youtube url not valid",
        error: "Youtube url not valid"
      });
    }
}

export async function submitVideo(req, res) {
    
  try {
      // 1. EXTRACTION DES DONNÉES DU FORMULAIRE
      const {
          // Médias
          youtube_url,
          
          // Titres
          title,
          title_en,
          
          // Synopsis
          synopsis,
          synopsis_en,
          
          // Métadonnées
          language,
          country,
          duration,
          classification,
          
          // Résumés techniques
          tech_resume,
          creative_resume,
          
          // Infos réalisateur (IMPORTANT - stockées dans table video)
          realisator_name,
          realisator_lastname,
          realisator_gender,
          email,
          birthday,
          mobile_number,
          fixe_number,
          address,
          acquisition_source,
          
          // Droits
          rights_accepted,
          
          // Relations (JSON stringifié depuis le frontend)
          contributors,
          tags,
          social_media
      } = req.body;

      // 2. VALIDATION DES CHAMPS OBLIGATOIRES
      if (!title) {
          // Supprimer fichier si uploadé
          if (req.file && fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
          }
          return res.status(400).json({
              success: false,
              message: 'Le titre est obligatoire'
          });
      }

      if (!synopsis) {
          if (req.file && fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
          }
          return res.status(400).json({
              success: false,
              message: 'Le synopsis est obligatoire'
          });
      }

      if (!rights_accepted || rights_accepted !== 'true') {
          if (req.file && fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
          }
          return res.status(400).json({
              success: false,
              message: 'L\'acceptation des droits est obligatoire'
          });
      }

      // Vérifier les infos réalisateur (minimum email)
      if (!email) {
          if (req.file && fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
          }
          return res.status(400).json({
              success: false,
              message: 'L\'email du réalisateur est obligatoire'
          });
      }

      // 3. GESTION DES FICHIERS UPLOADÉS
      let videoFileName = null;
      let coverUrl = null;
      let srtFileName = null;
      let videoDuration = duration ? parseInt(duration) : null;

      // CAS 1 : URL YouTube fournie
      if (youtube_url) {
          
          // Validation URL YouTube
          if (!youtubeUtil.validateYoutubeVideo(youtube_url)) {
              if (req.file && fs.existsSync(req.file.path)) {
                  fs.unlinkSync(req.file.path);
              }
              return res.status(400).json({
                  success: false,
                  message: 'URL YouTube invalide'
              });
          }

          // TODO Sprint 1 - Dev 4 : Récupérer métadonnées YouTube API
          // const ytData = await getYouTubeMetadata(youtube_url);
          // videoDuration = ytData.duration;
          // coverUrl = ytData.thumbnail;
          
      } 
      // CAS 2 : Upload fichier vidéo local
      else if (req.file) {
          
          // Récupérer la durée réelle avec ffmpeg
          try {
              const realDuration = await getVideoDuration(req.file.path);
              
              // Validation durée (courts-métrages max 30 minutes)
              if (realDuration > 1800) {
                  fs.unlinkSync(req.file.path);
                  return res.status(400).json({
                      success: false,
                      message: `La vidéo est trop longue (${Math.round(realDuration/60)} min). Maximum : 30 minutes`
                  });
              }

              videoFileName = req.file.filename;
              videoDuration = Math.floor(realDuration);
              
          } catch (error) {
              console.error('Erreur lecture durée vidéo:', error);
              if (fs.existsSync(req.file.path)) {
                  fs.unlinkSync(req.file.path);
              }
              return res.status(400).json({
                  success: false,
                  message: 'Impossible de lire la vidéo. Format invalide ou fichier corrompu.'
              });
          }
      } 
      // CAS 3 : Ni YouTube ni fichier
      else {
          return res.status(400).json({
              success: false,
              message: 'Vous devez fournir soit un fichier vidéo soit une URL YouTube'
          });
      }

      // 4. PRÉPARER LES DONNÉES POUR LA BDD
      const videoData = {
          // user_id = 1 par défaut (admin qui gérera la modération)
          // Les vrais réalisateurs n'ont PAS de compte
          user_id: 1,  
          
          // Médias
          youtube_url: youtube_url || null,
          video_file_name: videoFileName,
          cover: coverUrl || null,
          srt_file_name: srtFileName,
          
          // Titres
          title,
          title_en: title_en || null,
          
          // Synopsis
          synopsis,
          synopsis_en: synopsis_en || null,
          
          // Métadonnées
          language: language || null,
          country: country || null,
          duration: videoDuration,
          classification: classification || 'hybrid',
          
          // Résumés
          tech_resume: tech_resume || null,
          creative_resume: creative_resume || null,
          
          // Infos réalisateur (IMPORTANT)
          realisator_name: realisator_name || null,
          realisator_lastname: realisator_lastname || null,
          realisator_gender: realisator_gender || null,
          email: email,
          birthday: birthday || null,
          mobile_number: mobile_number || null,
          fixe_number: fixe_number || null,
          address: address || null,
          acquisition_source: acquisition_source || null,
          
          // Droits
          rights_accepted: 1
      };

      // 5. CRÉER LA VIDÉO EN BDD
      const videoId = await createVideo(videoData);

      // 6. AJOUTER LES CONTRIBUTORS (si fournis)
      if (contributors) {
          try {
              const contributorsArray = typeof contributors === 'string' 
                  ? JSON.parse(contributors) 
                  : contributors;
              
              if (Array.isArray(contributorsArray) && contributorsArray.length > 0) {
                  await addContributors(videoId, contributorsArray);
              }
          } catch (error) {
              console.error('Erreur ajout contributors:', error);
              // Ne pas bloquer la soumission si erreur contributors
          }
      }

      // 7. AJOUTER LES TAGS (si fournis)
      if (tags) {
          try {
              const tagsArray = typeof tags === 'string' 
                  ? JSON.parse(tags) 
                  : tags;
              
              if (Array.isArray(tagsArray) && tagsArray.length > 0) {
                  await addTags(videoId, tagsArray);
              }
          } catch (error) {
              console.error('Erreur ajout tags:', error);
              // Ne pas bloquer la soumission si erreur tags
          }
      }

      // 8. AJOUTER LES STILLS (images fixes)
      // TODO: Gérer req.files pour upload multiple
      // if (req.files && req.files.stills) {
      //     await addStills(videoId, req.files.stills);
      // }

      // 9. AJOUTER LES SOCIAL MEDIA (si fournis)
      if (social_media) {
          try {
              const socialMediaArray = typeof social_media === 'string' 
                  ? JSON.parse(social_media) 
                  : social_media;
              
              if (Array.isArray(socialMediaArray) && socialMediaArray.length > 0) {
                  await addSocialMedia(videoId, socialMediaArray);
              }
          } catch (error) {
              console.error('Erreur ajout social media:', error);
              // Ne pas bloquer la soumission si erreur social media
          }
      }

      // 10. CRÉER LE STATUT ADMIN INITIAL = 'draft'
      await createAdminStatus(videoId, 1);  // user_id = 1 (admin)

      // 11. RÉCUPÉRER LA VIDÉO CRÉÉE AVEC TOUS LES DÉTAILS
      const videoCreated = await getVideoByIdWithDetails(videoId);

      // 12. RETOURNER SUCCÈS
      res.status(201).json({
          success: true,
          message: 'Vidéo soumise avec succès ! Elle sera examinée par notre équipe.',
          data: {
              video_id: videoId,
              title: videoCreated.title,
              status: 'draft',
              email: videoCreated.email
          }
      });

  } catch (error) {
      // Nettoyage en cas d'erreur
      if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
      }

      console.error('Erreur soumission vidéo:', error);
      res.status(500).json({
          success: false,
          message: 'Erreur lors de la soumission de la vidéo',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur serveur'
      });
  }
}

// ============================================
// AJOUTER DES CONTRIBUTEURS À UNE VIDÉO
// ============================================
export async function addContributorsToVideo(req, res) {
  try {
    const { id } = req.params;
    const { contributors } = req.body;

    // Validation de base
    if (!id || !contributors || !Array.isArray(contributors)) {
      return res.status(400).json({
        success: false,
        message: 'ID de vidéo et liste de contributeurs requis'
      });
    }

    // Ajout des contributeurs via le model
    await addContributors(id, contributors);

    return res.status(200).json({
      success: true,
      message: 'Contributeurs ajoutés avec succès',
      data: {
        video_id: id,
        contributors_count: contributors.length
      }
    });

  } catch (error) {
    console.error('Erreur ajout contributeurs:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout des contributeurs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur serveur'
    });
  }
}

// ============================================
// AJOUTER DES RÉSEAUX SOCIAUX À UNE VIDÉO
// ============================================
export async function addSocialMediaToVideo(req, res) {
  try {
    const { id } = req.params;
    const { socialMedia } = req.body;

    // Validation de base
    if (!id || !socialMedia || !Array.isArray(socialMedia)) {
      return res.status(400).json({
        success: false,
        message: 'ID de vidéo et liste de réseaux sociaux requis'
      });
    }

    // Ajout des réseaux sociaux via le model
    await addSocialMedia(id, socialMedia);

    return res.status(200).json({
      success: true,
      message: 'Réseaux sociaux ajoutés avec succès',
      data: {
        video_id: id,
        social_media_count: socialMedia.length
      }
    });

  } catch (error) {
    console.error('Erreur ajout réseaux sociaux:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout des réseaux sociaux',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur serveur'
    });
  }
}

// ============================================
// Export par défaut
// ============================================
export default {
  validateYoutubeUrl,
  submitVideo,
  addContributorsToVideo,
  addSocialMediaToVideo
};