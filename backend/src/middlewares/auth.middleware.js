import { jwtConfig } from '../config/jwt.js';

export const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ 
            success: false,
            message: "Access denied. Token missing." 
        });
    }

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
};