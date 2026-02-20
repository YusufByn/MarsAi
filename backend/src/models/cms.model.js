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


// récupérer tous les elements cms
export async function getAllCmsElements() {

    try {

        const query = `
            SELECT id, section_type, slug, title, sub_title, config, image_file, link, is_active, created_at, updated_at 
            FROM cms_section 
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
            FROM cms_section 
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

        if ("sub_title" in payload) {
            updateFields.push("sub_title = ?");
            updateValues.push(sub_title ?? null);
        }

        if ("config" in payload) {
            updateFields.push("config = ?");
            updateValues.push(config ? JSON.stringify(config) : null);
        }

        if ("image_file" in payload) {
            updateFields.push("image_file = ?");
            updateValues.push(image_file ?? null);
        }

        if ("link" in payload) {
            updateFields.push("link = ?");
            updateValues.push(link ?? null);
        }

        if ("is_active" in payload) {
            updateFields.push("is_active = ?");
            updateValues.push(is_active ?? null);
        }

        if (updateFields.length === 0) {
            throw new Error("No fields to update");
        }

        updateFields.push("updated_at = NOW()");
        updateValues.push(sectionType);

        const query = `UPDATE cms_section SET ${updateFields.join(", ")} WHERE section_type = ?`;

        const [result] = await pool.execute(query, updateValues);

        if (result.affectedRows === 0) { 
            throw new Error("Failed to update CMS element");
        }

        return await getCmsElementBySectionType(sectionType);
        
    } catch (error) {
        console.error('Error updating CMS element:', error);
        throw error;
    }
}
