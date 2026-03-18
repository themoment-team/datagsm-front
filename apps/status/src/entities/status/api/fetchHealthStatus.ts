import type { BaseApiResponse } from '@repo/shared/types';

import type { HealthStatusData, Server, ServerStatus } from '../model/types';

interface HealthServiceTarget {
  name: string;
  description: string;
  path: string;
}

interface FetchHealthStatusOptions {
  baseOrigin?: string;
}

const HEALTH_SERVICE_TARGETS: HealthServiceTarget[] = [
  {
    name: 'Web',
    description: '웹 프론트엔드 서버',
    path: '/api/server1/v1/health',
  },
  {
    name: 'OpenAPI',
    description: '학생/동아리/프로젝트 데이터 API 서버',
    path: '/api/server2/v1/health',
  },
  {
    name: 'OAuth Authorization',
    description: '인증 및 토큰 발급 서버',
    path: '/api/server3/v1/health',
  },
  {
    name: 'OAuth Resource',
    description: '사용자 리소스 및 정보 제공 서버',
    path: '/api/server4/v1/health',
  },
];

const resolveHealthStatus = (status: number): ServerStatus => {
  if (status === 200) {
    return 200;
  }

  if (status === 503) {
    return 503;
  }

  return 502;
};

const resolveRequestPath = (path: string, baseOrigin?: string) => {
  if (!baseOrigin) {
    return path;
  }

  return `${baseOrigin}${path}`;
};

const fetchServiceStatus = async (
  service: HealthServiceTarget,
  baseOrigin?: string,
): Promise<Server> => {
  const startedAt = Date.now();

  try {
    const response = await fetch(resolveRequestPath(service.path, baseOrigin), {
      cache: 'no-store',
    });

    let healthResponseCode: number | undefined;

    try {
      const payload = (await response.json()) as BaseApiResponse;
      healthResponseCode = payload.code;
    } catch {
      // Keep fallback path using HTTP status when payload is unavailable.
    }

    const resolvedStatus = resolveHealthStatus(healthResponseCode ?? response.status);

    return {
      name: service.name,
      description: service.description,
      status: resolvedStatus,
      responseTime: resolvedStatus === 200 ? Date.now() - startedAt : undefined,
    };
  } catch {
    return {
      name: service.name,
      description: service.description,
      status: 502,
    };
  }
};

export const fetchHealthStatus = async (
  options: FetchHealthStatusOptions = {},
): Promise<HealthStatusData> => {
  const servers = await Promise.all(
    HEALTH_SERVICE_TARGETS.map((service) => fetchServiceStatus(service, options.baseOrigin)),
  );

  return {
    servers,
    checkedAt: new Date().toISOString(),
  };
};
