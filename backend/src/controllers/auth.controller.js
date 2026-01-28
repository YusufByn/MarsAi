import { userModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import { jwtConfig } from '../config/jwt.config.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.getUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            await userModel.incrementLoginAttempts(email);
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        await userModel.resetLoginAttempts(email);

        const { password: _, ...userSafe } = user; 

        const token = jwtConfig.generateToken(userSafe);

        res.status(200).json({ message: "Succès", token: token, user: userSafe });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};