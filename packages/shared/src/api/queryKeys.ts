export const authQueryKeys = {
  getApiKey: () => ['auth', 'api-key', 'get'] as const,
  getApiKeyRenewable: () => ['auth', 'api-key', 'renewable'] as const,
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
  getStudents: () => ['students', 'list'] as const,
  getStudentById: (studentId: string) => ['students', 'detail', studentId] as const,
  patchStudentById: (studentId: string) => ['students', 'update', studentId] as const,
  postStudent: () => ['students', 'create'] as const,
} as const;

export const healthQueryKeys = {
  getHealth: () => ['health', 'check'] as const,
} as const;
