import { countdownModel } from '../../models/cms/countdown.model.js';

/**
 * Récupérer les informations du countdown (pour le frontend)
 * GET /api/cms/countdown
 */
export const getCountdown = async (req, res) => {
  try {
    const countdownData = await countdownModel.getCountdown();
    
    if (!countdownData || !countdownData.enddate) {
      return res.json({ 
        success: true,
        countdown: false,
        enddate: null,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      });
    }

    const endDate = new Date(countdownData.enddate);
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      return res.json({
        success: true,
        countdown: true,
        enddate: countdownData.enddate,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: true
      });
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    res.json({
      success: true,
      countdown: true,
      enddate: countdownData.enddate,
      days,
      hours,
      minutes,
      seconds,
      expired: false
    });
  } catch (error) {
    console.error('Error getting countdown:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching countdown' 
    });
  }
};