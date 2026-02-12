/**
 * Service API pour gérer les appels au backend
 */

// URL de base de l'API - à ajuster selon votre configuration
const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:4000/api';

const MIME_BY_EXTENSION = {
  '.mp4': 'video/mp4',
  '.mpeg4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.mkv': 'video/x-matroska',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.srt': 'text/plain',
};

const normalizeFileForUpload = (file, fallbackMimeType = '') => {
  if (!file) return null;

  const fileName = (file.name || '').toLowerCase();
  const extension = fileName.includes('.') ? `.${fileName.split('.').pop()}` : '';
  const mappedMimeType = MIME_BY_EXTENSION[extension] || fallbackMimeType || file.type || '';

  if (!mappedMimeType || file.type === mappedMimeType) {
    return file;
  }

  return new File([file], file.name, {
    type: mappedMimeType,
    lastModified: file.lastModified || Date.now(),
  });
};

/**
 * Créer une vidéo (métadonnées uniquement, sans fichiers)
 * @param {Object} videoData - Données de la vidéo
 * @param {string} recaptchaToken - Token reCAPTCHA v2
 * @returns {Promise<Object>} - Réponse avec l'ID de la vidéo créée
 */
export const createVideo = async (videoData, recaptchaToken) => {
  try {
    // Mapper les données du frontend vers le format backend (requête unique multipart)
    const step1 = videoData.step1 || {};
    const step2 = videoData.step2 || {};
    const step3 = videoData.step3 || {};

    const formData = new FormData();

    // Champs texte backend
    const textFields = {
      email: step1.email || '',
      realisator_name: step1.firstName || '',
      realisator_lastname: step1.lastName || '',
      realisator_gender: step1.gender || '',
      country: step1.country || '',
      fixe_number: step1.phoneNumber || '',
      mobile_number: step1.mobileNumber || '',
      address: step1.address || '',
      acquisition_source: step1.acquisitionSource || '',
      title: step2.title || '',
      title_en: step2.titleEN || '',
      language: step2.language || '',
      synopsis: step2.synopsis || '',
      synopsis_en: step2.synopsisEN || '',
      tech_resume: step2.techResume || '',
      creative_resume: step2.creativeResume || '',
      classification: step2.classification || 'hybrid',
      duration: step3.duration || '',
      rights_accepted: step3.rightsAccepted ? '1' : '0',
      recaptchaToken: recaptchaToken || ''
    };

    Object.entries(textFields).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Tags: le backend attend un tableau dans req.body.tags
    if (Array.isArray(step2.tags) && step2.tags.length > 0) {
      const tagNames = step2.tags
        .map((tag) => tag?.value || tag?.label || tag)
        .filter(Boolean);

      tagNames.forEach((tag) => {
        formData.append('tags', String(tag));
      });
    }

    // Fichiers (noms de champs attendus par multer backend)
    const normalizedVideo = normalizeFileForUpload(step3.videoFile, 'video/mp4');
    const normalizedCover = normalizeFileForUpload(step3.coverImage, 'image/jpeg');
    const normalizedStill1 = normalizeFileForUpload(step3.still1, 'image/jpeg');
    const normalizedStill2 = normalizeFileForUpload(step3.still2, 'image/jpeg');
    const normalizedStill3 = normalizeFileForUpload(step3.still3, 'image/jpeg');
    const normalizedSubtitle = normalizeFileForUpload(step3.subtitle, 'text/plain');

    if (normalizedVideo) formData.append('video', normalizedVideo);
    if (normalizedCover) formData.append('cover', normalizedCover);
    if (normalizedStill1) formData.append('stills', normalizedStill1);
    if (normalizedStill2) formData.append('stills', normalizedStill2);
    if (normalizedStill3) formData.append('stills', normalizedStill3);
    if (normalizedSubtitle) formData.append('srt', normalizedSubtitle);

    const response = await fetch(`${API_BASE_URL}/upload/video`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Erreur lors de la création de la vidéo');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur createVideo:', error);
    throw error;
  }
};

/**
 * Upload du fichier vidéo
 * @param {number} videoId - ID de la vidéo
 * @param {File} videoFile - Fichier vidéo à uploader
 * @returns {Promise<Object>} - Réponse avec les détails du fichier uploadé
 */
