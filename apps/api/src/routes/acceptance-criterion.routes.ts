import { Router } from 'express';
import {
  createAcceptanceCriterion,
  deleteAcceptanceCriterion,
  listAcceptanceCriteria,
  reorderAcceptanceCriteria,
  updateAcceptanceCriterion,
} from '../controllers/acceptance-criterion.controller.js';
import { asyncHandler } from '../lib/async-handler.js';
import { validateRequest } from '../middleware/validate-request.js';
import {
  acceptanceCriterionParamsSchema,
  createAcceptanceCriterionBodySchema,
  reorderAcceptanceCriteriaBodySchema,
  updateAcceptanceCriterionBodySchema,
} from '../validation/acceptance-criterion.schemas.js';

export const acceptanceCriterionRouter = Router({ mergeParams: true });

acceptanceCriterionRouter.get(
  '/',
  validateRequest({ params: acceptanceCriterionParamsSchema }),
  asyncHandler(listAcceptanceCriteria),
);
acceptanceCriterionRouter.post(
  '/',
  validateRequest({ params: acceptanceCriterionParamsSchema, body: createAcceptanceCriterionBodySchema }),
  asyncHandler(createAcceptanceCriterion),
);
acceptanceCriterionRouter.put(
  '/order',
  validateRequest({ params: acceptanceCriterionParamsSchema, body: reorderAcceptanceCriteriaBodySchema }),
  asyncHandler(reorderAcceptanceCriteria),
);
acceptanceCriterionRouter.patch(
  '/:criterionId',
  validateRequest({ params: acceptanceCriterionParamsSchema, body: updateAcceptanceCriterionBodySchema }),
  asyncHandler(updateAcceptanceCriterion),
);
acceptanceCriterionRouter.delete(
  '/:criterionId',
  validateRequest({ params: acceptanceCriterionParamsSchema }),
  asyncHandler(deleteAcceptanceCriterion),
);
