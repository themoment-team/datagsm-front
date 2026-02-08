import { ClubType, StudentRole, StudentSex, UserRoleType } from '@repo/shared/types';

export const studentUrl = {
  putStudentById: (studentId: number) => `/v1/students/${studentId}`,
  getStudents: (
    page?: number,
    size?: number,
    grade?: number,
    classNum?: number,
    sex?: StudentSex,
    role?: StudentRole,
    isLeaveSchool?: boolean,
  ) => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (grade !== undefined) params.append('grade', grade.toString());
    if (classNum !== undefined) params.append('classNum', classNum.toString());
    if (sex !== undefined) params.append('sex', sex);
    if (role !== undefined) params.append('role', role);
    if (isLeaveSchool !== undefined) params.append('isLeaveSchool', isLeaveSchool.toString());

    return `/v1/students?${params.toString()}`;
  },
  postStudent: () => '/v1/students',
  patchStudentStatus: (studentId: number) => `/v1/students/${studentId}/status`,
  postStudentBatchOperation: () => '/v1/students/batch-operations',
  postStudentImport: () => '/v1/students/imports',
  getStudentExport: () => '/v1/students/exports/excel',
} as const;

export const authUrl = {
  getApiKey: () => '/v1/auth/api-keys/my',
  putApiKey: () => '/v1/auth/api-keys/my',
  postApiKey: () => '/v1/auth/api-keys/my',
  deleteApiKey: () => '/v1/auth/api-keys/my',
  getApiKeys: (page?: number, size?: number, accountEmail?: string) => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (accountEmail !== undefined) params.append('accountEmail', accountEmail);

    const queryString = params.toString();
    return queryString ? `/v1/auth/api-keys?${queryString}` : '/v1/auth/api-keys';
  },
  getApiScope: (scopeName: string) => `/v1/auth/api-keys/scopes/${scopeName}`,
  getAvailableScope: (userRole: UserRoleType) =>
    `/v1/auth/api-keys/available-scopes?role=${userRole}`,
  deleteApiKeyById: (apiKeyId: number) => `/v1/auth/api-keys/${apiKeyId}`,
} as const;

export const projectUrl = {
  putProjectById: (projectId: number) => `/v1/projects/${projectId}`,
  deleteProjectById: (projectId: number) => `/v1/projects/${projectId}`,
  getProjects: (page?: number, size?: number) => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());

    const queryString = params.toString();
    return queryString ? `/v1/projects?${queryString}` : '/v1/projects';
  },
  postProject: () => '/v1/projects',
} as const;

export const clubUrl = {
  putClubById: (clubId: number) => `/v1/clubs/${clubId}`,
  deleteClubById: (clubId: number) => `/v1/clubs/${clubId}`,
  getClubs: (page?: number, size?: number, type?: ClubType) => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (type != null) params.append('clubType', type);

    const queryString = params.toString();
    return queryString ? `/v1/clubs?${queryString}` : '/v1/clubs';
  },
  postClub: () => '/v1/clubs',
  postClubImport: () => '/v1/clubs/imports',
  getClubExport: () => '/v1/clubs/exports/excel',
} as const;

export const clientUrl = {
  getClientsSearch: (page?: number, size?: number, clientName?: string) => {
    const params = new URLSearchParams();

    if (clientName !== undefined) params.append('clientName', clientName);
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());

    const queryString = params.toString();
    return queryString ? `/v1/clients?${queryString}` : '/v1/clients';
  },
  postClient: () => '/v1/clients',
  deleteClientById: (clientId: string) => `/v1/clients/${clientId}`,
  patchClientById: (clientId: string) => `/v1/clients/${clientId}`,
  getClients: (page?: number, size?: number) => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());

    const queryString = params.toString();
    return queryString ? `/v1/clients/my?${queryString}` : '/v1/clients/my';
  },
  getAvailableScopes: () => '/v1/clients/available-scopes',
} as const;

export const healthUrl = {
  getHealth: () => '/v1/health',
} as const;

export const accountUrl = {
  postEmailVerification: () => '/v1/accounts/email-verifications',
  postEmailVerificationVerify: () => '/v1/accounts/email-verifications/verify',
  postAccount: () => '/v1/accounts',
  getMy: () => '/v1/accounts/my',
  postPasswordReset: () => '/v1/accounts/password-resets',
  postPasswordResetVerification: () => '/v1/accounts/password-resets/verification',
  putPassword: () => '/v1/accounts/password',
} as const;

export const oauthUrl = {
  postOAuthCode: () => '/v1/oauth/code',
  postOAuthToken: () => '/oauth/token', // Next.js Route Handler (client_secret 숨김)
  postOAuthTokenRefresh: () => '/v1/oauth/token', // 토큰 갱신 (통합 엔드포인트)
} as const;
