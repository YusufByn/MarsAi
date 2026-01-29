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

// Schéma pour l'envoi de campagne
const sendCampaignSchema = z.object({
  subject: z
    .string({ required_error: 'Le sujet est requis' })
    .min(5, 'Le sujet doit contenir au moins 5 caractères')
    .max(255, 'Le sujet ne doit pas dépasser 255 caractères'),
  message: z
    .string({ required_error: 'Le message est requis' })
    .min(20, 'Le message doit contenir au moins 20 caractères')
    .max(10000, 'Le message ne doit pas dépasser 10 000 caractères'),
  recipients: z
    .array(z.enum(['newsletter', 'realisateurs', 'selectionneurs', 'jury']))
    .min(1, 'Veuillez sélectionner au moins un type de destinataire')
});

// Schéma pour l'aperçu des destinataires
const previewRecipientsSchema = z.object({
  recipients: z
    .array(z.enum(['newsletter', 'realisateurs', 'selectionneurs', 'jury']))
    .min(1, 'Veuillez sélectionner au moins un type de destinataire')
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

// Middleware de validation pour l'envoi de campagne
export const validateSendCampaign = (req, res, next) => {
  try {
    const validated = sendCampaignSchema.parse(req.body);
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

// Middleware de validation pour l'aperçu des destinataires
export const validatePreviewRecipients = (req, res, next) => {
  try {
    const validated = previewRecipientsSchema.parse(req.body);
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
