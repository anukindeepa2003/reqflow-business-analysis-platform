import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/app-error.js';
import type { CreateProjectInput, UpdateProjectInput } from '../validation/project.schemas.js';

export function listProjects() {
  return prisma.project.findMany({
    orderBy: [{ updatedAt: 'desc' }, { name: 'asc' }],
  });
}

export async function getProject(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError(404, 'PROJECT_NOT_FOUND', 'The requested project was not found.');
  }

  return project;
}

export function createProject(input: CreateProjectInput) {
  return prisma.project.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      status: input.status ?? 'PLANNING',
    },
  });
}

export async function updateProject(projectId: string, input: UpdateProjectInput) {
  await getProject(projectId);

  const data: Prisma.ProjectUpdateInput = {};

  if (input.name !== undefined) data.name = input.name;
  if (input.description !== undefined) data.description = input.description;
  if (input.status !== undefined) data.status = input.status;

  return prisma.project.update({
    where: { id: projectId },
    data,
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  await getProject(projectId);
  await prisma.project.delete({ where: { id: projectId } });
}
