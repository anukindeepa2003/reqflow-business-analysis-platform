import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

const projectIdsToClean = new Set<string>();

afterAll(async () => {
  if (projectIdsToClean.size > 0) {
    await prisma.project.deleteMany({
      where: { id: { in: [...projectIdsToClean] } },
    });
  }

  await prisma.$disconnect();
});

describe('Project API', () => {
  it('supports the complete project lifecycle', async () => {
    const createResponse = await request(app).post('/api/projects').send({
      name: 'Client Portal Modernization',
      description: 'A Phase 2 integration-test project.',
      status: 'PLANNING',
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data).toMatchObject({
      name: 'Client Portal Modernization',
      description: 'A Phase 2 integration-test project.',
      status: 'PLANNING',
    });
    expect(createResponse.body.data.id).toEqual(expect.any(String));

    const projectId = createResponse.body.data.id as string;
    projectIdsToClean.add(projectId);

    const listResponse = await request(app).get('/api/projects');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: projectId })]),
    );

    const detailResponse = await request(app).get(`/api/projects/${projectId}`);
    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.data.id).toBe(projectId);

    const updateResponse = await request(app).patch(`/api/projects/${projectId}`).send({
      status: 'ACTIVE',
      description: 'Updated through the Project API integration test.',
    });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data).toMatchObject({
      id: projectId,
      status: 'ACTIVE',
      description: 'Updated through the Project API integration test.',
    });

    const deleteResponse = await request(app).delete(`/api/projects/${projectId}`);
    expect(deleteResponse.status).toBe(204);
    projectIdsToClean.delete(projectId);

    const missingResponse = await request(app).get(`/api/projects/${projectId}`);
    expect(missingResponse.status).toBe(404);
    expect(missingResponse.body.error.code).toBe('PROJECT_NOT_FOUND');
  });

  it('rejects invalid project input before it reaches the service', async () => {
    const response = await request(app).post('/api/projects').send({
      name: 'A',
      unexpectedField: true,
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects invalid project identifiers', async () => {
    const response = await request(app).get('/api/projects/not-a-uuid');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
