import pool from '../config/db.js';

export const securityModel = {
    async isBanned(ip, fingerprint) {
        const query = `
            SELECT id FROM blacklist 
            WHERE (ip_address = ? OR fingerprint = ?) 
            AND (banned_until IS NULL OR banned_until > NOW())
        `;
        const [rows] = await pool.execute(query, [ip, fingerprint]);
        return rows.length > 0;
    },

    async logAttack(logData) {
        const { ip, userAgent, fingerprint, method, url, payload, attackType } = logData;
        const query = `
            INSERT INTO security_log (ip_address, user_agent, fingerprint, request_method, request_url, payload, attack_type, risk_score)
            VALUES (?, ?, ?, ?, ?, ?, ?, 100)
        `;
        await pool.execute(query, [ip, userAgent, fingerprint, method, url, payload, attackType]);
    },

    async autoBan(ip, fingerprint, reason) {
        const query = `
            INSERT INTO blacklist (ip_address, fingerprint, reason, banned_until)
            VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))
        `;
        await pool.execute(query, [ip, fingerprint, reason]);
    }
};