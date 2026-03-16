export type ServerStatus = 200 | 502 | 503;

export interface Server {
  name: string;
  description: string;
  status: ServerStatus;
  responseTime?: number;
}

export type StatusTone = 'success' | 'warning' | 'error';

export interface HealthStatusData {
  servers: Server[];
  checkedAt: string;
}
