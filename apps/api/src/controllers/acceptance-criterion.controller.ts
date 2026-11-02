import type { Request, Response } from 'express';
import {
  createAcceptanceCriterion as createCriterionRecord,
  deleteAcceptanceCriterion as deleteCriterionRecord,
  listAcceptanceCriteria as listCriterionRecords,
  reorderAcceptanceCriteria as reorderCriterionRecords,
  updateAcceptanceCriterion as updateCriterionRecord,
} from '../services/acceptance-criterion.service.js';
import type {
  AcceptanceCriterionParams,
  CreateAcceptanceCriterionInput,
  ReorderAcceptanceCriteriaInput,
  UpdateAcceptanceCriterionInput,
} from '../validation/acceptance-criterion.schemas.js';

export async function listAcceptanceCriteria(_request: Request, response: Response): Promise<void> {
  const { projectId, requirementId } = response.locals.validated.params as AcceptanceCriterionParams;
  response.status(200).json({ data: await listCriterionRecords(projectId, requirementId) });
}

export async function createAcceptanceCriterion(_request: Request, response: Response): Promise<void> {
  const { projectId, requirementId } = response.locals.validated.params as AcceptanceCriterionParams;
  const input = response.locals.validated.body as CreateAcceptanceCriterionInput;
  response.status(201).json({ data: await createCriterionRecord(projectId, requirementId, input) });
}

export async function updateAcceptanceCriterion(_request: Request, response: Response): Promise<void> {
  const { projectId, requirementId, criterionId } = response.locals.validated.params as AcceptanceCriterionParams;
  const input = response.locals.validated.body as UpdateAcceptanceCriterionInput;
  response.status(200).json({ data: await updateCriterionRecord(projectId, requirementId, criterionId!, input) });
}

export async function deleteAcceptanceCriterion(_request: Request, response: Response): Promise<void> {
  const { projectId, requirementId, criterionId } = response.locals.validated.params as AcceptanceCriterionParams;
  await deleteCriterionRecord(projectId, requirementId, criterionId!);
  response.status(204).send();
}

export async function reorderAcceptanceCriteria(_request: Request, response: Response): Promise<void> {
  const { projectId, requirementId } = response.locals.validated.params as AcceptanceCriterionParams;
  const input = response.locals.validated.body as ReorderAcceptanceCriteriaInput;
  response.status(200).json({ data: await reorderCriterionRecords(projectId, requirementId, input) });
}
