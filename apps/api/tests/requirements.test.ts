import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

let projectId: string;

beforeAll(async () => {
  const project = await prisma.project.create({
    data: {
      name: 'Requirements Integration Test Project',
      description: 'Temporary project used by the Phase 3 API tests.',
    },
  });
  projectId = project.id;
});

afterAll(async () => {
  if (projectId) await prisma.project.deleteMany({ where: { id: projectId } });
  await prisma.$disconnect();
});

describe('Requirement API', () => {
  it('supports the complete project-scoped requirement lifecycle', async () => {
    const createResponse = await request(app)
      .post(`/api/projects/${projectId}/requirements`)
      .send({
        title: 'Record customer contact details',
        description: 'The system must store validated customer contact details for later use.',
        type: 'FUNCTIONAL',
        priority: 'MUST',
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data).toMatchObject({
      projectId,
      displayId: 'REQ-0001',
      sequenceNumber: 1,
      status: 'DRAFT',
    });

    const requirementId = createResponse.body.data.id as string;

    const secondResponse = await request(app)
      .post(`/api/projects/${projectId}/requirements`)
      .send({
        title: 'Protect sensitive data',
        description: 'The system must protect sensitive customer data in storage and transit.',
        type: 'NON_FUNCTIONAL',
        priority: 'SHOULD',
        status: 'READY',
      });

    expect(secondResponse.status).toBe(201);
    expect(secondResponse.body.data.displayId).toBe('REQ-0002');

    const filteredResponse = await request(app)
      .get(`/api/projects/${projectId}/requirements`)
      .query({ type: 'FUNCTIONAL', search: 'contact' });

    expect(filteredResponse.status).toBe(200);
    expect(filteredResponse.body.data).toHaveLength(1);
    expect(filteredResponse.body.data[0].id).toBe(requirementId);

    const detailResponse = await request(app)
      .get(`/api/projects/${projectId}/requirements/${requirementId}`);
    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.data.displayId).toBe('REQ-0001');

    const updateResponse = await request(app)
      .patch(`/api/projects/${projectId}/requirements/${requirementId}`)
      .send({ status: 'IN_PROGRESS', priority: 'SHOULD' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data).toMatchObject({
      id: requirementId,
      displayId: 'REQ-0001',
      status: 'IN_PROGRESS',
      priority: 'SHOULD',
    });

    const deleteResponse = await request(app)
      .delete(`/api/projects/${projectId}/requirements/${requirementId}`);
    expect(deleteResponse.status).toBe(204);

    const missingResponse = await request(app)
      .get(`/api/projects/${projectId}/requirements/${requirementId}`);
    expect(missingResponse.status).toBe(404);
    expect(missingResponse.body.error.code).toBe('REQUIREMENT_NOT_FOUND');
  });

  it('does not reuse readable sequence numbers after deletion', async () => {
    const response = await request(app)
      .post(`/api/projects/${projectId}/requirements`)
      .send({
        title: 'Provide an audit-friendly identifier',
        description: 'Every requirement must retain a stable readable project identifier.',
        type: 'FUNCTIONAL',
        priority: 'COULD',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.displayId).toBe('REQ-0003');
  });

  it('rejects invalid requirement data', async () => {
    const response = await request(app)
      .post(`/api/projects/${projectId}/requirements`)
      .send({
        title: 'A',
        description: 'Too short',
        type: 'UNKNOWN',
        priority: 'URGENT',
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns project not found for an unknown project', async () => {
    const response = await request(app)
      .get('/api/projects/00000000-0000-4000-8000-000000000000/requirements');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('PROJECT_NOT_FOUND');
  });
});
