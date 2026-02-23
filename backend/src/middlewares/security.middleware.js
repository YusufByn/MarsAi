import pool from '../config/db.js';

const ATTACK_PATTERNS = {
    SQLi: /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, 
    SQLi_Advanced: /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i, 
    PathTraversal: /(\.\.\/|\.\.\\)/
};

export const securityGuard = async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const fingerprint = req.headers['x-device-id'] || 'unknown_device'; 

    try {
        const [banned] = await pool.execute(
            `SELECT * FROM blacklist 
             WHERE (ip_address = ? OR fingerprint = ?) 
             AND (banned_until IS NULL OR banned_until > NOW())`, 
            [ip, fingerprint]
        );

        if (banned.length > 0) {
            return res.status(403).json({ 
                message: "⛔ Access Denied. Your device or IP has been flagged." 
            });
        }

        const dataToScan = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.params);
        let attackDetected = null;

        if (ATTACK_PATTERNS.SQLi.test(dataToScan) || ATTACK_PATTERNS.SQLi_Advanced.test(dataToScan)) {
            attackDetected = 'SQL Injection Attempt';
        } else if (ATTACK_PATTERNS.XSS.test(dataToScan)) {
            attackDetected = 'XSS Attempt';
        } else if (ATTACK_PATTERNS.PathTraversal.test(dataToScan)) {
            attackDetected = 'Path Traversal Attempt';
        }

        if (attackDetected) {
            console.warn(`🚨 ATTAQUE DÉTECTÉE [${attackDetected}] IP: ${ip}`);

            await pool.execute(
                `INSERT INTO security_log (ip_address, user_agent, fingerprint, request_method, request_url, payload, attack_type, risk_score)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [ip, userAgent, fingerprint, req.method, req.originalUrl, dataToScan.substring(0, 500), attackDetected, 100]
            );

            await pool.execute(
                `INSERT INTO blacklist (ip_address, fingerprint, reason, banned_until)
                 VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
                [ip, fingerprint, `Auto-ban: ${attackDetected}`]
            );

            return res.status(403).json({ message: "Malicious activity detected. Request blocked." });
        }

        next();

    } catch (error) {
        console.error("Security Middleware Error:", error);
        next();
    }
};