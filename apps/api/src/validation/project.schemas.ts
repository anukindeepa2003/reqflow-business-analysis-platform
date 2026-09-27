import { z } from 'zod';

export const projectStatusSchema = z.enum([
  'PLANNING',
  'ACTIVE',
  'ON_HOLD',
  'COMPLETED',
  'ARCHIVED',
]);

const projectNameSchema = z
  .string()
  .trim()
  .min(2, 'Project name must contain at least 2 characters')
  .max(120, 'Project name must contain at most 120 characters');

const projectDescriptionSchema = z
  .string()
  .trim()
  .max(2000, 'Description must contain at most 2000 characters')
  .nullable();

export const createProjectBodySchema = z
  .object({
    name: projectNameSchema,
    description: projectDescriptionSchema.optional(),
    status: projectStatusSchema.optional(),
  })
  .strict();

export const updateProjectBodySchema = z
  .object({
    name: projectNameSchema.optional(),
    description: projectDescriptionSchema.optional(),
    status: projectStatusSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one project field must be provided',
  });

export const projectParamsSchema = z.object({
  projectId: z.string().uuid('Project ID must be a valid UUID'),
});

export type CreateProjectInput = z.infer<typeof createProjectBodySchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectBodySchema>;
export type ProjectParams = z.infer<typeof projectParamsSchema>;
