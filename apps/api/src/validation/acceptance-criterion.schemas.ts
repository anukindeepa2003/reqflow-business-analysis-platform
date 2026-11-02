import { z } from 'zod';

const criterionDescriptionSchema = z
  .string()
  .trim()
  .min(5, 'Acceptance criterion must contain at least 5 characters')
  .max(2000, 'Acceptance criterion must contain at most 2000 characters');

export const createAcceptanceCriterionBodySchema = z
  .object({ description: criterionDescriptionSchema })
  .strict();

export const updateAcceptanceCriterionBodySchema = z
  .object({ description: criterionDescriptionSchema })
  .strict();

export const acceptanceCriterionParamsSchema = z.object({
  projectId: z.string().uuid('Project ID must be a valid UUID'),
  requirementId: z.string().uuid('Requirement ID must be a valid UUID'),
  criterionId: z.string().uuid('Criterion ID must be a valid UUID').optional(),
});

export const reorderAcceptanceCriteriaBodySchema = z
  .object({
    criterionIds: z
      .array(z.string().uuid('Every criterion ID must be a valid UUID'))
      .min(1, 'At least one criterion ID is required')
      .max(100, 'At most 100 criteria can be reordered at once'),
  })
  .strict()
  .refine((value) => new Set(value.criterionIds).size === value.criterionIds.length, {
    message: 'Criterion IDs must not contain duplicates',
    path: ['criterionIds'],
  });

export type AcceptanceCriterionParams = z.infer<typeof acceptanceCriterionParamsSchema>;
export type CreateAcceptanceCriterionInput = z.infer<typeof createAcceptanceCriterionBodySchema>;
export type UpdateAcceptanceCriterionInput = z.infer<typeof updateAcceptanceCriterionBodySchema>;
export type ReorderAcceptanceCriteriaInput = z.infer<typeof reorderAcceptanceCriteriaBodySchema>;
