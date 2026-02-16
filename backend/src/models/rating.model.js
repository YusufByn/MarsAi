import { pool } from '../db/index.js';

export const ratingModel = {
  async getByUserAndVideo(userId, videoId) {
    const [rows] = await pool.execute(
      'SELECT id, user_id, video_id, rating, created_at, updated_at FROM selector_memo WHERE user_id = ? AND video_id = ?',
      [userId, videoId]
    );
    return rows[0];
  },

  async upsertRating({ userId, videoId, rating }) {
    const normalizedRating = Math.round(rating * 10) / 10;

    await pool.execute(
      `INSERT INTO selector_memo (user_id, video_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         rating = VALUES(rating),
         updated_at = CURRENT_TIMESTAMP`,
      [userId, videoId, normalizedRating]
    );

    return this.getByUserAndVideo(userId, videoId);
  },

  async clearRating(userId, videoId) {
    await pool.execute(
      `UPDATE selector_memo SET rating = NULL, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND video_id = ?`,
      [userId, videoId]
    );
  },
};
