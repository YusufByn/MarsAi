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
  },

  /**
   * Récupérer les emails par type de destinataire
   */
  async getEmailsByType(type) {
    let query = '';
    
    switch(type) {
      case 'newsletter':
        query = 'SELECT email FROM newsletter WHERE unsubscribed_at IS NULL';
        break;
      case 'realisateurs':
        query = 'SELECT DISTINCT email FROM video WHERE email IS NOT NULL AND email != ""';
        break;
      case 'selectionneurs':
        query = 'SELECT DISTINCT email FROM user WHERE role = "admin" OR role = "superadmin"';
        break;
      case 'jury':
        query = 'SELECT email FROM user WHERE role = "jury" AND email IS NOT NULL';
        break;
      default:
        return [];
    }

    const [rows] = await pool.query(query);
    return rows.map(row => row.email);
  },

  /**
   * Compter les destinataires par type
   */
  async countRecipientsByType(types) {
    const counts = {};
    
    for (const type of types) {
      const emails = await this.getEmailsByType(type);
      counts[type] = emails.length;
    }
    
    return counts;
  },

  /**
   * Récupérer tous les emails uniques pour les types sélectionnés
   */
  async getUniqueEmailsForTypes(types) {
    const allEmails = [];
    
    for (const type of types) {
      const emails = await this.getEmailsByType(type);
      allEmails.push(...emails);
    }
    
    // Dédupliquer les emails
    return [...new Set(allEmails)];
  },

  /**
   * Compter les campagnes envoyées aujourd'hui (simple sans table campaign)
   * TODO: Implémenter avec table newsletter_campaign pour historique futur
   */
  async countCampaignsToday() {
    // Pour l'instant, on retourne 0 (à implémenter avec historique)
    // Dans le futur: SELECT COUNT(*) FROM newsletter_campaign WHERE DATE(sent_at) = CURDATE()
    return 0;
  }
};

export default newsletterModel;
