import { pool } from '../db/index.js';

/**
 * Upload du fichier vidéo
 * @route PUT /api/upload/videos/:id/upload-video
 */
const uploadVideoFile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que le fichier a été uploadé
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier vidéo fourni',
        field: 'file'
      });
    }
    
    // Vérifier que la vidéo existe
    const [videos] = await pool.execute(
      'SELECT id FROM video WHERE id = ?',
      [id]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vidéo non trouvée'
      });
    }
    
    // Mettre à jour le nom du fichier vidéo
    await pool.execute(
      'UPDATE video SET video_file_name = ? WHERE id = ?',
      [req.file.filename, id]
    );
    
    return res.status(200).json({
      success: true,
      filename: req.file.filename,
      path: `/uploads/videos/${req.file.filename}`,
      size: req.file.size
    });
    
  } catch (error) {
    console.error('Erreur uploadVideoFile:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erreur serveur'
    });
  }
};

/**
 * Upload de l'image de couverture
 * @route PUT /api/upload/videos/:id/upload-cover
 */
const uploadCover = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucune image de couverture fournie',
        field: 'file'
      });
    }
    
    const [videos] = await pool.execute(
      'SELECT id FROM video WHERE id = ?',
      [id]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vidéo non trouvée'
      });
    }
    
    // Mettre à jour le nom du fichier cover
    await pool.execute(
      'UPDATE video SET cover = ? WHERE id = ?',
      [req.file.filename, id]
    );
    
    return res.status(200).json({
      success: true,
      filename: req.file.filename,
      path: `/uploads/covers/${req.file.filename}`,
      size: req.file.size
    });
    
  } catch (error) {
    console.error('Erreur uploadCover:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erreur serveur'
    });
  }
};

/**
 * Upload des images stills (jusqu'à 3)
 * @route PUT /api/upload/videos/:id/upload-stills
 */
const uploadStills = async (req, res) => {
  try {
    const { id } = req.params;
    
    // req.files car on accepte plusieurs fichiers
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucune image still fournie',
        field: 'files'
      });
    }
    
    if (req.files.length > 3) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 3 images stills autorisées',
        field: 'files'
      });
    }
    
    const [videos] = await pool.execute(
      'SELECT id FROM video WHERE id = ?',
      [id]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vidéo non trouvée'
      });
    }
    
    // Insérer les stills dans la table still
    const insertedStills = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const [result] = await pool.execute(
        'INSERT INTO still (video_id, file_name, sort_order) VALUES (?, ?, ?)',
        [id, file.filename, i + 1]
      );
      
      insertedStills.push({
        id: result.insertId,
        filename: file.filename,
        path: `/uploads/stills/${file.filename}`,
        size: file.size,
        sort_order: i + 1
      });
    }
    
    return res.status(200).json({
      success: true,
      stills: insertedStills
    });
    
  } catch (error) {
    console.error('Erreur uploadStills:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erreur serveur'
    });
  }
};

/**
 * Upload du fichier de sous-titres SRT
 * @route PUT /api/upload/videos/:id/upload-subtitles
 */
const uploadSubtitles = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier de sous-titres fourni',
        field: 'file'
      });
    }
    
    const [videos] = await pool.execute(
      'SELECT id FROM video WHERE id = ?',
      [id]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vidéo non trouvée'
      });
    }
    
    // Mettre à jour le nom du fichier SRT
    await pool.execute(
      'UPDATE video SET srt_file_name = ? WHERE id = ?',
      [req.file.filename, id]
    );
    
    return res.status(200).json({
      success: true,
      filename: req.file.filename,
      path: `/uploads/srt/${req.file.filename}`,
      size: req.file.size
    });
    
  } catch (error) {
    console.error('Erreur uploadSubtitles:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erreur serveur'
    });
  }
};

export default {
  uploadVideoFile,
  uploadCover,
  uploadStills,
  uploadSubtitles
};
