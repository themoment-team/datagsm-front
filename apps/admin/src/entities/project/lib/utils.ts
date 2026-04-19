import { ProjectStatus } from '@repo/shared/types';

export const getProjectStatusLabel = (status: ProjectStatus) => {
  switch (status) {
    case 'ACTIVE':
      return '운영 중';
    case 'ENDED':
      return '종료';
    default:
      return '-';
  }
};
