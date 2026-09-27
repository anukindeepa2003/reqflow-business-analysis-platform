export interface HealthStatus {
  status: 'ok';
  service: 'reqflow-api';
  timestamp: string;
}

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    service: 'reqflow-api',
    timestamp: new Date().toISOString(),
  };
}
