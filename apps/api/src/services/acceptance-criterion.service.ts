import { Prisma, type AcceptanceCriterion } from '@prisma/client';
import { AppError } from '../lib/app-error.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateAcceptanceCriterionInput,
  ReorderAcceptanceCriteriaInput,
  UpdateAcceptanceCriterionInput,
} from '../validation/acceptance-criterion.schemas.js';

export interface AcceptanceCriterionDto extends AcceptanceCriterion {
  displayId: string;
}

function toAcceptanceCriterionDto(criterion: AcceptanceCriterion): AcceptanceCriterionDto {
  return {
    ...criterion,
    displayId: `AC-${criterion.sequenceNumber.toString().padStart(2, '0')}`,
  };
}

async function ensureRequirementOwnership(projectId: string, requirementId: string): Promise<void> {
  const requirement = await prisma.requirement.findFirst({
    where: { id: requirementId, projectId },
    select: { id: true },
  });

  if (!requirement) {
    throw new AppError(404, 'REQUIREMENT_NOT_FOUND', 'The requested requirement was not found.');
  }
}

export async function listAcceptanceCriteria(projectId: string, requirementId: string) {
  await ensureRequirementOwnership(projectId, requirementId);
  const criteria = await prisma.acceptanceCriterion.findMany({
    where: { requirementId },
    orderBy: [{ position: 'asc' }, { sequenceNumber: 'asc' }],
  });
  return criteria.map(toAcceptanceCriterionDto);
}

export async function createAcceptanceCriterion(
  projectId: string,
  requirementId: string,
  input: CreateAcceptanceCriterionInput,
) {
  await ensureRequirementOwnership(projectId, requirementId);

  try {
    const criterion = await prisma.$transaction(async (transaction) => {
      const requirement = await transaction.requirement.update({
        where: { id: requirementId },
        data: { nextAcceptanceCriterionNumber: { increment: 1 } },
        select: { nextAcceptanceCriterionNumber: true },
      });
      const allocatedNumber = requirement.nextAcceptanceCriterionNumber - 1;

      return transaction.acceptanceCriterion.create({
        data: {
          requirementId,
          sequenceNumber: allocatedNumber,
          position: allocatedNumber,
          description: input.description,
        },
      });
    });

    return toAcceptanceCriterionDto(criterion);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError(404, 'REQUIREMENT_NOT_FOUND', 'The requested requirement was not found.');
    }
    throw error;
  }
}

export async function updateAcceptanceCriterion(
  projectId: string,
  requirementId: string,
  criterionId: string,
  input: UpdateAcceptanceCriterionInput,
) {
  await ensureRequirementOwnership(projectId, requirementId);
  const criterion = await prisma.acceptanceCriterion.findFirst({
    where: { id: criterionId, requirementId },
  });

  if (!criterion) {
    throw new AppError(404, 'ACCEPTANCE_CRITERION_NOT_FOUND', 'The requested acceptance criterion was not found.');
  }

  const updated = await prisma.acceptanceCriterion.update({
    where: { id: criterionId },
    data: { description: input.description },
  });
  return toAcceptanceCriterionDto(updated);
}

export async function deleteAcceptanceCriterion(
  projectId: string,
  requirementId: string,
  criterionId: string,
): Promise<void> {
  await ensureRequirementOwnership(projectId, requirementId);
  const criterion = await prisma.acceptanceCriterion.findFirst({
    where: { id: criterionId, requirementId },
    select: { id: true },
  });

  if (!criterion) {
    throw new AppError(404, 'ACCEPTANCE_CRITERION_NOT_FOUND', 'The requested acceptance criterion was not found.');
  }
  await prisma.acceptanceCriterion.delete({ where: { id: criterionId } });
}

export async function reorderAcceptanceCriteria(
  projectId: string,
  requirementId: string,
  input: ReorderAcceptanceCriteriaInput,
) {
  await ensureRequirementOwnership(projectId, requirementId);
  const existing = await prisma.acceptanceCriterion.findMany({
    where: { requirementId },
    select: { id: true, position: true },
  });
  const existingIds = new Set(existing.map((criterion) => criterion.id));
  const exactSet = existingIds.size === input.criterionIds.length
    && input.criterionIds.every((criterionId) => existingIds.has(criterionId));

  if (!exactSet) {
    throw new AppError(
      400,
      'INVALID_ACCEPTANCE_CRITERIA_ORDER',
      'The order must include every acceptance criterion exactly once.',
    );
  }

  const finalPositions = new Map(
    input.criterionIds.map((criterionId, index) => [criterionId, index + 1]),
  );
  const consistentLockOrder = [...input.criterionIds].sort();
  const temporaryPositionBase = Math.max(
    input.criterionIds.length,
    ...existing.map((criterion) => criterion.position),
  ) + input.criterionIds.length + 1;

  await prisma.$transaction(async (transaction) => {
    for (const [index, criterionId] of consistentLockOrder.entries()) {
      await transaction.acceptanceCriterion.update({
        where: { id: criterionId },
        data: { position: temporaryPositionBase + index },
      });
    }
    for (const criterionId of consistentLockOrder) {
      await transaction.acceptanceCriterion.update({
        where: { id: criterionId },
        data: { position: finalPositions.get(criterionId)! },
      });
    }
  });

  return listAcceptanceCriteria(projectId, requirementId);
}
