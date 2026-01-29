import { pool } from '../db/index.js';

const newsletterModel = {
  /**
   * Chercher un email dans la newsletter
   */
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM newsletter WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  /**
   * Créer une nouvelle inscription
   */
  async create(email) {
    const [result] = await pool.query(
      'INSERT INTO newsletter (email) VALUES (?)',
      [email]
    );
    return { id: result.insertId, email };
  },

  /**
   * Réabonner un email (remettre unsubscribed_at à NULL)
   */
  async resubscribe(email) {
    const [result] = await pool.query(
      'UPDATE newsletter SET unsubscribed_at = NULL WHERE email = ?',
      [email]
    );
    return result.affectedRows > 0;
  },

  /**
   * Désabonner un email
   */
  async unsubscribe(email) {
    const [result] = await pool.query(
      'UPDATE newsletter SET unsubscribed_at = CURRENT_TIMESTAMP WHERE email = ?',
      [email]
    );
    return result.affectedRows > 0;
  },

  /**
   * Récupérer tous les abonnés actifs (non désabonnés)
   */
  async findAllActive() {
    const [rows] = await pool.query(
      'SELECT * FROM newsletter WHERE unsubscribed_at IS NULL ORDER BY subscribed_at DESC'
    );
    return rows;
  },

  /**
   * Compter les abonnés actifs
   */
  async countActive() {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM newsletter WHERE unsubscribed_at IS NULL'
    );
    return rows[0].count;
  }
};

export default newsletterModel;
