import pool from '../config/db.js';

export const securityController = {
    async getSecurityLogs(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM security_log ORDER BY created_at DESC LIMIT 100');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Erreur logs" });
        }
    },

    async getBlacklist(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM blacklist ORDER BY created_at DESC');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Erreur blacklist" });
        }
    },

    async banIp(req, res) {
        const { ip, fingerprint, reason } = req.body;
        try {
            await pool.execute(
                `INSERT INTO blacklist (ip_address, fingerprint, reason) VALUES (?, ?, ?)`,
                [ip, fingerprint || 'manual', reason || 'Manual Admin Ban']
            );
            res.json({ success: true, message: `${ip} bannie.` });
        } catch (error) {
            res.status(500).json({ message: "Erreur ban" });
        }
    },

    async unban(req, res) {
        const { id } = req.params;
        try {
            await pool.execute('DELETE FROM blacklist WHERE id = ?', [id]);
            res.json({ success: true, message: "Utilisateur débanni." });
        } catch (error) {
            res.status(500).json({ message: "Erreur unban" });
        }
    }
};