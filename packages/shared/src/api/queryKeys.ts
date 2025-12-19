export const authQueryKeys = {
  getApiKey: () => ['auth', 'api-key', 'get'] as const,
  getAvailableScope: (userRole: string) =>
    ['auth', 'api-key', 'available-scope', userRole] as const,
  deleteApiKey: () => ['auth', 'api-key', 'delete'] as const,
  postApiKey: () => ['auth', 'api-key', 'create'] as const,
  putApiKey: () => ['auth', 'api-key', 'update'] as const,

  postGoogleLogin: () => ['auth', 'google', 'login'] as const,
  putRefresh: () => ['auth', 'refresh'] as const,
} as const;

export const clubQueryKeys = {
  getClubs: () => ['clubs', 'list'] as const,
  getClubById: (clubId: string) => ['clubs', 'detail', clubId] as const,
  deleteClubById: (clubId: string) => ['clubs', 'delete', clubId] as const,
  patchClubById: (clubId: string) => ['clubs', 'update', clubId] as const,
  postClub: () => ['clubs', 'create'] as const,
} as const;

export const studentQueryKeys = {
  getStudents: (
    page: number,
    size: number,
    grade?: number,
    classNum?: number,
    sex?: string,
    role?: string,
    isLeaveSchool?: boolean,
  ) => ['students', 'list', { page, size, grade, classNum, sex, role, isLeaveSchool }] as const,
  getStudentById: (studentId: number) => ['students', 'detail', studentId] as const,
  postStudent: () => ['students', 'create'] as const,
  postStudentExcel: () => ['students', 'excel', 'upload'] as const,
  putStudentById: (studentId: number) => ['students', 'update', studentId] as const,
} as const;

export const healthQueryKeys = {
  getHealth: () => ['health', 'check'] as const,
} as const;
