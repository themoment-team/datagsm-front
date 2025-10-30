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
  getStudents: () => '/v1/students',
  patchStudentById: (studentId: string) => `/v1/students/${studentId}`,
  postStudent: () => '/v1/students',
} as const;
