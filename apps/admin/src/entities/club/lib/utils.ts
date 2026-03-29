import { ClubStatus, ClubType } from '@repo/shared/types';

export const getTypeBadgeVariant = (type: ClubType) => {
  switch (type) {
    case 'MAJOR_CLUB':
      return 'default';
    case 'AUTONOMOUS_CLUB':
      return 'outline';
    default:
      return 'outline';
  }
};

export const getTypeLabel = (type: ClubType) => {
  switch (type) {
    case 'MAJOR_CLUB':
      return '전공';
    case 'AUTONOMOUS_CLUB':
      return '자율';
    default:
      return '-';
  }
};

export const getStatusBadgeVariant = (status: ClubStatus) => {
  switch (status) {
    case 'ACTIVE':
      return 'default';
    case 'ABOLISHED':
      return 'outline';
    default:
      return 'outline';
  }
};

export const getStatusLabel = (status: ClubStatus) => {
  switch (status) {
    case 'ACTIVE':
      return '운영 중';
    case 'ABOLISHED':
      return '폐지';
    default:
      return '-';
  }
};
