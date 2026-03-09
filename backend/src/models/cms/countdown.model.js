import { pool } from '../../db/index.js';

export const countdownModel = {
  /**
   * Récupérer la date de phase pour le countdown
   * => renvoie toujours une string ISO (ex: 2026-04-01T00:00:00.000Z)
   */
  async getPhaseDate() {
    const [rows] = await pool.execute(
      `
      SELECT phase
      FROM cms_section
      WHERE section_type = ? AND is_active = 1
      ORDER BY id DESC
      LIMIT 1
      `,
      ['countdown']
    );

    const phase = rows?.[0]?.phase;
    if (!phase) return null;

    // mysql2 peut renvoyer un Date ou une string "YYYY-MM-DD HH:mm:ss"
    if (phase instanceof Date) {
      return phase.toISOString();
    }

    // Force un format ISO parseable partout
    const iso = String(phase).replace(' ', 'T') + 'Z'; // "2026-04-01T00:00:00Z"
    return new Date(iso).toISOString();
  }
};