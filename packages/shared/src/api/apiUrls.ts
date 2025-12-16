import { ClubType, StudentRole, StudentSex } from '@repo/shared/types';

export const authUrl = {
  deleteApiKey: () => '/v1/auth/api-key',
  getApiKey: () => '/v1/auth/api-key',
  getApiKeyRenewable: () => '/v1/auth/api-key/renewable',
  postApiKey: () => '/v1/auth/api-key',
  postGoogleLogin: () => '/v1/auth/google',
  putRefresh: () => '/v1/auth/refresh',
  putApiKey: () => '/v1/auth/api-key',
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
