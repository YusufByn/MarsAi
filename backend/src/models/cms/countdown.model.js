import { pool } from '../../db/index.js';

export const countdownModel = {
  /**
   * Récupérer les informations du countdown depuis cms_section
   */
  async getCountdown() {
    const [rows] = await pool.execute(
      'SELECT id, countdown, enddate FROM cms_section WHERE countdown = TRUE LIMIT 1'
    );
    return rows[0] || null;
  },

  /**
   * Récupérer toutes les sections avec countdown activé
   */
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, countdown, enddate FROM cms_section WHERE countdown = TRUE ORDER BY id DESC'
    );
    return rows;
  },

  /**
   * Récupérer une section par ID
   */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, countdown, enddate FROM cms_section WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  /**
   * Créer ou mettre à jour le countdown d'une section
   */
  async upsertCountdown({ id, countdown, enddate, phase = 'before', section_type = 'countdown', slug = 'countdown-2026' }) {
    const existing = await this.findById(id);
    
    if (existing) {
      const [result] = await pool.execute(
        'UPDATE cms_section SET countdown = ?, enddate = ?, phase = ?, section_type = ?, slug = ? WHERE id = ?',
        [countdown ? 1 : 0, enddate, phase, section_type, slug, id]
      );
      return result.affectedRows > 0;
    } else {
      const [result] = await pool.execute(
        'INSERT INTO cms_section (countdown, enddate, phase, section_type, slug, is_active) VALUES (?, ?, ?, ?, ?, 1)',
        [countdown ? 1 : 0, enddate, phase, section_type, slug]
      );
      return result.insertId;
    }
  },

  /**
   * Mettre à jour le countdown et enddate d'une section existante
   */
  async updateCountdown(id, { countdown, enddate }) {
    const [result] = await pool.execute(
      'UPDATE cms_section SET countdown = ?, enddate = ? WHERE id = ?',
      [countdown ? 1 : 0, enddate, id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Activer/désactiver le countdown
   */
  async toggleCountdown(id, enabled) {
    const [result] = await pool.execute(
      'UPDATE cms_section SET countdown = ? WHERE id = ?',
      [enabled ? 1 : 0, id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Mettre à jour uniquement la date de fin
   */
  async updateEndDate(id, enddate) {
    const [result] = await pool.execute(
      'UPDATE cms_section SET enddate = ? WHERE id = ?',
      [enddate, id]
    );
    return result.affectedRows > 0;
  }
};
  