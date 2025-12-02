import { StudentMajor, StudentRole, StudentSex } from '../model/types';

export const getRoleBadgeVariant = (role: StudentRole) => {
  switch (role) {
    case 'STUDENT_COUNCIL':
      return 'default';
    case 'DORMITORY_MANAGER':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const getRoleLabel = (role: StudentRole) => {
  switch (role) {
    case 'STUDENT_COUNCIL':
      return '학생회';
    case 'DORMITORY_MANAGER':
      return '기숙사 관리자';
    case 'GENERAL_STUDENT':
      return '일반학생';
  }
};

export const getMajorLabel = (major: StudentMajor) => {
  switch (major) {
    case 'SW':
      return 'SW개발과';
    case 'IOT':
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
