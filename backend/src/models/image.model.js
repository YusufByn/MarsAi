import pool from '../config/db.js';

export const createStills = async (videoId, stills = []) => {

    const values = stills.flatMap(s => [
        videoId,
        s.file_name,
        `/uploads/${s.file_name}`,
        s.sort_order 
    ]);

    const placeholders = stills.map(() => '(?, ?, ?, ?)').join(', ');

    const query = `INSERT INTO still (video_id, file_name, file_url, sort_order) VALUES ${placeholders}`;

    const [rows] = await pool.execute(query, values);

    return rows;

}