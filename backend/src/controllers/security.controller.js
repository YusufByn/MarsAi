import pool from '../config/db.js';

export const securityController = {

    async getSecurityLogs(req, res) {
        try {
            const [rows] = await pool.execute(`
                SELECT
                    al.id,
                    al.action,
                    al.entity,
                    al.entity_id,
                    al.details,
                    al.ip,
                    al.created_at,
                    u.email   AS user_email,
                    u.name    AS user_name,
                    u.lastname AS user_lastname,
                    u.role    AS user_role
                FROM activity_log al
                LEFT JOIN \`user\` u ON al.user_id = u.id
                ORDER BY al.created_at DESC
                LIMIT 500
            `);
            res.json(rows);
        } catch (error) {
            console.error('[SECURITY] Erreur getSecurityLogs:', error.message);
            res.status(500).json({ message: "Erreur logs" });
        }
    },

    async getBlacklist(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM blacklist ORDER BY created_at DESC');
            res.json(rows);
        } catch (error) {
            console.error('[SECURITY] Erreur getBlacklist:', error.message);
            res.status(500).json({ message: "Erreur blacklist" });
        }
    },

    async banIp(req, res) {
        const { ip, fingerprint, reason } = req.body;
        try {
            await pool.execute(
                'INSERT INTO blacklist (ip, fingerprint, reason) VALUES (?, ?, ?)',
                [ip || null, fingerprint || null, reason || 'Manual Admin Ban']
            );
            console.log('[SECURITY] Ban manuel ajouté — IP:', ip, 'Fingerprint:', fingerprint);
            res.json({ success: true });
        } catch (error) {
            console.error('[SECURITY] Erreur banIp:', error.message);
            res.status(500).json({ message: "Erreur ban" });
        }
    },

    async unban(req, res) {
        const { id } = req.params;
        try {
            await pool.execute('DELETE FROM blacklist WHERE id = ?', [id]);
            res.json({ success: true });
        } catch (error) {
            console.error('[SECURITY] Erreur unban:', error.message);
            res.status(500).json({ message: "Erreur unban" });
        }
    }
};
