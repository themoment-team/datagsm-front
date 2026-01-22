export const SCOPE_CATEGORIES = [
  {
    category: '학생 정보',
    scopes: [
      {
        id: 'student:*',
        name: 'student:*',
        description: '학생 정보 모든 권한',
        level: 'all' as const,
      },
      {
        id: 'student:read',
        name: 'student:read',
        description: '학생 정보 조회',
        level: 'read' as const,
      },
    ],
  },
  {
    category: '동아리 정보',
    scopes: [
      { id: 'club:*', name: 'club:*', description: '동아리 정보 모든 권한', level: 'all' as const },
      {
        id: 'club:read',
        name: 'club:read',
        description: '동아리 정보 조회',
        level: 'read' as const,
      },
    ],
  },
  {
    category: '프로젝트 정보',
    scopes: [
      {
        id: 'project:*',
        name: 'project:*',
        description: '프로젝트 정보 모든 권한',
        level: 'all' as const,
      },
      {
        id: 'project:read',
        name: 'project:read',
        description: '프로젝트 정보 조회',
        level: 'read' as const,
      },
    ],
  },
  {
    category: 'NEIS 정보',
    scopes: [
      { id: 'neis:*', name: 'neis:*', description: 'NEIS 정보 모든 권한', level: 'all' as const },
      {
        id: 'neis:read',
        name: 'neis:read',
        description: 'NEIS 정보 조회 (학사일정/급식)',
        level: 'read' as const,
      },
    ],
  },
];
