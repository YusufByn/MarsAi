import { z } from 'zod';

// Schéma pour l'inscription à la newsletter
const subscribeSchema = z.object({
  email: z
    .string({ required_error: 'L\'email est requis' })
    .email('Format d\'email invalide')
    .min(5, 'L\'email doit contenir au moins 5 caractères')
    .max(255, 'L\'email ne doit pas dépasser 255 caractères')
    .transform(val => val.toLowerCase().trim())
});

// Middleware de validation pour l'inscription
export const validateSubscribe = (req, res, next) => {
  try {
    const validated = subscribeSchema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation échouée',
        errors: error.errors?.map(err => ({
          field: err.path?.[0] || 'unknown',
          message: err.message
        })) || []
      });
    }
    next(error);
  }
};

// Schéma pour le désabonnement
const unsubscribeSchema = z.object({
  email: z
    .string({ required_error: 'L\'email est requis' })
    .email('Format d\'email invalide')
    .transform(val => val.toLowerCase().trim())
});

// Middleware de validation pour le désabonnement
export const validateUnsubscribe = (req, res, next) => {
  try {
    const validated = unsubscribeSchema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation échouée',
        errors: error.errors?.map(err => ({
          field: err.path?.[0] || 'unknown',
          message: err.message
        })) || []
      });
    }
    next(error);
  }
};
