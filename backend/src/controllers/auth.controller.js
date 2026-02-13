import { userModel } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { jwtConfig } from '../config/jwt.js';

// --- REGISTER ---
export const register = async (req, res) => {
    try {
        
        const { email, password, role, firstName, lastName } = req.body;

        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                message: "Email already used" 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await userModel.registerUser({ 
            email, 
            passwordHash, 
            role: role || 'user', 
            firstName, 
            lastName 
        });

        console.log("Register - Success :", newUser);
        res.status(201).json({ 
            success: true,
            message: "User created", 
            user: newUser 
        });

    } catch (err) {
        console.error("Error Register :", err);
        res.status(500).json({ 
            success: false,
            message: "Error during registration" 
        });
    }
};

export const login = async (req, res) => {
    try {
        console.log("Login - Attempt for email:", req.body.email);
        const { email, password } = req.body;
        
        const user = await userModel.getUserByEmail(email);
        
        if (!user) {
            console.log("Login - User not found in DB");
            return res.status(401).json({ 
                success: false,
                message: "Credentials incorrect" 
            });
        }

        console.log("INSPECTION USER DB :", user);

        const hashInDb = user.password_hash || user.password;

        if (!hashInDb) {
            console.error("Critical error: No password found in user object!");
            return res.status(500).json({ 
                success: false,
                message: "Internal error: Password not found in user object" 
            });
        }

        const isValid = await bcrypt.compare(password, hashInDb);
        
        if (!isValid) {
            console.log("Login - Mot de passe incorrect");
            await userModel.incrementLoginAttempts(email);
            return res.status(401).json({ 
                message: "Password incorrect",
                success: false
            });
        }

        await userModel.resetLoginAttempts(email);

        const { password: _p, password_hash: _ph, ...userSafe } = user; 

        const token = jwtConfig.generateToken(userSafe);

        console.log("[AUTH] Login - Success for:", email);
        res.status(200).json({
            message: "Success",
            success: true,
            token: token,
            user: userSafe
        });

    } catch (err) {
        console.error("Erreur Login :", err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};