import { z } from 'zod';

const MAX_NAME_LENGTH = 120;
const MAX_URL_LENGTH = 500;
const MAX_IMG_LENGTH = 500;
const MAX_SORT_ORDER = 32767;
const MAX_TYPE_CODE = 255;

const toTrimmedString = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim();
};

const toOptionalTrimmedString = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? '' : trimmed;
};

const toIntegerLike = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? Math.trunc(value) : value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!/^-?\d+$/.test(trimmed)) return value;
    return Number.parseInt(trimmed, 10);
  }
  return value;
};

const zodErrors = (error) => {
  const issues = Array.isArray(error?.issues)
    ? error.issues
    : (Array.isArray(error?.errors) ? error.errors : []);

  return issues.map((issue) => ({
    field: Array.isArray(issue.path) && issue.path.length ? issue.path.join('.') : 'unknown',
    message: issue.message || 'Invalid value',
  }));
};

const validatePayload = (schema, source = 'body') => (req, res, next) => {
  try {
    const validated = schema.parse(req[source]);
    req[source] = validated;
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: zodErrors(error),
      });
    }
    return next(error);
  }
};

const sponsorNameSchema = z.preprocess(
  toTrimmedString,
  z.string().max(MAX_NAME_LENGTH, `Le nom ne doit pas depasser ${MAX_NAME_LENGTH} caracteres`)
);

const sponsorUrlSchema = z.preprocess(
  toOptionalTrimmedString,
  z
    .string()
    .max(MAX_URL_LENGTH, `L'URL ne doit pas depasser ${MAX_URL_LENGTH} caracteres`)
    .refine((value) => !/\s/.test(value), "L'URL ne doit pas contenir d'espaces")
    .optional()
    .or(z.literal(''))
    .or(z.null())
);

const sponsorImgSchema = z.preprocess(
  toOptionalTrimmedString,
  z
    .string()
    .max(MAX_IMG_LENGTH, `Le chemin image ne doit pas depasser ${MAX_IMG_LENGTH} caracteres`)
    .optional()
    .or(z.literal(''))
    .or(z.null())
);

const sponsorSortOrderSchema = z.preprocess(
  toIntegerLike,
  z
    .number({ invalid_type_error: "Le champ sort_order doit etre un entier" })
    .int("Le champ sort_order doit etre un entier")
    .min(0, 'Le champ sort_order doit etre >= 0')
    .max(MAX_SORT_ORDER, `Le champ sort_order ne doit pas depasser ${MAX_SORT_ORDER}`)
    .optional()
);

const sponsorTypeSchema = z.preprocess(
  toIntegerLike,
  z
    .number({ invalid_type_error: "Le champ is_active doit etre un entier" })
    .int("Le champ is_active doit etre un entier")
    .min(0, 'Le champ is_active doit etre >= 0')
    .max(MAX_TYPE_CODE, `Le champ is_active ne doit pas depasser ${MAX_TYPE_CODE}`)
);

const sponsorIdParamsSchema = z.object({
  id: z.preprocess(
    toIntegerLike,
    z
      .number({ invalid_type_error: "Le parametre id doit etre un entier" })
      .int("Le parametre id doit etre un entier")
      .positive('Le parametre id doit etre > 0')
  ),
});

const createSponsorSchema = z.object({
  name: sponsorNameSchema.optional().default(''),
  img: sponsorImgSchema,
  url: sponsorUrlSchema,
  sort_order: sponsorSortOrderSchema.default(0),
  is_active: sponsorTypeSchema.optional().default(1),
});

const updateSponsorSchema = z
  .object({
    name: sponsorNameSchema.optional(),
    img: sponsorImgSchema,
    url: sponsorUrlSchema,
    sort_order: sponsorSortOrderSchema,
    is_active: sponsorTypeSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ doit etre fourni',
  });

const setSponsorVisibilitySchema = z.object({
  is_active: sponsorTypeSchema,
});

const moveSponsorOrderSchema = z.object({
  direction: z.enum(['up', 'down'], {
    invalid_type_error: "Le champ direction doit etre 'up' ou 'down'",
  }),
});

const moveSponsorTypeOrderSchema = z.object({
  type: z.preprocess(
    toIntegerLike,
    z
      .number({ invalid_type_error: 'Le champ type doit etre un entier' })
      .int('Le champ type doit etre un entier')
      .min(1, 'Le champ type doit etre >= 1')
      .max(MAX_TYPE_CODE, `Le champ type ne doit pas depasser ${MAX_TYPE_CODE}`)
  ),
  direction: z.enum(['up', 'down'], {
    invalid_type_error: "Le champ direction doit etre 'up' ou 'down'",
  }),
});

export const validateSponsorIdParam = validatePayload(sponsorIdParamsSchema, 'params');
export const validateCreateSponsor = validatePayload(createSponsorSchema, 'body');
export const validateUpdateSponsor = validatePayload(updateSponsorSchema, 'body');
export const validateSetSponsorVisibility = validatePayload(setSponsorVisibilitySchema, 'body');
export const validateMoveSponsorOrder = validatePayload(moveSponsorOrderSchema, 'body');
export const validateMoveSponsorTypeOrder = validatePayload(moveSponsorTypeOrderSchema, 'body');

