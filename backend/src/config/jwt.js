import jwt from 'jsonwebtoken';
import { env } from './env.js'; // On utilise ton fichier de config centralisé

export const jwtConfig = {
    generateToken: (user) => {
        const payload = {
            id: user.id,
            role: user.role
        };
        
        return jwt.sign(payload, env.jwtSecret, { expiresIn: '24h' });
    },

    verifyToken: (token) => {
        try {
            return jwt.verify(token, env.jwtSecret);
        } catch (error) {
            return null; 
        }
    }
};