import { UserRoleType } from '../types';

export const accountQueryKeys = {
  postEmailCheck: () => ['accounts', 'email', 'check'] as const,
  postEmailSend: () => ['accounts', 'email', 'send'] as const,
  postSignup: () => ['accounts', 'signup'] as const,
} as const;

export const authQueryKeys = {
  deleteApiKey: () => ['auth', 'api-keys', 'delete'] as const,
  getApiKey: () => ['auth', 'api-keys', 'get'] as const,
  getAvailableScope: (userRole: UserRoleType) =>
    ['auth', 'api-keys', 'available-scope', userRole] as const,
  postApiKey: () => ['auth', 'api-keys', 'create'] as const,
  postLogin: () => ['auth', 'signin'] as const,
  putRefresh: () => ['auth', 'refresh'] as const,
  putApiKey: () => ['auth', 'api-keys', 'update'] as const,
} as const;

export const oauthQueryKeys = {
  postOAuthCode: () => ['oauth', 'code'] as const,
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

export const clientQueryKeys = {
  getClients: (page?: number, size?: number) => ['clients', 'list', { page, size }] as const,
  postClient: () => ['clients', 'create'] as const,
  deleteClientById: () => ['clients', 'delete'] as const,
  patchClientById: () => ['clients', 'update'] as const,
  getAvailableScopes: () => ['clients', 'available-scopes'] as const,
} as const;
