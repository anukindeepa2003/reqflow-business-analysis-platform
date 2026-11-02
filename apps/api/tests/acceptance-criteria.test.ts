import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

let projectId: string;
let requirementId: string;

beforeAll(async () => {
  const project = await prisma.project.create({
    data: { name: 'Acceptance Criteria Integration Test Project' },
  });
  projectId = project.id;
  const requirement = await prisma.requirement.create({
    data: {
      projectId,
      sequenceNumber: 1,
      title: 'Allow users to recover access',
      description: 'The system must provide a secure account recovery workflow.',
      type: 'FUNCTIONAL',
      priority: 'MUST',
    },
  });
  requirementId = requirement.id;
});

afterAll(async () => {
  if (projectId) await prisma.project.deleteMany({ where: { id: projectId } });
  await prisma.$disconnect();
});

const basePath = () => `/api/projects/${projectId}/requirements/${requirementId}/acceptance-criteria`;

describe('Acceptance Criteria API', () => {
  it('creates stable IDs, edits criteria, and persists a reordered list', async () => {
    const first = await request(app).post(basePath()).send({
      description: 'A registered user can request a time-limited recovery link.',
    });
    const second = await request(app).post(basePath()).send({
      description: 'The recovery link becomes invalid after it is used successfully.',
    });

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(first.body.data).toMatchObject({ displayId: 'AC-01', position: 1 });
    expect(second.body.data).toMatchObject({ displayId: 'AC-02', position: 2 });

    const firstId = first.body.data.id as string;
    const secondId = second.body.data.id as string;
    const update = await request(app).patch(`${basePath()}/${firstId}`).send({
      description: 'A registered user can request one time-limited recovery link.',
    });
    expect(update.status).toBe(200);
    expect(update.body.data.displayId).toBe('AC-01');

    const reorder = await request(app).put(`${basePath()}/order`).send({
      criterionIds: [secondId, firstId],
    });
    expect(reorder.status).toBe(200);
    expect(reorder.body.data.map((item: { displayId: string }) => item.displayId)).toEqual([
      'AC-02',
      'AC-01',
    ]);

    const list = await request(app).get(basePath());
    expect(list.status).toBe(200);
    expect(list.body.data.map((item: { position: number }) => item.position)).toEqual([1, 2]);

    const deleteResponse = await request(app).delete(`${basePath()}/${firstId}`);
    expect(deleteResponse.status).toBe(204);

    const third = await request(app).post(basePath()).send({
      description: 'A used or expired recovery link displays an understandable error.',
    });
    expect(third.status).toBe(201);
    expect(third.body.data.displayId).toBe('AC-03');
  });

  it('rejects incomplete or duplicate reorder payloads', async () => {
    const list = await request(app).get(basePath());
    const onlyOneId = list.body.data[0].id as string;
    const response = await request(app).put(`${basePath()}/order`).send({
      criterionIds: [onlyOneId],
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_ACCEPTANCE_CRITERIA_ORDER');
  });

  it('rejects invalid criterion text', async () => {
    const response = await request(app).post(basePath()).send({ description: 'No' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects access through a different project', async () => {
    const otherProject = await prisma.project.create({ data: { name: 'Other Project' } });
    try {
      const response = await request(app).get(
        `/api/projects/${otherProject.id}/requirements/${requirementId}/acceptance-criteria`,
      );
      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('REQUIREMENT_NOT_FOUND');
    } finally {
      await prisma.project.delete({ where: { id: otherProject.id } });
    }
  });
});
