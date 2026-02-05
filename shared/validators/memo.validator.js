import { z } from 'zod';

const playlistSchema = z.preprocess(
  (value) => {
    if (value === undefined) return undefined;
    if (typeof value === 'boolean') return value ? 1 : 0;
    return Number(value);
  },
  z.number().int().min(0).max(1)
);

const memoSchema = z
  .object({
    user_id: z.coerce.number().int().positive(),
    video_id: z.coerce.number().int().positive(),
    statut: z.enum(['liked', 'rejected', 'discuss']).optional(),
    playlist: playlistSchema.optional(),
    comment: z.string().max(2000).optional(),
  })
  .refine(
    (data) =>
      data.statut !== undefined ||
      data.playlist !== undefined ||
      data.comment !== undefined,
    {
      message: 'At least one field must be provided',
    }
  );

export const validateMemoUpsert = (req, res, next) => {
  try {
    const validated = memoSchema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors?.map((err) => ({
          field: err.path?.[0] || 'unknown',
          message: err.message,
        })) || [],
      });
    }
    next(error);
  }
};
