export const projectStatuses = [
  'PLANNING',
  'ACTIVE',
  'ON_HOLD',
  'COMPLETED',
  'ARCHIVED',
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  name: string;
  description: string | null;
  status: ProjectStatus;
}

interface DataResponse<T> {
  data: T;
}

interface ErrorResponse {
  error?: {
    message?: string;
  };
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

export async function getProjects(): Promise<Project[]> {
  const response = await apiRequest<DataResponse<Project[]>>('/api/projects');
  return response.data;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const response = await apiRequest<DataResponse<Project>>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateProject(projectId: string, input: ProjectInput): Promise<Project> {
  const response = await apiRequest<DataResponse<Project>>(`/api/projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  return response.data;
}

export function deleteProject(projectId: string): Promise<void> {
  return apiRequest<void>(`/api/projects/${projectId}`, { method: 'DELETE' });
}
