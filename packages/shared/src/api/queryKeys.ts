import { UserRoleType } from '../types';

export const studentQueryKeys = {
  putStudentById: () => ['students', 'update'] as const,
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
  patchStudentStatus: () => ['students', 'status', 'update'] as const,
  postStudentBatchOperation: () => ['students', 'batch-operations'] as const,
  postStudentImport: () => ['students', 'imports'] as const,
  getStudentExport: () => ['students', 'exports', 'excel'] as const,
} as const;

export const authQueryKeys = {
  getApiKey: () => ['auth', 'api-keys', 'my', 'get'] as const,
  putApiKey: () => ['auth', 'api-keys', 'my', 'update'] as const,
  postApiKey: () => ['auth', 'api-keys', 'my', 'create'] as const,
  deleteApiKey: () => ['auth', 'api-keys', 'my', 'delete'] as const,
  getApiKeys: (page?: number, size?: number, accountEmail?: string) =>
    ['auth', 'api-keys', 'list', { page, size, accountEmail }] as const,
  getApiScope: (scopeName: string) => ['auth', 'api-keys', 'scopes', scopeName] as const,
  getAvailableScope: (userRole: UserRoleType) =>
    ['auth', 'api-keys', 'available-scopes', userRole] as const,
  deleteApiKeyById: () => ['auth', 'api-keys', 'delete'] as const,
} as const;

export const projectQueryKeys = {
  putProjectById: () => ['projects', 'update'] as const,
  deleteProjectById: () => ['projects', 'delete'] as const,
  getProjects: (page?: number, size?: number) => ['projects', 'list', { page, size }] as const,
  postProject: () => ['projects', 'create'] as const,
} as const;

export const clubQueryKeys = {
  putClubById: () => ['clubs', 'update'] as const,
  deleteClubById: () => ['clubs', 'delete'] as const,
  getClubs: (page?: number, size?: number, type?: string) =>
    ['clubs', 'list', { page, size, type }] as const,
  postClub: () => ['clubs', 'create'] as const,
  postClubImport: () => ['clubs', 'imports'] as const,
  getClubExport: () => ['clubs', 'exports', 'excel'] as const,
} as const;

export const clientQueryKeys = {
  getClientsSearch: (page?: number, size?: number, clientName?: string) =>
    ['clients', 'search', { page, size, clientName }] as const,
  postClient: () => ['clients', 'create'] as const,
  deleteClientById: () => ['clients', 'delete'] as const,
  patchClientById: () => ['clients', 'update'] as const,
  getClients: (page?: number, size?: number) => ['clients', 'my', { page, size }] as const,
  getAvailableScopes: () => ['clients', 'available-scopes'] as const,
} as const;

export const healthQueryKeys = {
  getHealth: () => ['health', 'check'] as const,
} as const;

export const accountQueryKeys = {
  postEmailVerification: () => ['accounts', 'email-verifications'] as const,
  postEmailVerificationVerify: () => ['accounts', 'email-verifications', 'verify'] as const,
  postAccount: () => ['accounts', 'create'] as const,
  getMy: () => ['accounts', 'my'] as const,
  postPasswordReset: () => ['accounts', 'password-resets'] as const,
  postPasswordResetVerification: () => ['accounts', 'password-resets', 'verification'] as const,
  putPassword: () => ['accounts', 'password', 'update'] as const,
} as const;

export const oauthQueryKeys = {
  postOAuthTokens: () => ['oauth', 'tokens'] as const,
  postOAuthToken: () => ['oauth', 'token'] as const,
  postOAuthCode: () => ['oauth', 'code'] as const,
} as const;
