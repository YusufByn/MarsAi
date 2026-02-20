import { userModel } from '../models/user.model.js';
import { validateInvite } from '../models/invite.model.js';
import { logActivity } from '../utils/activity.util.js';
import bcrypt from 'bcrypt';
import { jwtConfig } from '../config/jwt.js';

// --- REGISTER ---
export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        const inviteToken = req.headers['x-invite-token'];
        const inviteData = validateInvite(inviteToken);
        if (!inviteData) {
            return res.status(403).json({
                success: false,
                message: "Token d'invitation invalide ou expiré"
            });
        }

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
            role: 'jury',
            firstName,
            lastName
        });

        logActivity({ action: 'register', userId: newUser.id, entity: 'user', entityId: newUser.id, details: email, ip: req.ip });

        const safeUser = {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            firstName: newUser.firstName,
            lastName: newUser.lastName
        };

        console.log('[AUTH] Register - Compte jury créé pour:', email);

        res.status(201).json({
            success: true,
            message: "User created",
            user: safeUser
        });

    } catch (err) {
        console.error('[AUTH] Erreur register:', err);
        res.status(500).json({
            success: false,
            message: "Error during registration"
        });
    }
};

// --- VALIDATE INVITE TOKEN ---
export const validateInviteToken = (req, res) => {
    const inviteToken = req.headers['x-invite-token'];
    const result = validateInvite(inviteToken);
    if (!result) return res.json({ valid: false });
    return res.json({ valid: true, email: result.email });
};

// --- LOGIN ---
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

        logActivity({ action: 'login', userId: userSafe.id, entity: 'user', entityId: userSafe.id, details: email, ip: req.ip });

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
