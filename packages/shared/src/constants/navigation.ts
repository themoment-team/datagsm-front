export const NAV_LINKS = {
  client: [
    { href: '/', label: '메인' },
    { href: '/docs', label: '독스' },
  ],
  admin: [
    { href: '/students', label: '학생' },
    { href: '/club', label: '동아리' },
    { href: '/project', label: '프로젝트' },
    { href: '/api-key', label: 'API 키' },
  ],
} as const;
