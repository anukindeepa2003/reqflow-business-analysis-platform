export interface AcceptanceCriterion {
  id: string;
  requirementId: string;
  sequenceNumber: number;
  position: number;
  displayId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface DataResponse<T> {
  data: T;
}

interface ErrorResponse {
  error?: { message?: string };
}

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ErrorResponse;
    throw new Error(body.error?.message ?? 'The request could not be completed.');
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function collectionPath(projectId: string, requirementId: string): string {
  return `/api/projects/${projectId}/requirements/${requirementId}/acceptance-criteria`;
}

export async function getAcceptanceCriteria(
  projectId: string,
  requirementId: string,
): Promise<AcceptanceCriterion[]> {
  const response = await apiRequest<DataResponse<AcceptanceCriterion[]>>(
    collectionPath(projectId, requirementId),
  );
  return response.data;
}

export async function createAcceptanceCriterion(
  projectId: string,
  requirementId: string,
  description: string,
): Promise<AcceptanceCriterion> {
  const response = await apiRequest<DataResponse<AcceptanceCriterion>>(
    collectionPath(projectId, requirementId),
    { method: 'POST', body: JSON.stringify({ description }) },
  );
  return response.data;
}

export async function updateAcceptanceCriterion(
  projectId: string,
  requirementId: string,
  criterionId: string,
  description: string,
): Promise<AcceptanceCriterion> {
  const response = await apiRequest<DataResponse<AcceptanceCriterion>>(
    `${collectionPath(projectId, requirementId)}/${criterionId}`,
    { method: 'PATCH', body: JSON.stringify({ description }) },
  );
  return response.data;
}

export function deleteAcceptanceCriterion(
  projectId: string,
  requirementId: string,
  criterionId: string,
): Promise<void> {
  return apiRequest<void>(`${collectionPath(projectId, requirementId)}/${criterionId}`, {
    method: 'DELETE',
  });
}

export async function reorderAcceptanceCriteria(
  projectId: string,
  requirementId: string,
  criterionIds: string[],
): Promise<AcceptanceCriterion[]> {
  const response = await apiRequest<DataResponse<AcceptanceCriterion[]>>(
    `${collectionPath(projectId, requirementId)}/order`,
    { method: 'PUT', body: JSON.stringify({ criterionIds }) },
  );
  return response.data;
}
