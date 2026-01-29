import { z } from 'zod';

// Schéma pour l'inscription à la newsletter
const subscribeSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format')
    .min(5, 'Email must contain at least 5 characters')
    .max(255, 'Email must not exceed 255 characters')
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
        message: 'Validation failed',
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
    .string({ required_error: 'Email is required' })
    .email('Invalid email format')
    .transform(val => val.toLowerCase().trim())
});

// Schéma pour l'envoi de campagne
const sendCampaignSchema = z.object({
  subject: z
    .string({ required_error: 'Subject is required' })
    .min(5, 'Subject must contain at least 5 characters')
    .max(255, 'Subject must not exceed 255 characters'),
  message: z
    .string({ required_error: 'Message is required' })
    .min(20, 'Message must contain at least 20 characters')
    .max(10000, 'Message must not exceed 10 000 characters'),
  recipients: z
    .array(z.enum(['newsletter', 'realisateurs', 'selectionneurs', 'jury']))
    .min(1, 'Please select at least one recipient type')
});

// Schéma pour l'aperçu des destinataires
const previewRecipientsSchema = z.object({
  recipients: z
    .array(z.enum(['newsletter', 'realisateurs', 'selectionneurs', 'jury']))
    .min(1, 'Please select at least one recipient type')
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
        message: 'Validation failed',
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
        message: 'Validation failed',
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
        message: 'Validation failed',
        errors: error.errors?.map(err => ({
          field: err.path?.[0] || 'unknown',
          message: err.message
        })) || []
      });
    }
    next(error);
  }
};
