import type { Request, Response } from 'express';
import {
  createProject as createProjectRecord,
  deleteProject as deleteProjectRecord,
  getProject as getProjectRecord,
  listProjects as listProjectRecords,
  updateProject as updateProjectRecord,
} from '../services/project.service.js';
import type {
  CreateProjectInput,
  ProjectParams,
  UpdateProjectInput,
} from '../validation/project.schemas.js';

export async function listProjects(_request: Request, response: Response): Promise<void> {
  const projects = await listProjectRecords();
  response.status(200).json({ data: projects });
}

export async function getProject(_request: Request, response: Response): Promise<void> {
  const { projectId } = response.locals.validated.params as ProjectParams;
  const project = await getProjectRecord(projectId);
  response.status(200).json({ data: project });
}

export async function createProject(_request: Request, response: Response): Promise<void> {
  const input = response.locals.validated.body as CreateProjectInput;
  const project = await createProjectRecord(input);
  response.status(201).json({ data: project });
}

export async function updateProject(_request: Request, response: Response): Promise<void> {
  const { projectId } = response.locals.validated.params as ProjectParams;
  const input = response.locals.validated.body as UpdateProjectInput;
  const project = await updateProjectRecord(projectId, input);
  response.status(200).json({ data: project });
}

export async function deleteProject(_request: Request, response: Response): Promise<void> {
  const { projectId } = response.locals.validated.params as ProjectParams;
  await deleteProjectRecord(projectId);
  response.status(204).send();
}
