import { ClubType } from '@repo/shared/types';

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
