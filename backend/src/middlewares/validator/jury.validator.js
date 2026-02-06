import { z } from 'zod';

// Schéma pour la création
export const createJurySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  lastname: z.string().min(1, 'Last name is required').max(100),
  illustration: z.string().url('Invalid URL for illustration').max(500).optional(),
  biographie: z.string().optional()
});

// Schéma pour la mise à jour (tous les champs optionnels)
export const updateJurySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  lastname: z.string().min(1).max(100).optional(),
  illustration: z.string().url().max(500).optional(),
  biographie: z.string().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

// Middleware de validation
export const validateCreate = (req, res, next) => {
  try {
    createJurySchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: error.errors
    });
  }
};

export const validateUpdate = (req, res, next) => {
  try {
    updateJurySchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: error.errors
    });
  }
};
