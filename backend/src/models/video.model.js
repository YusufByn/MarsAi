import { pool } from '../db/index.js';

export const videoModel = {
  async create(data) {
    const sql = `
      INSERT INTO video (
        user_id, youtube_url, video_file_name, srt_file_name, cover,
        title, title_en, synopsis, synopsis_en, language, country,
        duration, classification, tech_resume, creative_resume,
        realisator_name, realisator_lastname, realisator_gender,
        email, birthday, mobile_number, fixe_number, address, acquisition_source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;
    const values = [
      data.user_id, data.youtube_url, data.video_file_name, data.srt_file_name, data.cover,
      data.title, data.title_en, data.synopsis, data.synopsis_en, data.language, data.country,
      data.duration, data.classification, data.tech_resume, data.creative_resume,
      data.realisator_name, data.realisator_lastname, data.realisator_gender,
      data.email, data.birthday, data.mobile_number, data.fixe_number, data.address, data.acquisition_source,
    ];
    const [result] = await pool.execute(sql, values);
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM video WHERE id = ?', [id]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM video ORDER BY created_at DESC');
    return rows;
  },

  async update(id, data) {
    const sql = `
      UPDATE video SET
        user_id=?, youtube_url=?, video_file_name=?, srt_file_name=?, cover=?,
        title=?, title_en=?, synopsis=?, synopsis_en=?, language=?, country=?,
        duration=?, classification=?, tech_resume=?, creative_resume=?,
        realisator_name=?, realisator_lastname=?, realisator_gender=?,
        email=?, birthday=?, mobile_number=?, fixe_number=?, address=?, acquisition_source=?,
      WHERE id=?
    `;
    const values = [
      data.user_id, data.youtube_url, data.video_file_name, data.srt_file_name, data.cover,
      data.title, data.title_en, data.synopsis, data.synopsis_en, data.language, data.country,
      data.duration, data.classification, data.tech_resume, data.creative_resume,
      data.realisator_name, data.realisator_lastname, data.realisator_gender,
      data.email, data.birthday, data.mobile_number, data.fixe_number, data.address, data.acquisition_source,
      id
    ];
    const [result] = await pool.execute(sql, values);
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute('DELETE FROM video WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};