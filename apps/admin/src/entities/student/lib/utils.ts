import { StudentMajor, StudentRole, StudentSex } from '@repo/shared/types';

export const getRoleBadgeVariant = (role: StudentRole) => {
  switch (role) {
    case 'STUDENT_COUNCIL':
      return 'default';
    case 'DORMITORY_MANAGER':
      return 'secondary';
    case 'GRADUATE':
      return 'outline';
    case 'WITHDRAWN':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const getRoleLabel = (role: StudentRole) => {
  switch (role) {
    case 'STUDENT_COUNCIL':
      return '학생회';
    case 'DORMITORY_MANAGER':
      return '기자위';
    case 'GENERAL_STUDENT':
      return '일반학생';
    case 'GRADUATE':
      return '졸업생';
    case 'WITHDRAWN':
      return '자퇴생';
  }
};

export const getMajorLabel = (major: StudentMajor) => {
  switch (major) {
    case 'SW_DEVELOPMENT':
      return 'SW개발과';
    case 'SMART_IOT':
      return '스마트IoT과';
    case 'AI':
      return 'AI과';
    default:
      return major;
  }
};

export const getSexLabel = (sex: StudentSex) => {
  switch (sex) {
    case 'MAN':
      return '남';
    case 'WOMAN':
      return '여';
    default:
      return sex;
  }
};
