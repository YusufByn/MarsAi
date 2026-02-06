import { pool } from '../db/index.js';

export const videoModel = {

  async findAll({ limit = 10 }) {
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 50) : 10;
    const [rows] = await pool.execute(
      `SELECT id, title, cover, youtube_url, video_file_name, duration,
              realisator_name, realisator_lastname, created_at
       FROM video
       ORDER BY created_at DESC
       LIMIT ${safeLimit}`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, title, cover, youtube_url, video_file_name, duration,
              realisator_name, realisator_lastname, created_at
       FROM video
       WHERE id = ?`,
      [id]
    );
    return rows[0];
  },
};
