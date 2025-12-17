'use client';

import { useState } from 'react';

import Link from 'next/link';

import { cn } from '@repo/shared/utils';
import { BookOpen, ChevronDown, Code2 } from 'lucide-react';

import { useDocsSidebar } from '@/widgets/docs';

type Section = {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: {
    label: string;
    href: string;
  }[];
};

const sections: Section[] = [
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
];

const DocsSidebar = () => {
  const { isActive } = useDocsSidebar();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggle = (href: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  return (
    <aside className="sticky top-24 h-fit w-64 shrink-0">
      <h2 className="text-muted-foreground mb-4 text-sm font-semibold">목차</h2>

      <nav className="space-y-1">
        {sections.map(({ label, href, icon: Icon, children }) => {
          const isOpen = openMap[href];
          const active = isActive(href);

          return (
            <div key={href}>
              <Link
                href={href}
                onClick={() => {
                  if (children) toggle(href);
                }}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>

                {children && (
                  <ChevronDown
                    className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                  />
                )}
              </Link>

              {children && isOpen && (
                <div className="mt-1 space-y-1 pl-9">
                  {children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'block rounded-md px-3 py-1.5 text-sm transition-colors',
                        isActive(child.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default DocsSidebar;
