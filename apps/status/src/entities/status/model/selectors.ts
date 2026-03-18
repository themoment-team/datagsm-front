import type { Server, StatusTone } from './types';

export const isAllOperational = (servers: Server[]) =>
  servers.every((server) => server.status === 200);

export const hasDownServer = (servers: Server[]) => servers.some((server) => server.status === 502);

export const hasDeployingServer = (servers: Server[]) =>
  servers.some((server) => server.status === 503);

export const getOverallStatus = (servers: Server[]): { label: string; tone: StatusTone } => {
  if (hasDownServer(servers)) {
    return {
      label: '일부 서비스 장애',
      tone: 'error',
    };
  }

  if (hasDeployingServer(servers)) {
    return {
      label: '배포 진행 중',
      tone: 'warning',
    };
  }

  return {
    label: '모든 서비스 정상',
    tone: 'success',
  };
};
