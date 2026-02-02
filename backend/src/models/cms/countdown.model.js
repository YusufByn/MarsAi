import { pool } from '../../db/index.js';

export const countdownModel = {
  /**
   * Récupérer la date de phase pour le countdown
   */
  async getPhaseDate() {
    const [rows] = await pool.execute(
      'SELECT phase FROM cms_section WHERE section_type = ? AND is_active = 1 LIMIT 1',
      ['countdown']
    );
    return rows[0]?.phase || null;
  }
};
