import { jwtConfig } from '../config/jwt.js';

export const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Format de token invalide." });
    }
    const decodedUser = jwtConfig.verifyToken(token);

    if (!decodedUser) {
        return res.status(403).json({ message: "Token invalide ou expiré." });
    }

    req.user = decodedUser; 

    next();
};