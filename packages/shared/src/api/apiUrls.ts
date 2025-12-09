import { StudentRole, StudentSex } from '@repo/shared/types';

const addParams = (key: string, value: string | number | boolean | undefined) => {
  if (value === undefined) return '';
  return `&${key}=${value}`;
};

export const authUrl = {
  deleteApiKey: () => '/v1/auth/api-key',
  getApiKey: () => '/v1/auth/api-key',
  getApiKeyRenewable: () => '/v1/auth/api-key/renewable',
  postGoogleLogin: () => '/v1/auth/google',
  postApiKey: () => '/v1/auth/api-key',
  putApiKey: () => '/v1/auth/api-key',
  putRefresh: () => '/v1/auth/refresh',
} as const;

export const clubUrl = {
  deleteClubById: (clubId: string) => `/v1/clubs/${clubId}`,
  getClubs: () => '/v1/clubs',
  patchClubById: (clubId: string) => `/v1/clubs/${clubId}`,
  postClub: () => '/v1/clubs',
} as const;

export const healthUrl = {
  getHealth: () => '/v1/health',
} as const;

export const studentUrl = {
  getStudents: (
    page: number,
    size: number,
    grade?: number,
    classNum?: number,
    sex?: StudentSex,
    role?: StudentRole,
    isLeaveSchool?: boolean,
  ) =>
    `/v1/students?page=${page}&size=${size}${addParams('grade', grade)}${addParams('classNum', classNum)}${addParams('sex', sex)}${addParams('role', role)}${addParams('isLeaveSchool', isLeaveSchool)}`,
  patchStudentById: (studentId: string) => `/v1/students/${studentId}`,
  postStudent: () => '/v1/students',
} as const;
