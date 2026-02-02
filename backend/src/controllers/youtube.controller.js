import { uploadVideoToYoutube } from '../services/youtube.service.js';

export const uploadToYoutube = async (req, res) => {
  try {
    const { filePath, title, description, privacyStatus, tags, categoryId } = req.body;

    if (!filePath) {
      return res.status(400).json({ success: false, message: 'filePath is required' });
    }

    const result = await uploadVideoToYoutube(filePath, {
      title,
      description,
      privacyStatus,
      tags,
      categoryId
    });

    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
};