import { countdownModel } from '../../models/cms/countdown.model.js';

/**
 * Récupérer les données de la homepage (CMS)
 * GET /api/homepage
 */
export const getHomepage = async (req, res) => {
  try {
    const phaseDate = await countdownModel.getPhaseDate();
    
    res.json({
      success: true,
      countdown: {
        phaseDate: phaseDate || null
      }
    });
  } catch (error) {
    console.error('Error getting homepage:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching homepage data' 
    });
  }
};
