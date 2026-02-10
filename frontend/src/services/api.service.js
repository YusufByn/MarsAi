/**
 * Service API pour gérer les appels au backend
 */

// URL de base de l'API - à ajuster selon votre configuration
const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:4000/api';

/**
 * Créer une vidéo (métadonnées uniquement, sans fichiers)
 * @param {Object} videoData - Données de la vidéo
 * @returns {Promise<Object>} - Réponse avec l'ID de la vidéo créée
 */
export const createVideo = async (videoData) => {
  try {
    // Mapper les données du frontend vers le format backend
    const step1 = videoData.step1 || {};
    const step2 = videoData.step2 || {};
    const step3 = videoData.step3 || {};
    
    // Créer un objet JSON avec les métadonnées uniquement (pas de fichiers)
    const videoMetadata = {
      // Données personnelles (step1)
      email: step1.email || null,
      realisator_name: step1.firstName || null,
      realisator_lastname: step1.lastName || null,
      realisator_gender: step1.gender || null,
      country: step1.country || null,
      fixe_number: step1.phoneNumber || null,
      mobile_number: step1.mobileNumber || null,
      address: step1.address || null,
      acquisition_source: step1.acquisitionSource || null,
      
      // Données de la vidéo (step2)
      title: step2.title || null,
      title_en: step2.titleEN || null,
      language: step2.language || null,
      synopsis: step2.synopsis || null,
      synopsis_en: step2.synopsisEN || null,
      tech_resume: step2.techResume || null,
      creative_resume: step2.creativeResume || null,
      classification: step2.classification || 'hybrid',
      
      // Rights accepted (obligatoire)
      rights_accepted: step3.rightsAccepted ? 1 : 0
    };
    
    const response = await fetch(`${API_BASE_URL}/upload/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoMetadata),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la création de la vidéo');
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
 * @param {string} _recaptchaToken - Token reCAPTCHA (réservé pour usage futur)
 * @returns {Promise<Object>} - Réponse complète
 */
export const submitCompleteForm = async (formData, _recaptchaToken) => {
  try {
    // Étape 1: Créer la vidéo (métadonnées uniquement)
    console.log('📤 Création de la vidéo...');
    const videoResponse = await createVideo(formData);
    
    if (!videoResponse.success || !videoResponse.video || !videoResponse.video.id) {
      throw new Error('Erreur lors de la création de la vidéo');
    }
    
    const videoId = videoResponse.video.id;
    console.log('✅ Vidéo créée avec l\'ID:', videoId);
    
    // Étape 2: Upload des fichiers (en parallèle si possible)
    const uploadPromises = [];
    
    if (formData.step3?.videoFile) {
      console.log('📤 Upload de la vidéo...');
      uploadPromises.push(
        uploadVideoFile(videoId, formData.step3.videoFile)
          .then(() => console.log('✅ Vidéo uploadée'))
          .catch(err => {
            console.error('❌ Erreur upload vidéo:', err);
            throw new Error('Erreur lors de l\'upload de la vidéo: ' + err.message);
          })
      );
    }
    
    if (formData.step3?.coverImage) {
      console.log('📤 Upload de la couverture...');
      uploadPromises.push(
        uploadCover(videoId, formData.step3.coverImage)
          .then(() => console.log('✅ Couverture uploadée'))
          .catch(err => {
            console.error('❌ Erreur upload couverture:', err);
            throw new Error('Erreur lors de l\'upload de la couverture: ' + err.message);
          })
      );
    }
    
    const stillFiles = [
      formData.step3?.still1,
      formData.step3?.still2,
      formData.step3?.still3
    ].filter(Boolean);
    
    if (stillFiles.length > 0) {
      console.log(`📤 Upload de ${stillFiles.length} image(s) still...`);
      uploadPromises.push(
        uploadStills(videoId, stillFiles)
          .then(() => console.log('✅ Stills uploadées'))
          .catch(err => {
            console.error('❌ Erreur upload stills:', err);
            throw new Error('Erreur lors de l\'upload des stills: ' + err.message);
          })
      );
    }
    
    if (formData.step3?.subtitle) {
      console.log('📤 Upload des sous-titres...');
      uploadPromises.push(
        uploadSubtitles(videoId, formData.step3.subtitle)
          .then(() => console.log('✅ Sous-titres uploadés'))
          .catch(err => {
            console.error('❌ Erreur upload sous-titres:', err);
            throw new Error('Erreur lors de l\'upload des sous-titres: ' + err.message);
          })
      );
    }
    
    // Attendre que tous les uploads soient terminés
    if (uploadPromises.length > 0) {
      await Promise.all(uploadPromises);
      console.log('✅ Tous les fichiers uploadés');
    }
    
    // Étape 3: Ajouter les contributeurs (si présents)
    if (formData.step1?.contributors && formData.step1.contributors.length > 0) {
      console.log('📤 Envoi des contributeurs...');
      const contributorsResponse = await addContributors(videoId, formData.step1.contributors);
      console.log('✅ Contributeurs ajoutés:', contributorsResponse.contributors?.length || 0);
    }
    
    // Étape 4: Ajouter les réseaux sociaux (si présents)
    if (formData.step2?.socialMedia && formData.step2.socialMedia.length > 0) {
      console.log('📤 Envoi des réseaux sociaux...');
      const socialMediaResponse = await addSocialMedia(videoId, formData.step2.socialMedia);
      console.log('✅ Réseaux sociaux ajoutés:', socialMediaResponse.social_media?.length || 0);
    }
    
    console.log('✅ Formulaire complet soumis avec succès!');
    
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
