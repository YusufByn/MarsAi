import jwt from 'jsonwebtoken';
import { env } from '../config/env.js'; 

export const authMiddleware = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Accès refusé. Token manquant ou invalide." });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        
        console.log("✅ Auth : Utilisateur connecté :", req.user.email);
        next(); 

    } catch (error) {
        console.error("❌ Erreur Auth :", error.message);
        return res.status(401).json({ message: "Token invalide ou expiré." });
    }
};

export const isAdmin = (req, res, next) => {
    authMiddleware(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: "Accès interdit. Réservé aux administrateurs." });
        }
    });
};