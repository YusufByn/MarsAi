import jwt from 'jsonwebtoken';
import { env } from '../config/env.js'; 

<<<<<<< HEAD
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
=======
export const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ 
            success: false,
            message: "Access denied. Token missing." 
        });
>>>>>>> e7ec5bc1a5944611b9aec2a7e14fde4c885aa6db
    }
};

<<<<<<< HEAD
export const isAdmin = (req, res, next) => {
    authMiddleware(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: "Accès interdit. Réservé aux administrateurs." });
        }
    });
=======
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: "Invalid token format." 
        });
    }
    const decodedUser = jwtConfig.verifyToken(token);

    if (!decodedUser) {
        return res.status(403).json({ 
            success: false,
            message: "Invalid or expired token." 
        });
    }

    req.user = decodedUser; 

    next();
>>>>>>> e7ec5bc1a5944611b9aec2a7e14fde4c885aa6db
};