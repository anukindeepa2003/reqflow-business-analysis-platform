export const requirementTypes = ['FUNCTIONAL', 'NON_FUNCTIONAL'] as const;
export const requirementPriorities = ['MUST', 'SHOULD', 'COULD', 'WONT'] as const;
export const requirementStatuses = [
  'DRAFT',
  'READY',
  'IN_PROGRESS',
  'IMPLEMENTED',
  'DEFERRED',
] as const;

export type RequirementType = (typeof requirementTypes)[number];
export type RequirementPriority = (typeof requirementPriorities)[number];
export type RequirementStatus = (typeof requirementStatuses)[number];

export interface Requirement {
  id: string;
  projectId: string;
  sequenceNumber: number;
  displayId: string;
  title: string;
  description: string;
  type: RequirementType;
  priority: RequirementPriority;
  status: RequirementStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RequirementInput {
  title: string;
  description: string;
  type: RequirementType;
  priority: RequirementPriority;
  status: RequirementStatus;
}

export interface RequirementFilters {
  search?: string;
  type?: RequirementType;
  priority?: RequirementPriority;
  status?: RequirementStatus;
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

export async function getRequirements(
  projectId: string,
  filters: RequirementFilters = {},
): Promise<Requirement[]> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.type) params.set('type', filters.type);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.status) params.set('status', filters.status);
  const query = params.size > 0 ? `?${params.toString()}` : '';
  const response = await apiRequest<DataResponse<Requirement[]>>(
    `/api/projects/${projectId}/requirements${query}`,
  );
  return response.data;
}

export async function createRequirement(
  projectId: string,
  input: RequirementInput,
): Promise<Requirement> {
  const response = await apiRequest<DataResponse<Requirement>>(
    `/api/projects/${projectId}/requirements`,
    { method: 'POST', body: JSON.stringify(input) },
  );
  return response.data;
}

export async function updateRequirement(
  projectId: string,
  requirementId: string,
  input: RequirementInput,
): Promise<Requirement> {
  const response = await apiRequest<DataResponse<Requirement>>(
    `/api/projects/${projectId}/requirements/${requirementId}`,
    { method: 'PATCH', body: JSON.stringify(input) },
  );
  return response.data;
}

export function deleteRequirement(projectId: string, requirementId: string): Promise<void> {
  return apiRequest<void>(`/api/projects/${projectId}/requirements/${requirementId}`, {
    method: 'DELETE',
  });
}
