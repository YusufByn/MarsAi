import { upsertTags, normalizeTags } from '../models/tag.model.js';
import pool from '../config/db.js';

export const createTags = async (req, res) => {
    try {
        // body de la request est un tableau de tags
        const { tags = [] } = req.body;
        // on normalize les tags
        const cleanTags = normalizeTags(tags);
        // on insert les tags qui n'existent pas dans la bdd
        const newTag = await upsertTags(cleanTags, pool);

        res.status(201).json({
            success: true,
            message: 'Tags inserted successfully',
            data: newTag
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error inserting tags',
            error: error.message
        })
    }
}