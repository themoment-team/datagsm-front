import { UserRoleType } from '../types';

export const accountQueryKeys = {
  getEmailCheck: (email: string, code: string) =>
    ['account', 'email', 'check', email, code] as const,
  postEmailSend: () => ['account', 'email', 'send'] as const,
  postSignup: () => ['account', 'signup'] as const,
} as const;

export const authQueryKeys = {
  deleteApiKey: () => ['auth', 'api-key', 'delete'] as const,
  getApiKey: () => ['auth', 'api-key', 'get'] as const,
  getAvailableScope: (userRole: UserRoleType) =>
    ['auth', 'api-key', 'available-scope', userRole] as const,
  postApiKey: () => ['auth', 'api-key', 'create'] as const,
  postGoogleLogin: () => ['auth', 'google', 'login'] as const,
  putRefresh: () => ['auth', 'refresh'] as const,
  putApiKey: () => ['auth', 'api-key', 'update'] as const,
} as const;

export const clubQueryKeys = {
  deleteClubById: () => ['clubs', 'delete'] as const,
  getClubs: (page?: number, size?: number, type?: string) =>
    ['clubs', 'list', { page, size, type }] as const,
  postClub: () => ['clubs', 'create'] as const,
  postClubExcel: () => ['clubs', 'excel', 'upload'] as const,
  putClubById: () => ['clubs', 'update'] as const,
} as const;

export const studentQueryKeys = {
  getStudents: (
    page?: number,
    size?: number,
    grade?: number,
    classNum?: number,
    sex?: string,
    role?: string,
    isLeaveSchool?: boolean,
  ) => ['students', 'list', { page, size, grade, classNum, sex, role, isLeaveSchool }] as const,
  postStudent: () => ['students', 'create'] as const,
  postStudentExcel: () => ['students', 'excel', 'upload'] as const,
  putStudentById: () => ['students', 'update'] as const,
} as const;

export const healthQueryKeys = {
  getHealth: () => ['health', 'check'] as const,
} as const;
