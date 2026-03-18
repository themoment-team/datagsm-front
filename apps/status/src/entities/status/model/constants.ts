import type { ServerStatus, StatusTone } from './types';

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