export const uploadVideoFile = async (videoId, videoFile) => {
  try {
    const formData = new FormData();
    formData.append('file', videoFile);
    
    const response = await fetch(`${API_BASE_URL}/upload/videos/${videoId}/upload-video`, {
      method: 'PUT',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'upload de la vidéo');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur uploadVideoFile:', error);
    throw error;
  }
};

/**
 * Upload de l'image de couverture
 * @param {number} videoId - ID de la vidéo
 * @param {File} coverFile - Fichier image de couverture
 * @returns {Promise<Object>} - Réponse avec les détails du fichier uploadé
 */
export const uploadCover = async (videoId, coverFile) => {
  try {
    const formData = new FormData();
    formData.append('file', coverFile);
    
    const response = await fetch(`${API_BASE_URL}/upload/videos/${videoId}/upload-cover`, {
      method: 'PUT',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'upload de la couverture');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur uploadCover:', error);
    throw error;
  }
};

/**
 * Upload des images stills
 * @param {number} videoId - ID de la vidéo
 * @param {Array<File>} stillFiles - Tableau de fichiers images stills
 * @returns {Promise<Object>} - Réponse avec les détails des fichiers uploadés
 */
export const uploadStills = async (videoId, stillFiles) => {
  try {
    const formData = new FormData();
    
    // Ajouter tous les fichiers stills
    stillFiles.forEach(file => {
      if (file) formData.append('files', file);
    });
    
    const response = await fetch(`${API_BASE_URL}/upload/videos/${videoId}/upload-stills`, {
      method: 'PUT',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'upload des stills');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur uploadStills:', error);
    throw error;
  }
};

/**
 * Upload du fichier de sous-titres
 * @param {number} videoId - ID de la vidéo
 * @param {File} subtitleFile - Fichier de sous-titres SRT
 * @returns {Promise<Object>} - Réponse avec les détails du fichier uploadé
 */
export const uploadSubtitles = async (videoId, subtitleFile) => {
  try {
    const formData = new FormData();
    formData.append('file', subtitleFile);
    
    const response = await fetch(`${API_BASE_URL}/upload/videos/${videoId}/upload-subtitles`, {
      method: 'PUT',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'upload des sous-titres');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur uploadSubtitles:', error);
    throw error;
  }
};

/**
 * Ajouter des contributeurs à une vidéo
 * @param {number} videoId - ID de la vidéo
 * @param {Array} contributors - Liste des contributeurs
 * @returns {Promise<Object>} - Réponse avec les contributeurs ajoutés
 */
export const addContributors = async (videoId, contributors) => {
  try {
    // Vérifier que nous avons des contributeurs
    if (!contributors || contributors.length === 0) {
      console.log('Aucun contributeur à ajouter');
      return { success: true, contributors: [] };
    }
    
    const response = await fetch(`${API_BASE_URL}/upload/videos/${videoId}/contributors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contributors }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'ajout des contributeurs');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur addContributors:', error);
    throw error;
  }
};

/**
 * Ajouter des réseaux sociaux à une vidéo
 * @param {number} videoId - ID de la vidéo
 * @param {Array} socialMedia - Liste des liens réseaux sociaux
 * @returns {Promise<Object>} - Réponse avec les réseaux sociaux ajoutés
 */
export const addSocialMedia = async (videoId, socialMedia) => {
  try {
    if (!socialMedia || socialMedia.length === 0) {
      console.log('Aucun réseau social à ajouter');
      return { success: true, social_media: [] };
    }
    
    const response = await fetch(`${API_BASE_URL}/upload/videos/${videoId}/social-media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ social_media: socialMedia }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'ajout des réseaux sociaux');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur addSocialMedia:', error);
    throw error;
  }
};

/**
 * Soumettre l'ensemble du formulaire (vidéo + fichiers + contributeurs + réseaux sociaux)
 * @param {Object} formData - Toutes les données du formulaire
 * @param {string} recaptchaToken - Token reCAPTCHA
 * @returns {Promise<Object>} - Réponse complète
 */
export const submitCompleteForm = async (formData, recaptchaToken) => {
  try {
    // Backend actuel: un seul endpoint gère métadonnées + fichiers
    console.log('📤 Création de la vidéo (soumission unique)...');
    const videoResponse = await createVideo(formData, recaptchaToken);

    if (!videoResponse?.success) {
      throw new Error(videoResponse?.message || 'Erreur lors de la création de la vidéo');
    }

    const videoId = videoResponse?.data?.video || null;
    console.log('✅ Soumission backend réussie. ID vidéo:', videoId);

    return {
      success: true,
      videoId,
      message: 'Votre vidéo a été soumise avec succès!'
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la soumission du formulaire:', error);
    throw error;
  }
};

export default {
  createVideo,
  uploadVideoFile,
  uploadCover,
  uploadStills,
  uploadSubtitles,
  addContributors,
  addSocialMedia,
  submitCompleteForm
};
