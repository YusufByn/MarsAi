import { z } from 'zod';

const ratingSchema = z.object({
  user_id: z.coerce.number().int().positive(),
  video_id: z.coerce.number().int().positive(),
  rating: z.coerce.number().min(0).max(10),
});

export const validateRatingUpsert = (req, res, next) => {
  try {
    const validated = ratingSchema.parse(req.body);
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
