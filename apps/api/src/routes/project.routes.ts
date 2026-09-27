import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from '../controllers/project.controller.js';
import { asyncHandler } from '../lib/async-handler.js';
import { validateRequest } from '../middleware/validate-request.js';
import {
  createProjectBodySchema,
  projectParamsSchema,
  updateProjectBodySchema,
} from '../validation/project.schemas.js';

export const projectRouter = Router();

projectRouter.get('/', asyncHandler(listProjects));
projectRouter.post(
  '/',
  validateRequest({ body: createProjectBodySchema }),
  asyncHandler(createProject),
);
projectRouter.get(
  '/:projectId',
  validateRequest({ params: projectParamsSchema }),
  asyncHandler(getProject),
);
projectRouter.patch(
  '/:projectId',
  validateRequest({ params: projectParamsSchema, body: updateProjectBodySchema }),
  asyncHandler(updateProject),
);
projectRouter.delete(
  '/:projectId',
  validateRequest({ params: projectParamsSchema }),
  asyncHandler(deleteProject),
);
