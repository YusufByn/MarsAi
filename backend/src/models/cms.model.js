import pool from '../config/db.js';

export const CmsModel = {
    async findAll() {
        const query = `
            SELECT id, section_type, slug, title, sub_title, config, image_file, link, phase, is_active 
            FROM cms_section
        `;
        const [rows] = await pool.execute(query);
        
        const formatted = {};
        
        rows.forEach(row => {
            let configData = {};
            try {
                configData = typeof row.config === 'string' ? JSON.parse(row.config) : row.config;
            } catch (e) {
                configData = {}; // Fallback si le JSON est invalide
            }
            
            formatted[row.section_type] = {
                id: row.id,
                slug: row.slug,
                title: row.title,
                sub_title: row.sub_title,
                image: row.image_file,
                link: row.link,
                phase: row.phase,
                active: row.is_active,
                config: configData
            };
        });
        
        return formatted;
    },

    async update(sectionType, payload) {
        // On extrait les données spécifiques aux colonnes SQL, le reste va dans config
        const { title, sub_title, image_file, link, is_active, phase, config } = payload;
        
        const query = `
            UPDATE cms_section 
            SET 
                title = ?, 
                sub_title = ?, 
                image_file = ?, 
                link = ?, 
                config = ?, 
                is_active = ?,
                phase = ?,
                updated_at = NOW() 
            WHERE section_type = ?
        `;

        const [result] = await pool.execute(query, [
            title, 
            sub_title, 
            image_file || null,
            link || null,
            JSON.stringify(config || {}),
            is_active,
            phase,
            sectionType
        ]);
        
        return result.affectedRows > 0;
    }
};