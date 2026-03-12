export const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? 'http://localhost:3002';

export const NAV_LINKS = {
  client: [
    { href: '/', label: 'APIKEY' },
    { href: '/clients', label: 'CLIENT' },
    { href: DOCS_URL, label: 'DOCS' },
    { href: './mypage', label: 'MY' },
  ],
  admin: [
    { href: '/students', label: '학생' },
    { href: '/clubs', label: '동아리' },
    { href: '/projects', label: '프로젝트' },
    { href: '/api-key', label: 'API 키' },
  ],
} as const;
