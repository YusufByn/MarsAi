import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Génère un token d'invitation JWT signé.
 * Aucune écriture en base — validation purement cryptographique.
 */
export const createInvite = (email) => {
  return jwt.sign({ email, type: 'invite' }, env.jwtSecret, { expiresIn: '24h' });
};

/**
 * Vérifie la signature et la date d'expiration du token.
 * Retourne { email } si valide, null sinon.
 */
export const validateInvite = (token) => {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (payload.type !== 'invite') return null;
    return { email: payload.email };
  } catch {
    return null;
  }
};
