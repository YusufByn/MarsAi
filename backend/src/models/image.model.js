import pool from '../config/db.js';

export const createStills = async (videoId, stills = []) => {

    // flat map permet de filtrer et renvoyer un tableau de valeur
    // ici : on flat map sur les stills qui auront, id de video, nom du fichier, url et son ordre
    const values = stills.flatMap(s => [
        videoId,
        s.file_name,
        `/uploads/${s.file_name}`,
        s.sort_order 
    ]);

    // on determine le nombre de placeholders en fonctions du nombres de champs (min 1, max 3)
    const placeholders = stills.map(() => '(?, ?, ?, ?)').join(', ');

    // requete sql
    const query = `INSERT INTO still (video_id, file_name, file_url, sort_order) VALUES ${placeholders}`;

    // requete execute
    const [rows] = await pool.execute(query, values);

    return rows;

}