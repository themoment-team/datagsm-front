import { ClubType, StudentRole, StudentSex, UserRoleType } from '@repo/shared/types';

export const accountUrl = {
  getMy: () => '/v1/accounts/my',
  getEmailCheck: () => '/v1/accounts/email/check',
  postSignup: () => '/v1/accounts/signup',
  postEmailSend: () => '/v1/accounts/email/send',
} as const;

export const authUrl = {
  deleteApiKey: () => '/v1/auth/api-keys',
  getApiKey: () => '/v1/auth/api-keys',
  getAvailableScope: (userRole: UserRoleType) =>
    `/v1/auth/api-keys/available-scopes?role=${userRole}`,
  postApiKey: () => '/v1/auth/api-keys',
  postLogin: () => '/v1/auth/signin',
  putRefresh: () => '/v1/auth/refresh',
  putApiKey: () => '/v1/auth/api-keys',
} as const;

export const oauthUrl = {
  postOAuthCode: () => '/v1/oauth/code',
} as const;

export const clubUrl = {
  deleteClubById: (clubId: number) => `/v1/clubs/${clubId}`,
  getClubs: (page?: number, size?: number, type?: ClubType) => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (type != null) params.append('clubType', type);

    const queryString = params.toString();
    return queryString ? `/v1/clubs?${queryString}` : '/v1/clubs';
  },
  getClubExcel: () => '/v1/clubs/excel/download',
  postClub: () => '/v1/clubs',
  postClubExcel: () => '/v1/clubs/excel/upload',
  putClubById: (clubId: number) => `/v1/clubs/${clubId}`,
} as const;

export const healthUrl = {
  getHealth: () => '/v1/health',
} as const;

export const studentUrl = {
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
  getStudentExcel: () => '/v1/students/excel/download',
  postStudent: () => '/v1/students',
  postStudentExcel: () => '/v1/students/excel/upload',
  putStudentById: (studentId: number) => `/v1/students/${studentId}`,
} as const;

export const clientUrl = {
  getClients: (page?: number, size?: number) => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());

    const queryString = params.toString();
    return queryString ? `/v1/clients/my?${queryString}` : '/v1/clients/my';
  },
  postClient: () => '/v1/clients',
  deleteClientById: (clientId: string) => `/v1/clients/${clientId}`,
  patchClientById: (clientId: string) => `/v1/clients/${clientId}`,
  getClientsSearch: (page?: number, size?: number, clientName?: string) => {
    const params = new URLSearchParams();

    if (clientName !== undefined) params.append('clientName', clientName);
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());

    const queryString = params.toString();
    return queryString ? `/v1/clients?${queryString}` : '/v1/clients';
  },
  getAvailableScopes: () => '/v1/clients/available-scopes',
} as const;
