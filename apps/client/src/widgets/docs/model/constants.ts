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
            children: [
              {
                label: '급식 정보 API',
                href: '/docs/api/http/neis/meals',
              },
              {
                label: '학사일정 정보 API',
                href: '/docs/api/http/neis/schedules',
              },
            ],
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
          {
            label: 'Python SDK',
            href: '/docs/api/sdk/python',
          },
          {
            label: 'JavaScript / TypeScript SDK',
            href: '/docs/api/sdk/javascript',
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
        label: 'PKCE 가이드',
        href: '/docs/oauth/pkce',
      },
      {
        label: 'HTTP',
        href: '/docs/oauth/http',
        children: [
          {
            label: '인증 코드 발급',
            href: '/docs/oauth/http/code',
          },
          {
            label: '토큰 교환',
            href: '/docs/oauth/http/token',
          },
          {
            label: '토큰 갱신',
            href: '/docs/oauth/http/tokens',
          },
          {
            label: '사용자 정보 조회',
            href: '/docs/oauth/http/userinfo',
          },
        ],
      },
      {
        label: 'Examples',
        href: '/docs/oauth/examples',
        children: [
          {
            label: 'React + Spring Boot (BFF)',
            href: '/docs/oauth/example/react-spring',
          },
          {
            label: 'Next.js + Spring Boot',
            href: '/docs/oauth/examples/nextjs-spring-boot',
          },
          {
            label: 'React + Spring Boot (Kotlin)',
            href: '/docs/oauth/examples/react-spring-boot-kotlin',
          },
          {
            label: 'Vanilla JS + NestJS',
            href: '/docs/oauth/examples/vanilla-nestjs',
          },
        ],
      },
      {
        label: 'SDK',
        href: '/docs/oauth/sdk',
        children: [
          {
            label: 'React',
            href: '/docs/oauth/sdk/react',
          },
          {
            label: 'Java / Kotlin SDK',
            href: '/docs/oauth/sdk/java',
          },
        ],
      },
    ],
  },
];
