// ============================================
// PARTICIPATION CONTROLLER
// ============================================
// Controller pour gérer la soumission des participations vidéo

/**
 * Soumet une participation vidéo avec tous les fichiers et métadonnées
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function submitParticipation(req, res) {
  try {
    // À ce stade, le reCAPTCHA a déjà été vérifié par le middleware
    console.log('📝 Processing participation submission...');

    // Récupérer les données du formulaire
    const {
      // Données personnelles (étape 1)
      gender,
      firstName,
      lastName,
      email,
      country,
      address,
      phoneNumber,
      mobileNumber,
      acquisitionSource,
      ageVerified,
      
      // Données vidéo (étape 2)
      title,
      language,
      synopsis,
      techResume,
      creativeResume,
      classification,
      tags,
      duration,
      
      // Acceptation des droits (étape 3)
      rightsAccepted
    } = req.body;

    // Récupérer les fichiers uploadés (via multer)
    const files = req.files || {};
    
    console.log('📦 Received data:', {
      personalInfo: { firstName, lastName, email },
      videoInfo: { title, language, classification },
      filesCount: Object.keys(files).length
    });

    // TODO: Validation des données obligatoires
    if (!title || !email || !rightsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // TODO: Sauvegarde en base de données
    // const participation = await saveParticipationToDatabase({ ... });

    // TODO: Upload des fichiers vers le stockage final (S3, local, etc.)
    // const uploadedFiles = await uploadFilesToStorage(files);

    // Réponse de succès
    return res.status(201).json({
      success: true,
      message: 'Participation submitted successfully',
      data: {
        // TODO: Retourner les données enregistrées
        title,
        email,
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error submitting participation:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing your submission',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export { submitParticipation };
