import { z } from 'zod';

export const requirementTypeSchema = z.enum(['FUNCTIONAL', 'NON_FUNCTIONAL']);
export const requirementPrioritySchema = z.enum(['MUST', 'SHOULD', 'COULD', 'WONT']);
export const requirementStatusSchema = z.enum([
  'DRAFT',
  'READY',
  'IN_PROGRESS',
  'IMPLEMENTED',
  'DEFERRED',
]);

const requirementTitleSchema = z
  .string()
  .trim()
  .min(2, 'Requirement title must contain at least 2 characters')
  .max(200, 'Requirement title must contain at most 200 characters');

const requirementDescriptionSchema = z
  .string()
  .trim()
  .min(10, 'Requirement description must contain at least 10 characters')
  .max(5000, 'Requirement description must contain at most 5000 characters');

export const createRequirementBodySchema = z
  .object({
    title: requirementTitleSchema,
    description: requirementDescriptionSchema,
    type: requirementTypeSchema,
    priority: requirementPrioritySchema,
    status: requirementStatusSchema.optional(),
  })
  .strict();

export const updateRequirementBodySchema = z
  .object({
    title: requirementTitleSchema.optional(),
    description: requirementDescriptionSchema.optional(),
    type: requirementTypeSchema.optional(),
    priority: requirementPrioritySchema.optional(),
    status: requirementStatusSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one requirement field must be provided',
  });

export const requirementParamsSchema = z.object({
  projectId: z.string().uuid('Project ID must be a valid UUID'),
  requirementId: z.string().uuid('Requirement ID must be a valid UUID').optional(),
});

export const listRequirementsQuerySchema = z
  .object({
    search: z.string().trim().min(1).max(200).optional(),
    type: requirementTypeSchema.optional(),
    priority: requirementPrioritySchema.optional(),
    status: requirementStatusSchema.optional(),
  })
  .strict();

export type CreateRequirementInput = z.infer<typeof createRequirementBodySchema>;
export type UpdateRequirementInput = z.infer<typeof updateRequirementBodySchema>;
export type RequirementParams = z.infer<typeof requirementParamsSchema>;
export type ListRequirementsQuery = z.infer<typeof listRequirementsQuerySchema>;
