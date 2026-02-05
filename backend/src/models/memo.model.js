import { pool } from '../db/index.js';

export const memoModel = {
  async getByUserAndVideo(userId, videoId) {
    const [rows] = await pool.execute(
      'SELECT id, user_id, video_id, rating, statut, playlist, comment, created_at, updated_at FROM selector_memo WHERE user_id = ? AND video_id = ?',
      [userId, videoId]
    );
    return rows[0];
  },

  async upsertMemo({ userId, videoId, statut, playlist, comment }) {
    const existing = await this.getByUserAndVideo(userId, videoId);

    const nextStatut = statut ?? existing?.statut ?? null;
    const nextPlaylist = playlist ?? existing?.playlist ?? 0;
    const nextComment = comment ?? existing?.comment ?? null;

    await pool.execute(
      `INSERT INTO selector_memo (user_id, video_id, statut, playlist, comment)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         statut = VALUES(statut),
         playlist = VALUES(playlist),
         comment = VALUES(comment),
         updated_at = CURRENT_TIMESTAMP`,
      [userId, videoId, nextStatut, nextPlaylist, nextComment]
    );

    return this.getByUserAndVideo(userId, videoId);
  },
};
