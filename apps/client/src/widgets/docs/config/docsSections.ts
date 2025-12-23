import { BookOpen, Code2, User } from 'lucide-react';

export interface DocsSection {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: {
    label: string;
    href: string;
  }[];
}

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
        label: '학생 데이터 OpenAPI',
        href: '/docs/api/student',
      },
    ],
  },
  {
    label: 'OAuth',
    href: '/docs/oauth',
    icon: User,
  },
];
