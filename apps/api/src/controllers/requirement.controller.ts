import type { Request, Response } from 'express';
import {
  createRequirement as createRequirementRecord,
  deleteRequirement as deleteRequirementRecord,
  getRequirement as getRequirementRecord,
  listRequirements as listRequirementRecords,
  updateRequirement as updateRequirementRecord,
} from '../services/requirement.service.js';
import type {
  CreateRequirementInput,
  ListRequirementsQuery,
  RequirementParams,
  UpdateRequirementInput,
} from '../validation/requirement.schemas.js';

export async function listRequirements(_request: Request, response: Response): Promise<void> {
  const { projectId } = response.locals.validated.params as RequirementParams;
  const query = response.locals.validated.query as ListRequirementsQuery;
  const requirements = await listRequirementRecords(projectId, query);
  response.status(200).json({ data: requirements });
}

export async function getRequirement(_request: Request, response: Response): Promise<void> {
  const { projectId, requirementId } = response.locals.validated.params as RequirementParams;
  const requirement = await getRequirementRecord(projectId, requirementId!);
  response.status(200).json({ data: requirement });
}

export async function createRequirement(_request: Request, response: Response): Promise<void> {
  const { projectId } = response.locals.validated.params as RequirementParams;
  const input = response.locals.validated.body as CreateRequirementInput;
  const requirement = await createRequirementRecord(projectId, input);
  response.status(201).json({ data: requirement });
}

export async function updateRequirement(_request: Request, response: Response): Promise<void> {
  const { projectId, requirementId } = response.locals.validated.params as RequirementParams;
  const input = response.locals.validated.body as UpdateRequirementInput;
  const requirement = await updateRequirementRecord(projectId, requirementId!, input);
  response.status(200).json({ data: requirement });
}

export async function deleteRequirement(_request: Request, response: Response): Promise<void> {
  const { projectId, requirementId } = response.locals.validated.params as RequirementParams;
  await deleteRequirementRecord(projectId, requirementId!);
  response.status(204).send();
}
