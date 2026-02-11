import pool from '../config/db.js';

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

// creation de video
export const createVideo = async (title, youtube_url, video_file_name, srt_file_name, cover) => {

  // requete prepare
  const query = `INSERT INTO video (title, youtube_url, video_file_name, srt_file_name, cover) VALUES (?, ?, ?, ?, ?)`;

  // valeurs a injecter dans la requete
  const values = [title, youtube_url, video_file_name, srt_file_name, cover];

  // execution de la requete
  const [rows] = await pool.execute(query, values);

  return rows;
}; 

export const addTagsToVideo = async (videoId, tagIds) => {

  // variable placeholder pour pour ajuster les placeholders dans la requête
  const placeholders = tagIds.map(() => "(?, ?)").join(", ");

  // boucle sur les tagIgs, on ajoute le video et tag id a celuici
  const values = tagIds.flatMap(tagId => [videoId, tagId]);

  // requet prépare
  const query = `INSERT INTO video_tag (video_id, tag_id) VALUES ${placeholders}`;

  // execution de la requete
  const [rows] = await pool.execute(query, values);

  return rows;
};