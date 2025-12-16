export const authQueryKeys = {
  deleteApiKey: () => ['auth', 'api-key', 'delete'] as const,
  getApiKey: () => ['auth', 'api-key', 'get'] as const,
  getApiKeyRenewable: () => ['auth', 'api-key', 'renewable'] as const,
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
  putStudentById: (studentId: number) => ['students', 'update', studentId] as const,
} as const;

export const healthQueryKeys = {
  getHealth: () => ['health', 'check'] as const,
} as const;
