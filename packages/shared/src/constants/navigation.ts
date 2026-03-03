export const DOCS_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://docs.datagsm-front-client.vercel.app'
    : 'http://localhost:3002';

export const NAV_LINKS = {
  client: [
    { href: '/', label: '메인' },
    { href: '/clients', label: '클라이언트' },
    { href: DOCS_URL, label: '독스' },
  ],
  admin: [
    { href: '/students', label: '학생' },
    { href: '/clubs', label: '동아리' },
    { href: '/projects', label: '프로젝트' },
    { href: '/api-key', label: 'API 키' },
  ],
} as const;
