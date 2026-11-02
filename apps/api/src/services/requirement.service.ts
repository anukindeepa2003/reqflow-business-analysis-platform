import { Prisma, type Requirement } from '@prisma/client';
import { AppError } from '../lib/app-error.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateRequirementInput,
  ListRequirementsQuery,
  UpdateRequirementInput,
} from '../validation/requirement.schemas.js';

export interface RequirementDto extends Requirement {
  displayId: string;
}

function toRequirementDto(requirement: Requirement): RequirementDto {
  return {
    ...requirement,
    displayId: `REQ-${requirement.sequenceNumber.toString().padStart(4, '0')}`,
  };
}

export async function listRequirements(projectId: string, query: ListRequirementsQuery) {
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } });
  if (!project) {
    throw new AppError(404, 'PROJECT_NOT_FOUND', 'The requested project was not found.');
  }

  const requirements = await prisma.requirement.findMany({
    where: {
      projectId,
      type: query.type,
      priority: query.priority,
      status: query.status,
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: [{ updatedAt: 'desc' }, { sequenceNumber: 'asc' }],
  });

  return requirements.map(toRequirementDto);
}

export async function getRequirement(projectId: string, requirementId: string) {
  const requirement = await prisma.requirement.findFirst({
    where: { id: requirementId, projectId },
  });

  if (!requirement) {
    throw new AppError(404, 'REQUIREMENT_NOT_FOUND', 'The requested requirement was not found.');
  }

  return toRequirementDto(requirement);
}

export async function createRequirement(projectId: string, input: CreateRequirementInput) {
  try {
    const requirement = await prisma.$transaction(async (transaction) => {
      const project = await transaction.project.update({
        where: { id: projectId },
        data: { nextRequirementNumber: { increment: 1 } },
        select: { nextRequirementNumber: true },
      });

      return transaction.requirement.create({
        data: {
          projectId,
          sequenceNumber: project.nextRequirementNumber - 1,
          title: input.title,
          description: input.description,
          type: input.type,
          priority: input.priority,
          status: input.status ?? 'DRAFT',
        },
      });
    });

    return toRequirementDto(requirement);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError(404, 'PROJECT_NOT_FOUND', 'The requested project was not found.');
    }
    throw error;
  }
}

export async function updateRequirement(
  projectId: string,
  requirementId: string,
  input: UpdateRequirementInput,
) {
  await getRequirement(projectId, requirementId);

  const data: Prisma.RequirementUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.type !== undefined) data.type = input.type;
  if (input.priority !== undefined) data.priority = input.priority;
  if (input.status !== undefined) data.status = input.status;

  const requirement = await prisma.requirement.update({
    where: { id: requirementId },
    data,
  });

  return toRequirementDto(requirement);
}

export async function deleteRequirement(projectId: string, requirementId: string): Promise<void> {
  await getRequirement(projectId, requirementId);
  await prisma.requirement.delete({ where: { id: requirementId } });
}
