import { z } from 'zod';

const jsonValueSchema = z.lazy(() =>
    z.union([
        z.string(),
        z.number().finite(),
        z.boolean(),
        z.null(),
        z.array(jsonValueSchema),
        z.record(z.string(), jsonValueSchema),
    ])
);


const cmsParamsSchema = z.object({
    title: z.string().trim().regex(/^[a-z0-9_-]{2,50}$/i, 'section_type is invalid'),
});

const cmsBodySchema = z.object({
    
})