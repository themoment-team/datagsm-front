import type { Server, ServerStatus, StatusTone } from './types';

export const SERVER_STATUS_META: Record<
  ServerStatus,
  {
    label: string;
    tone: StatusTone;
  }
> = {
  200: {
    label: '정상',
    tone: 'success',
  },
  502: {
    label: '서비스 다운',
    tone: 'error',
  },
  503: {
    label: '배포 진행 중',
    tone: 'warning',
  },
};

export const HEALTH_CHECK_STATUS_POOL: ServerStatus[] = [200, 200, 200, 200, 200, 502, 503];

export const INITIAL_SERVERS: Server[] = [
  {
    name: 'OAuth Resource',
    description: '사용자 리소스 및 정보 제공 서버',
    status: 200,
    responseTime: 45,
  },
  {
    name: 'OAuth Authorization',
    description: '인증 및 토큰 발급 서버',
    status: 200,
    responseTime: 32,
  },
  {
    name: 'OpenAPI',
    description: '학생/동아리/프로젝트 데이터 API 서버',
    status: 200,
    responseTime: 58,
  },
  { name: 'Web', description: '웹 프론트엔드 서버', status: 200, responseTime: 28 },
];
