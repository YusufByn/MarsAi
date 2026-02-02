import { uploadVideoToYoutube } from '../services/youtube.service.js';

// fonction pour uploader une video sur YouTube
export const uploadToYoutube = async (req, res) => {
  try {
    // obtenir les metadata de la video, qui sont dans le body de la requête
    const { filePath, title, description, privacyStatus, tags, categoryId } = req.body;

    // si pas de filePath, retourner un message d'erreur
    if (!filePath) {
      return res.status(400).json({ 
        success: false, 
        message: 'filePath is required',
        error: 'filePath is required'
      });
    }

    //upload la video sur YouTube
    const result = await uploadVideoToYoutube(filePath, {
      title,
      description,
      privacyStatus,
      tags,
      categoryId
    });

    //retourner l'id et l'url de la video
    //et un message de succès
    return res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Video uploaded successfully'
    });
  } catch (err) {
    // si erreur, retourner un message d'erreur
    return res.status(500).json({ 
        success: false, 
        message: 'Upload failed', 
        error: err.message 
    });
  }
};