import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide ou expiré." });
    }
};

export const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Accès interdit. Vous n'avez pas les permissions nécessaires." 
            });
        }
        next();
    };
};