import pool from '../config/db.js';

export const CmsModel = {
    async findAll() {
        const [rows] = await pool.execute("SELECT section_type, title, sub_title, config FROM cms_section");
        
        const formatted = {};
        
        rows.forEach(row => {
            let configData = {};

            try {
                configData = typeof row.config === 'string' ? JSON.parse(row.config) : row.config;
            } catch (e) {
                configData = {};
            }

            formatted[row.section_type] = {
                title: row.title,
                sub_title: row.sub_title,
                data: configData
            };
        });
        
        return formatted;
    },

    async update(sectionType, payload) {

        const { title, sub_title, data } = payload;
        
        const query = `
            UPDATE cms_section 
            SET title = ?, sub_title = ?, config = ?, updated_at = NOW() 
            WHERE section_type = ?
        `;

        const [result] = await pool.execute(query, [
            title, 
            sub_title, 
            JSON.stringify(data),
            sectionType
        ]);
        
        return result.affectedRows > 0;
    }
};