import { Router } from 'express';
import {
  createRequirement,
  deleteRequirement,
  getRequirement,
  listRequirements,
  updateRequirement,
} from '../controllers/requirement.controller.js';
import { asyncHandler } from '../lib/async-handler.js';
import { validateRequest } from '../middleware/validate-request.js';
import {
  createRequirementBodySchema,
  listRequirementsQuerySchema,
  requirementParamsSchema,
  updateRequirementBodySchema,
} from '../validation/requirement.schemas.js';

export const requirementRouter = Router({ mergeParams: true });

requirementRouter.get(
  '/',
  validateRequest({ params: requirementParamsSchema, query: listRequirementsQuerySchema }),
  asyncHandler(listRequirements),
);
requirementRouter.post(
  '/',
  validateRequest({ params: requirementParamsSchema, body: createRequirementBodySchema }),
  asyncHandler(createRequirement),
);
requirementRouter.get(
  '/:requirementId',
  validateRequest({ params: requirementParamsSchema }),
  asyncHandler(getRequirement),
);
requirementRouter.patch(
  '/:requirementId',
  validateRequest({ params: requirementParamsSchema, body: updateRequirementBodySchema }),
  asyncHandler(updateRequirement),
);
requirementRouter.delete(
  '/:requirementId',
  validateRequest({ params: requirementParamsSchema }),
  asyncHandler(deleteRequirement),
);
