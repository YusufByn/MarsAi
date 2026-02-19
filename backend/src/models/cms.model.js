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


// récupérer tous les elements cms
export async function getAllCmsElements() {

    try {

        const query = `
            SELECT id, section_type, slug, title, sub_title, config, image_file, link, is_active, created_at, updated_at 
            FROM cms 
            ORDER BY section_type ASC
        `;

        const [rows] = await pool.execute(query);
        return rows;
    } catch (error) {
        console.error('Error fetching CMS elements:', error);
        throw error;
    }
}

export async function getCmsElementBySectionType(sectionType) {
    try {
        const query = `
            SELECT id, section_type, slug, title, sub_title, config, image_file, link, is_active, created_at, updated_at 
            FROM cms 
            WHERE section_type = ?
        `;

        const [rows] = await pool.execute(query, [sectionType]);

        if (rows.length === 0) {
            return null;
        }else {
            return rows[0];
        }
    } catch (error) {
        console.error('Error fetching CMS element by section type:', error);
        throw error;
    }
}

export async function updateCmsElement(sectionType, payload) {

    const { title, sub_title, config, image_file, link, is_active } = payload;
    try {

        const existingElement = await getCmsElementBySectionType(sectionType);
        if (!existingElement) {
            throw new Error("cms element not found");
        }

        const updateFields = [];
        const updateValues = [];

        if ("title" in payload) {
            updateFields.push("title = ?");
            updateValues.push(title ?? null);
        }

        
        
    } catch (error) {
        
    }
}