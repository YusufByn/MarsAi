import pool from '../config/db.js';

const tagController = {
  async getAllTags(req, res) {
    try {
      const [rows] = await pool.execute('SELECT id, name FROM tag ORDER BY name ASC');
      res.json({ success: true, data: rows });
    } catch (error) {
      console.log('[TAG ERROR] Erreur lors de la recuperation des tags:', error.message);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  },

  async searchTags(req, res) {
    try {
      const q = req.query.q || '';
      const [rows] = await pool.execute(
        'SELECT id, name FROM tag WHERE name LIKE ? ORDER BY name ASC LIMIT 20',
        [`%${q}%`]
      );
      res.json({ success: true, data: rows });
    } catch (error) {
      console.log('[TAG ERROR] Erreur lors de la recherche des tags:', error.message);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  },
};

export default tagController;
