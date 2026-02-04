import { BookOpen, Code2, User } from 'lucide-react';

import { DocsSection } from './types';

export const docsSections: DocsSection[] = [
  {
    label: 'Overview',
    href: '/docs',
    icon: BookOpen,
  },
  {
    label: 'OpenAPI',
    href: '/docs/api',
    icon: Code2,
    children: [
      {
        label: 'HTTP',
        href: '/docs/api/http',
        children: [
          {
            label: '학생 데이터 OpenAPI',
            href: '/docs/api/http/student',
          },
          {
            label: '동아리 데이터 OpenAPI',
            href: '/docs/api/http/club',
          },
          {
            label: '프로젝트 데이터 OpenAPI',
            href: '/docs/api/http/project',
          },
          {
            label: 'NEIS 데이터 OpenAPI',
            href: '/docs/api/http/neis',
          },
        ],
      },
      {
        label: 'SDK',
        href: '/docs/api/sdk',
        children: [
          {
            label: 'Java / Kotlin SDK',
            href: '/docs/api/sdk/java',
          },
        ],
      },
    ],
  },
  {
    label: 'OAuth',
    href: '/docs/oauth',
    icon: User,
    children: [
      {
        label: 'SDK',
        href: '/docs/oauth/sdk',
        children: [
          {
            label: 'Java / Kotlin SDK',
            href: '/docs/oauth/sdk/java',
          },
        ],
      },
    ],
  },
];
