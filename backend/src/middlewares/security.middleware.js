import { securityModel } from '../models/security.model.js';

const ATTACK_PATTERNS = {
    SQLi: /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, 
    SQLi_Advanced: /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i, 
    XSS: /((%3C)|<)((%2F)|\/)*[a-z0-9\%]+((%3E)|>)/i,
    PathTraversal: /(\.\.\/|\.\.\\)/
};

export const securityGuard = async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const fingerprint = req.headers['x-device-id'] || 'unknown_device'; 

    try {
        const isUserBanned = await securityModel.isBanned(ip, fingerprint);

        if (isUserBanned) {
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

            await securityModel.logAttack({
                ip, 
                userAgent, 
                fingerprint, 
                method: req.method, 
                url: req.originalUrl, 
                payload: dataToScan.substring(0, 500), 
                attackType: attackDetected
            });

            await securityModel.autoBan(ip, fingerprint, `Auto-ban: ${attackDetected}`);

            return res.status(403).json({ message: "Malicious activity detected. Request blocked." });
        }

        next();

    } catch (error) {
        console.error("Security Middleware Error:", error);
        next();
    }
};