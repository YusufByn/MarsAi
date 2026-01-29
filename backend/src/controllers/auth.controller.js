import { userModel } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { jwtConfig } from '../config/jwt.js';

// --- REGISTER ---
export const register = async (req, res) => {
    try {
        console.log("📝 Register - Données reçues :", req.body);
        const { email, password, role, firstName, lastName } = req.body;

        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Cet email est déjà utilisé." });
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

        console.log("✅ Register - Succès :", newUser);
        res.status(201).json({ message: "Utilisateur créé", user: newUser });

    } catch (err) {
        console.error("❌ Erreur Register :", err);
        res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
};

export const login = async (req, res) => {
    try {
        console.log("🔑 Login - Tentative pour :", req.body.email);
        const { email, password } = req.body;
        
        const user = await userModel.getUserByEmail(email);
        
        if (!user) {
            console.log("❌ Login - Utilisateur introuvable en DB");
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        console.log("🔍 INSPECTION USER DB :", user);

        const hashInDb = user.password_hash || user.password;

        if (!hashInDb) {
            console.error("⛔ ERREUR CRITIQUE : Aucun mot de passe trouvé dans l'objet user !");
            console.error("Les clés disponibles sont :", Object.keys(user));
            return res.status(500).json({ message: "Erreur interne: Mot de passe introuvable" });
        }

        const isValid = await bcrypt.compare(password, hashInDb);
        
        if (!isValid) {
            console.log("❌ Login - Mot de passe incorrect");
            await userModel.incrementLoginAttempts(email);
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        await userModel.resetLoginAttempts(email);

        const { password: _p, password_hash: _ph, ...userSafe } = user; 

        const token = jwtConfig.generateToken(userSafe);

        console.log("✅ Login - Succès !");
        res.status(200).json({ message: "Succès", token: token, user: userSafe });

    } catch (err) {
        console.error("❌ Erreur Login :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};